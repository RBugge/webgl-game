class bulletScript {
  constructor(oThis) {
    this.oThis = oThis;
    this.speed = 500;
    this.SecToDie = 0.8;
    this.framesToDieCalc = Math.floor(1 / dt) * this.framesToDie;
    this.selfInitialAimVector = aimVector;
  }
  start = () => {};

  update = () => {
    // if (this.framesToDieCalc-- < 0)
    // {
    //     this.oThis.destroy();
    //     return;
    // }
    // this.oThis.translate(
    //     v3.multiply(this.selfInitialAimVector, [this.speed * dt, this.speed * dt, this.speed * dt]),
    //     true
    //   );
  };

  render = (o) => {
    gl.useProgram(o.programInfo.program);
    // const eyePosition = m4.inverse(viewMatrix).slice(12, 15);

    //distance light
    const light1 = [-20, 30, 15];
    //position lights
    const light2 = [8, 1, 3];
    const light3 = [8, 1, 27];

    const uniforms = {
      eyePosition: camera.position,
      modelMatrix: o.modelMatrix,
      viewMatrix: viewMatrix,
      projectionMatrix: projectionMatrix,
      tex: o.texture,
      cubeMapTex: cubemap,
      mapping: 1,
      ambientIntensity: 60 / 100,
      K_s: 0.6,
      shininess: 50,
      specularColor: hex2rgb("#ffffff"),
      light: [50000, 2000, 2000, 0],
      AmbientRatio: 0, // if 1, then no lighting at all except ambient.
      normalTexture: o.normalTexture,
      light1: light1,
      light2: light2,
      light3: light3,
    };
    twgl.setUniforms(o.programInfo, uniforms);

    o.bufferInfoArray.forEach((bufferInfo) => {
      twgl.setBuffersAndAttributes(gl, o.programInfo, bufferInfo);
      twgl.drawBufferInfo(gl, bufferInfo);
    });
  };
}

// GunRender = (o) => {
//     gl.useProgram(o.programInfo.program);
//     // const eyePosition = m4.inverse(viewMatrix).slice(12, 15);

//     //distance light
//     const light1 = [-20, 30, 15];
//     //position lights
//     const light2 = [8, 1, 3];
//     const light3 = [8, 1, 27];

//     const uniforms = ({
//         eyePosition: camera.position,
//         modelMatrix: o.modelMatrix,
//         viewMatrix: viewMatrix,
//         projectionMatrix: projectionMatrix,
//         tex: o.texture,
//         cubeMapTex: cubemap,
//         mapping: 1,
//         ambientIntensity: 60/100,
//         K_s: 0.6,
//         shininess: 50,
//         specularColor: hex2rgb("#ffffff"),
//         light: [50000,2000,2000, 0],
//         AmbientRatio: 0, // if 1, then no lighting at all except ambient.
//         normalTexture: o.normalTexture,
//         light1: light1,
//         light2: light2,
//         light3: light3
//     })
//     twgl.setUniforms(o.programInfo, uniforms);

//     o.bufferInfoArray.forEach((bufferInfo) => {
//         twgl.setBuffersAndAttributes(gl, o.programInfo, bufferInfo);
//         twgl.drawBufferInfo(gl, bufferInfo);
//     });
// }
