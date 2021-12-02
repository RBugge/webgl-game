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
        K_s: 0.6,
        shininess: 50,
        specularColor: hex2rgb("#ffffff"),
        light: [50000,2000,2000, 0],
        AmbientRatio: 0, // if 1, then no lighting at all except ambient.
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
    