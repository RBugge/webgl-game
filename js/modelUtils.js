function loadOBJ(path) {
    return new Promise((resolve, reject) => {
        loader.load(
            // resource URL
            path,
            // called when resource is loaded
            function (object) {
                resolve(object);
            },
            // called when loading is in progresses
            function (xhr) {

                console.log((xhr.loaded / xhr.total * 100) + '% loaded');

            },
            // called when loading has errors
            function (error) {

                console.log('An error happened');

            }
        );
    });
}

function createSCs(obj) {
    const sceneGraph = {};
    let scs = [];
    if (obj.scene) getNode(obj.scene, mat4.create());
    else getNode(obj, mat4.create());

    function getNode(node, M) {
        const sc = {};
        sc.name = node.name;

        const translation = node.position
            ? [node.position.x, node.position.y, node.position.z]
            : [0, 0, 0];

        const quaternion = node.quaternion
            ? [
                node.quaternion.x,
                node.quaternion.y,
                node.quaternion.z,
                node.quaternion.w
            ]
            : [0, 0, 0, 1];
        //const rotation = node.rotation?[node.rotation.x,node.rotation.y,node.rotation.z]:[0,0,0];// XYZ order
        const scale =
            node.scale && node.scale.x
                ? [node.scale.x, node.scale.y, node.scale.z]
                : [1, 1, 1];

        sc.modelMatrix = mat4.multiply(
            M,
            mat4.fromRotationTranslationScale(quaternion, translation, scale)
        );

        if (node.geometry || node.attributes) {
            const attributes = node.geometry
                ? node.geometry.attributes
                : node.attributes;
            if (
                node.geometry &&
                node.geometry.groups &&
                node.geometry.groups.length > 0
            ) {
                const groups = node.geometry.groups;
                const localScs = d3.range(0, groups.length, 1).map((i) => {
                    /*
                    return{
                    positions : array2Darray(attributes.position.array.slice(groups[i].start*3, (groups[i].start+groups[i].count)*3),3),
                    normals : array2Darray(attributes.normal.array.slice(groups[i].start*3, (groups[i].start+groups[i].count)*3),3),
                    uvs : array2Darray(attributes.uv.array.slice(groups[i].start*2, (groups[i].start+groups[i].count)*2),2)
                    }
                    */
                    return createSC(attributes, {
                        start: groups[i].start,
                        count: groups[i].count
                    });
                });
                //return scs
                localScs.forEach((d, i) => {
                    //d.cells = d3.range(0,d.positions.length/3,1).map(i=>[i*3+0,i*3+1,i*3+2]);
                    scs.push({ name: sc.name, sc: d, modelMatrix: sc.modelMatrix });
                });
            } else {
                sc.sc = createSC(attributes);
                scs.push(sc);
            }
        }
        if (node.children) node.children.forEach((d) => getNode(d, sc.modelMatrix));
    }

    return scs;
}

function createSC(attributes, offset) {
    let positions = offset
        ? attributes.position.array.slice(
            offset.start * 3,
            (offset.start + offset.count) * 3
        )
        : attributes.position.array.slice();
    let normals = undefined,
        uvs = undefined;
    if (attributes.normal)
        normals = offset
            ? attributes.normal.array.slice(
                offset.start * 3,
                (offset.start + offset.count) * 3
            )
            : attributes.normal.array.slice();
    else {
        let count = positions.length / 3;
        let Ns = [];
        for (let i = 0; i < offset.count; i += 3) {
            const k = offset.start + i;
            const v0 = positions.slice(k * 9, k * 9 + 3),
                v1 = positions.slice(k * 9 + 3, k * 9 + 6),
                v2 = positions.slice(k * 9 + 6, k * 9 + 9);
            const N = Array.from(
                v3.normalize(v3.cross(v3.subtract(v1, v0), v3.subtract(v2, v0)))
            );
            Ns.push(N, N, N);
        }
        normals = Ns.flat();
    }
    if (attributes.uv)
        uvs = offset
            ? attributes.uv.array.slice(
                offset.start * 2,
                (offset.start + offset.count) * 2
            )
            : attributes.uv.array.slice();
    return {
        positions,
        normals,
        uvs
    };
}

function computeModelExtent(o) {
    const extents = o.map((d) => {
        const xExtent = d3.extent(d.sc.positions.filter((_, i) => i % 3 === 0));
        const yExtent = d3.extent(d.sc.positions.filter((_, i) => i % 3 === 1));
        const zExtent = d3.extent(d.sc.positions.filter((_, i) => i % 3 === 2));
        return {
            min: [xExtent[0], yExtent[0], zExtent[0]],
            max: [xExtent[1], yExtent[1], zExtent[1]]
        };
    });

    const transformedExtents = extents.map((extent, i) => {
        return o[i].modelMatrix
            ? {
                min: mat4.transformPoint(o[i].modelMatrix, extent.min),
                max: mat4.transformPoint(o[i].modelMatrix, extent.max)
            }
            : extent;
    });
    const xMin = d3.min(transformedExtents, (d) => d.min[0]);
    const xMax = d3.max(transformedExtents, (d) => d.max[0]);
    const yMin = d3.min(transformedExtents, (d) => d.min[1]);
    const yMax = d3.max(transformedExtents, (d) => d.max[1]);
    const zMin = d3.min(transformedExtents, (d) => d.min[2]);
    const zMax = d3.max(transformedExtents, (d) => d.max[2]);
    const min = [xMin, yMin, zMin],
        max = [xMax, yMax, zMax];
    const center = v3.divScalar(v3.add(min, max), 2); // center of AABB
    const dia = v3.length(v3.subtract(max, min)); // Diagonal length of the AABB
    return {
        min,
        max,
        center,
        dia
    };
}