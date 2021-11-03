class GameObject {
    constructor(model, texture, shaders, script) {
        this.model = model;
        this.texture = texture;
        this.shaders = shaders;

        this.script = new script(this)
        this.update = this.script.update;

        this.modelDim = computeModelExtent(this.model);
        this.position = [0, 0, 0];
        this.modelMatrix = m4.identity();

        this.vertexAttributes = this.model.map((d) => ({
            position: { numComponents: 3, data: d.sc.positions },
            normal: { numComponents: 3, data: d.sc.normals },
            uv: { numComponents: 2, data: d.sc.uvs },
        }));
        this.bufferInfoArray = this.vertexAttributes.map((vertexAttributes) =>
            twgl.createBufferInfoFromArrays(gl, vertexAttributes)
        );
        this.programInfo = twgl.createProgramInfo(gl, [this.shaders.vs, this.shaders.fs]);

        scene.push(this);
        this.script.start;
    }

    // Model transformation here
    // See https://observablehq.com/@spattana/cap4720-2021-assignment4
    // Rough example below
    // TODO:    1. apply transformations in correct order
    //          2. change transform functions to apply to separate vars so transormations are accumulated
    getModelMatrix = () => {
        return this.modelMatrix;
    }
    translate = (newPos) => {
        m4.translate(this.modelMatrix, newPos, this.modelMatrix);
    }

    rotate = (rot) => {
        if(rot.x) m4.rotateX(this.modelMatrix, deg2rad(rot.x), this.modelMatrix);
        if(rot.y) m4.rotateY(this.modelMatrix, deg2rad(rot.y), this.modelMatrix);
        if(rot.z) m4.rotateZ(this.modelMatrix, deg2rad(rot.z), this.modelMatrix);
    }

}