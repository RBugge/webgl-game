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
class levelScript {
    constructor(oThis) {
        this.oThis = oThis;
    }

    start = () => {

    }

    update = () => {

    }

    render = levelRender;
}

levelRender = (o) => {
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
        // tune these around maybe to alter color.
        // ambientIntensity: 100/100,
        // K_s: 0.8,
        // ambientIntensity: 40/100,
        // K_s: 0.4,
        // ambientIntensity: 40/100,
        // K_s: 0.2,
        ambientIntensity: 40/100,
        K_s: 0.3,
        shininess: 200,
        specularColor: hex2rgb("#ffffff"),
        light: [-20, 30, 15, 0],
        AmbientRatio: 0, // if 1, then no lighting at all except ambient.
        normalTexture: o.normalTexture,
        metallic: o.metallic,
        light1: light1,
        light2: light2,
        light3: light3
    })
    // console.log(uniforms);
    twgl.setUniforms(o.programInfo, uniforms);

    o.bufferInfoArray.forEach((bufferInfo) => {
        twgl.setBuffersAndAttributes(gl, o.programInfo, bufferInfo);
        twgl.drawBufferInfo(gl, bufferInfo);
    });
}
