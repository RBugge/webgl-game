class gunScript {
    constructor(oThis) {
        this.oThis = oThis;
    }
    start = () => {

    }

    update = () => {
       
    }
    render = GunRender;
}
GunRender = (o) => {
    gl.useProgram(o.programInfo.program);
    // const eyePosition = m4.inverse(viewMatrix).slice(12, 15);
    const uniforms = ({
        eyePosition: camera.position,
        modelMatrix: o.modelMatrix,
        viewMatrix: viewMatrix,
        projectionMatrix: projectionMatrix,
        tex: o.texture,
        cubeMapTex: cubemap,
        mapping: 1,
        ambientIntensity: 60/100,
        K_s: 0.5,
        shininess: 80,
        specularColor: hex2rgb("#ffffff"),
        light: [15000,15000,15000, 0],
        normalTexture: o.normalTexture
    })
    twgl.setUniforms(o.programInfo, uniforms);

    o.bufferInfoArray.forEach((bufferInfo) => {
        twgl.setBuffersAndAttributes(gl, o.programInfo, bufferInfo);
        twgl.drawBufferInfo(gl, bufferInfo);
    });
}

hex2rgb = (hex) =>
  (hex = hex.replace("#", ""))
    .match(new RegExp("(.{" + hex.length / 3 + "})", "g"))
    .map((l) => parseInt(hex.length % 2 ? l + l : l, 16) / 255)
    