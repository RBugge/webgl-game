/*
----------------------------------------------------------------------------------
Scripts should follow this template

Each one needs a unique class name

Scripts are attached in the GameObject Constructor

oThis is the reference to the object that the script is attached to

start is the initialization function and is called when the GameObject is created

update is called every frame
----------------------------------------------------------------------------------
*/
class defaultScript {
    constructor(oThis) {
        this.oThis = oThis;
    }

    start = () => {

    }

    update = () => {

    }

    render = defaultRender;
}

defaultRender = (o) => {
    gl.useProgram(o.programInfo.program);
    // const eyePosition = m4.inverse(viewMatrix).slice(12, 15);

    //distance light
    const light1 = [-20, 30, 15];
    //position lights
    const light2 = [8, 1, 3];
    const light3 = [8, 1, 27];

    const uniforms = ({
        eyePosition: camera.position,
        modelMatrix: o.modelMatrix,
        viewMatrix: viewMatrix,
        projectionMatrix: projectionMatrix,
        tex: o.texture,
        cubeMapTex: cubemap,
        mapping: 1,
        normalTexture: o.normalTexture,
        light1: light1,
        light2: light2,
        light3: light3
    })
    twgl.setUniforms(o.programInfo, uniforms);

    o.bufferInfoArray.forEach((bufferInfo) => {
        twgl.setBuffersAndAttributes(gl, o.programInfo, bufferInfo);
        twgl.drawBufferInfo(gl, bufferInfo);
    });
}
