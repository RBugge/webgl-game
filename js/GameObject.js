// const translationScale = 2;
const modelScale = 2;
class GameObject {
    children = [];

    // Initialize transform/model
    transform = {
        Rotation: { x: 0, y: 0, z: 0 },
        Translation: [0, 0, 0],
        Scale: { x: 1, y: 1, z: 1 },
    }
    worldTranslation = [0, 0, 0];
    position = [0, 0, 0];
    modelMatrix = m4.identity();
    modelDim = { dia: 1 };

    constructor(params) {
        if (params) {
            this.params = params;
            this.model = params.model;
            this.texture = params.texture ? params.texture : textures.default;
            this.shaders = params.shaders ? params.shaders : defaultShaders;
            this.collider = params.collider;
            if (params.script) {
                this.script = new params.script(this);
                this.update = this.script.update;
            }

            if (params.render || (params.render === undefined))
                this.render = (this.script && this.script.render) ? this.script.render : defaultRender;
            if (this.collider)
                this.collider.callback = this.script.onCollision;
        }

        if (this.model) {
            this.modelDim = computeModelExtent(this.model);

            // Center Objects
            for (let i = 0; i < this.model.length; i++) {
                for (let j = 0; j < this.model[i].sc.positions.length; j++) {
                    this.model[i].sc.positions[j] -= this.modelDim.center[j % 3];
                }
            }

            // Recompute model extents
            this.modelDim = computeModelExtent(this.model);
            this.setModelMatrix();

            this.vertexAttributes = this.model.map((d) => ({
                position: { numComponents: 3, data: d.sc.positions },
                normal: { numComponents: 3, data: d.sc.normals },
                uv: { numComponents: 2, data: d.sc.uvs },
            }));

            this.bufferInfoArray = this.vertexAttributes.map((vertexAttributes) =>
                twgl.createBufferInfoFromArrays(gl, vertexAttributes)
            );
            this.programInfo = twgl.createProgramInfo(gl, [this.shaders.vs, this.shaders.fs]);
        }

        // Add to scene and run object's start script
        scene.push(this);
        if (params && params.script) {
            this.script.start();
        }
        return this;
    }

    // Apply model transformations
    // See https://observablehq.com/@spattana/cap4720-2021-assignment4
    setModelMatrix = () => {
        // Uniform translation in world space
        let T = m4.translation(
            v3.multiply(
                v3.divide(
                    this.transform.Translation,
                    [this.transform.Scale.x,
                    this.transform.Scale.y,
                    this.transform.Scale.z]
                ),
                Array(3).fill(this.modelDim.dia / 2)
            )
        );

        let R_x = m4.rotationX(this.transform.Rotation.x);
        let R_y = m4.rotationY(this.transform.Rotation.y);
        let R_z = m4.rotationZ(this.transform.Rotation.z);

        let S = m4.scaling([
            modelScale / this.modelDim.dia * this.transform.Scale.x,
            modelScale / this.modelDim.dia * this.transform.Scale.y,
            modelScale / this.modelDim.dia * this.transform.Scale.z
        ]);

        // Add world translation
        this.modelMatrix = m4.multiply(m4.multiply(m4.multiply(m4.multiply(S, R_z), R_y), R_x), T);
        this.modelMatrix[12] += this.worldTranslation[0];
        this.modelMatrix[13] += this.worldTranslation[1];
        this.modelMatrix[14] += this.worldTranslation[2];

        // Jankiness to store position with fixed number of decimals to avoid float errors
        let temp = [];
        this.position = this.modelMatrix.subarray(12, 15).map(val =>
            temp.push(parseFloat(Number(Math.round(parseFloat(val + 'e' + 2)) + 'e-' + 2).toFixed(2)))
        );
        this.position = temp;
    }

    // Accumulate translations, set world to true to translate in world space
    translate = (vector, world) => {
        (world == true) ? this.worldTranslation = v3.add(this.worldTranslation, vector)
            : this.transform.Translation = v3.add(this.transform.Translation, vector);
        this.setModelMatrix();
        this.children.forEach(child => child.setPosition(this.position, true));
        return this;
    }

    // Sets the position in world space and removes any previous translations
    setPosition = (position, isChild) => {
        let diff = v3.subtract(position, this.position);
        this.children.forEach(child => child.setPosition(position, true));
        this.worldTranslation = position;
        if (!isChild) this.transform.translation = [0, 0, 0];
        this.setModelMatrix();
        return this;
    }

    // Accumulate rotations
    rotate = (rot) => {
        if (rot.x) this.transform.Rotation.x += deg2rad(rot.x);
        if (rot.y) this.transform.Rotation.y += deg2rad(rot.y);
        if (rot.z) this.transform.Rotation.z += deg2rad(rot.z);
        this.setModelMatrix();
        this.children.forEach(child => {
            child.setPosition(this.position, true);
            child.rotate(rot)
        });
        return this;
    }

    // Set scale
    scale = (scale) => {
        if (Number.isFinite(scale))
            return this.scale({ x: scale, y: scale, z: scale });
        if (scale.x) this.transform.Scale.x = scale.x;
        if (scale.y) this.transform.Scale.y = scale.y;
        if (scale.z) this.transform.Scale.z = scale.z;
        this.setModelMatrix();
        this.children.forEach(child => child.scale(scale));
        return this;
    }

    addChild = (child) => {
        this.children.push(child);
        child.parent = this;
        return this;
    }

    destroy = () => {
        scene.splice(scene.indexOf(this), 1);
        if (this.parent) this.parent.children.splice(this.parent.children.indexOf(this), 1);
        this.children.forEach(child => child.destroy());
    }

    clone = (newParent) => {
        let clone = new GameObject(this.params);

        clone.transform = JSON.parse(JSON.stringify(this.transform));
        clone.worldTranslation = this.worldTranslation;
        clone.position = this.position;

        this.children.forEach(child => child.clone(clone));
        if (newParent) newParent.addChild(clone);
        else if (this.parent) this.parent.addChild(clone);

        return clone;
    }
}