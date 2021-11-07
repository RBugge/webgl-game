const translationScale = 5;
const modelScale = 2;
class GameObject {
    constructor(params) {
        this.model = params.model;
        this.texture = params.texture ? params.texture : textures.default;
        this.shaders = params.shaders ? params.shaders : defaultShaders;

        this.script = params.script ? new params.script(this) : new defaultScript(this);
        this.update = this.script.update;

        // Initialize model variables
        this.modelDim = computeModelExtent(this.model);
        this.position = [0, 0, 0];
        this.modelMatrix = m4.identity();

        // Initialize transform
        this.transform = {};
        this.transform.Rotation = { x: 0, y: 0, z: 0 };
        this.transform.Translation = [0, 0, 0];
        this.transform.Scale = { x: 1, y: 1, z: 1 };

        // Center Objects
        for (let i = 0; i < this.model.length; i++) {
            for (let j = 0; j < this.model[i].sc.positions.length; j++) {
                this.model[i].sc.positions[j] -= this.modelDim.center[j % 3];
            }
        }

        // Recompute model extents
        this.modelDim = computeModelExtent(this.model);

        this.vertexAttributes = this.model.map((d) => ({
            position: { numComponents: 3, data: d.sc.positions },
            normal: { numComponents: 3, data: d.sc.normals },
            uv: { numComponents: 2, data: d.sc.uvs },
        }));

        this.bufferInfoArray = this.vertexAttributes.map((vertexAttributes) =>
            twgl.createBufferInfoFromArrays(gl, vertexAttributes)
        );
        this.programInfo = twgl.createProgramInfo(gl, [this.shaders.vs, this.shaders.fs]);

        // Add to scene and run object's start script
        scene.push(this);
        this.script.start;
    }

    // Model transformation here
    // See https://observablehq.com/@spattana/cap4720-2021-assignment4
    // TODO:    1. Update object position
    //          2. Add translation in world space
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
                Array(3).fill(this.modelDim.dia / translationScale)
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

        this.modelMatrix = m4.multiply(m4.multiply(m4.multiply(m4.multiply(S, R_z), R_y), R_x), T);
        this.position = this.modelMatrix.subarray(12);
    }

    // Accumulate translations
    translate = (vector) => {
        this.transform.Translation = v3.add(this.transform.Translation, vector);
        this.setModelMatrix();
    }

    // Accumulate rotations
    rotate = (rot) => {
        if (rot.x) this.transform.Rotation.x += deg2rad(rot.x);
        if (rot.y) this.transform.Rotation.y += deg2rad(rot.y);
        if (rot.z) this.transform.Rotation.z += deg2rad(rot.z);
        this.setModelMatrix();
    }

    // Set scale
    scale = (scale) => {
        if (Number.isFinite(scale))
            return this.scale({ x: scale, y: scale, z: scale });
        if (scale.x) this.transform.Scale.x = scale.x;
        if (scale.y) this.transform.Scale.y = scale.y;
        if (scale.z) this.transform.Scale.z = scale.z;
        this.setModelMatrix();
    }
}