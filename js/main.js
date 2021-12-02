let gl;
let bufferInfo;
let skyboxProgramInfo;
let quadBufferInfo;
let v3 = twgl.v3;
let m4 = twgl.m4;
let mat4;
const loader = new THREE.OBJLoader();

let fov = deg2rad(60);
let cameraAngles = {
  y_angle: 180,
  x_angle: -60,
};
let forward;
let right;

let near = 0.01;
let far = 2000;
let aspect;
let projectionMatrix;
let viewMatrix;

let radius = 1;
// let camera = {
//     position: [0, 0, 0],
//     lookAt: [0, 0, -1]
// };

let defaultModel;

let textures;
let scene = [];

let canvas;

let showGui = false;

const menu = new gui();

let targets = [];

const repo = "https://raw.githubusercontent.com/RBugge/webgl-game/main/";

/** @type {WebGLRenderingContext} */
window.addEventListener("load", async function () {
  mat4 = importMat4();

  // Get canvas element and initialize input event handlers
  canvas = document.getElementById("glcanvas");
  initInput();

  // Initialize webgl canvas
  gl = canvas.getContext("webgl2");
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.3, 0.4, 0.5, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  projectionMatrix = m4.perspective(fov, aspect, near, far);

  // Load textures here
  textures = twgl.createTextures(gl, {
    default: {
      src: repo + "assets/default/defaultTexture.jpg",
      flipY: true,
    },
    rayman: {
      src: repo + "assets/rayman/Rayman.png",
      flipY: true,
    },
    environment: {
      target: gl.TEXTURE_CUBE_MAP,
      src: await [
        "posx.jpg",
        "negx.jpg",
        "posy.jpg",
        "negy.jpg",
        "posz.jpg",
        "negz.jpg",
      ].map(
        (url) => "https://twgljs.org/examples/images/niagarafalls2s/" + url
      ),
      flipY: false,
      min: gl.LINEAR_MIPMAP_LINEAR,
    },
    revolver: {
      src: repo + "assets/Textures/revolver_textures/Revolver_Base_color.png",
      flipY: true,
    },
    revolverNormal: {
      src:
        repo + "assets/Textures/revolver_textures/Revolver_Normal_OpenGL.png",
      flipY: true,
    },
    target: {
      src:
        repo + "assets/Textures/target_textures/GrainyPlastic_Base_color.png",
      flipY: true,
    },
    targetNormal: {
      src: "assets/Textures/target_textures/GrainyPlastic_Normal_OpenGL.png",
      flipY: true,
    },
    level: {
      src: repo + "assets/level/LevelPlaceholder.mtl",
      flipY: true,
    },
  });
  cubemap = textures.environment;
  initSkybox();

  // Load models here, only OBJs can be loaded currently
  const models = {
    sphere: createSCs(await loadOBJ(repo + "assets/default/sphere.obj")),
    cube: createSCs(await loadOBJ(repo + "assets/default/cube.obj")),
    rayman: createSCs(await loadOBJ(repo + "assets/rayman/raymanModel.obj")),
    boy: createSCs(await loadOBJ(repo + "assets/boy/BoyOBJ.obj")),
    revolver: createSCs(
      await loadOBJ(repo + "assets/revolver/revolverNoSight.obj")
    ),

    // Testing the target spawn
    target: createSCs(await loadOBJ(repo + "assets/target/Target.obj")),
    level: createSCs(await loadOBJ(repo + "assets/level/LevelPlaceholder.obj")),
    // Testing the target spawn
  };

  // Camera object with lookAt as child
  // Set render to false so no model shows. Models can be added for debugging purposes
  lookAt = new GameObject({
    model: models.cube,
    render: false,
  }).translate([0, 0, -5]);

  camera = new GameObject({
    script: cameraScript,
    render: false,
  }).addChild(lookAt);

  // Gun placeholder will need to adjust for gun model
  gun = new GameObject({
    model: models.revolver,
    texture: textures.revolver,
    shaders: revolverShaders,
    render: true,
    script: gunScript,
    normalTexture: textures.revolverNormal,
  })
    .scale(0.1)
    .translate([0.09, -0.08, -0.2]);
  camera.addChild(gun);

  // Player Object with camera attached
  player = new GameObject({
    script: playerScript,
    render: false,
  })
    .addChild(camera)
    .setPosition([0, 1, 15]);

  // Example Game Objects
  rayman = new GameObject({
    model: models.rayman,
    texture: textures.rayman,
    shaders: raymanShaders,
    script: raymanScript,
  });

  boy = new GameObject({
    model: models.boy,
  });

  sphere = new GameObject({
    model: models.sphere,
  });

  // Example transformations

  // Can create empty objects to be used as containers
  // Container objects are useful for positioning child objects in local space
  boyContainer = new GameObject().addChild(boy).rotate({ z: 45 });

  rayman.scale(2).addChild(boyContainer);

  boyContainer.translate([0, 0, -2]);
  rayman.translate([4, 0, 0], false).rotate({ z: 45 });

  // Destroy objects like this
  // delete sphere.destroy();

  rayman
    .clone() // Returns the clone of the object
    .translate([-8, 0, 0], false);

  cloneContainer = new GameObject();

  // Testing the target spawn
//   target0 = new GameObject({
//       model: models.target,
//       texture: textures.target,
//       normalTexture: textures.targetNormal,
//       shaders: targetShadersAlt,
//   })
//       .rotate({x: 90})
//       .setPosition([0, 3, -15]);
//   target1 = new GameObject({
//       model: models.target,
//       texture: textures.target,
//       normalTexture: textures.targetNormal,
//       shaders: targetShadersAlt,
//   })
//       .rotate({x: 90})
//       .setPosition([0, 7, -15]);
//   target2 = new GameObject({
//       model: models.target,
//       texture: textures.target,
//       normalTexture: textures.targetNormal,
//       shaders: targetShadersAlt,
//   })
//       .rotate({x: 90})
//       .setPosition([-5, 4, -15]);
//   target3 = new GameObject({
//       model: models.target,
//       texture: textures.target,
//       normalTexture: textures.targetNormal,
//       shaders: targetShadersAlt,
//   })
//       .rotate({x: 90})
//       .setPosition([5, 4, -15]);
//   target4 = new GameObject({
//       model: models.target,
//       texture: textures.target,
//       normalTexture: textures.targetNormal,
//       shaders: targetShadersAlt,
//   })
//       .rotate({x: 90})
//       .setPosition([-2.5, -1, -15]);
//   target5 = new GameObject({
//       model: models.target,
//       texture: textures.target,
//       normalTexture: textures.targetNormal,
//       shaders: targetShadersAlt,
//   })
//       .rotate({x: 90})
//       .setPosition([2.5, -1, -15]);
  
  for (let i = 0; i < 20; i++) {
    target = new GameObject({
      model: models.target,
      texture: textures.target,
      normalTexture: textures.targetNormal,
      shaders: targetShadersAlt,
    })
        .rotate({x: 90})
        .setPosition([
          (Math.random() < 0.5 ? -1 : 1)*(Math.random()*(-25)+25),
          (Math.random() < 0.5 ? -(Math.random()*(4))+1 : (Math.random()*(11)+4)),
          -(Math.random()*(15)+15)]);
    targets.push(target);
  }

  level = new GameObject({
    model: models.level,
    texture: textures.target,
  })
    .scale(50)
    .setPosition([0, -5, 0]);
  /*
        positive x will move target to the right, negative x to the left
        positive y will move target to up, negative y down
        positive z will move target behind player, negative in front
     */
  // Testing the target spawn

  // start render loop
  gameLoop = new GameLoop(onRender).start();
});

renderSkybox = (skyboxProgramInfo) => {
  const invViewMatrix = m4.inverse(viewMatrix);
  const invProjectionMatrix = m4.inverse(projectionMatrix);
  const invViewProjectionMatrix = m4.multiply(
    invViewMatrix,
    invProjectionMatrix
  );
  const eyePosition = invViewMatrix.slice(12, 15);

  const uniforms = {
    cubemap,
    invViewProjectionMatrix,
    eyePosition,
  };
  gl.depthFunc(gl.LEQUAL);
  gl.useProgram(skyboxProgramInfo.program);
  twgl.setUniforms(skyboxProgramInfo, uniforms);

  twgl.setBuffersAndAttributes(gl, skyboxProgramInfo, quadBufferInfo);
  twgl.drawBufferInfo(gl, quadBufferInfo);
  gl.depthFunc(gl.LESS);
};

updateViewMatrix = () => {
  const cameraMatrix = m4.lookAt(camera.position, lookAt.position, [0, 1, 0]);
  viewMatrix = m4.inverse(cameraMatrix);
};

// Clone/destroy test
let prevTime = 0;
let count = 0;
let rad = Math.PI / 10;

// Main Loop, called every frame
onRender = () => {
  // Update gl canvas and aspect ratio when resizing window
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  // Update projectionMatrix and viewMatrix each frame
  projectionMatrix = m4.perspective(fov, aspect, near, far);
  updateViewMatrix();

  // Update the forward and right vectors
  forward = v3.subtract(lookAt.position, camera.position);
  forward[1] = 0;
  forward = v3.normalize(forward);
  right = v3.cross(forward, [0, 1, 0]);

  // Render every game object and run its update function
  scene.forEach((o) => {
    if (o.update) o.update();
    if (o.render) o.render(o);
  });
  
  // Input to test the destruction of objects
  if (Input.t)
      target0.destroy();
  if (Input.y)
      target1.destroy();
  if (Input.u)
      target2.destroy();
  if (Input.i)
      target3.destroy();
  if (Input.o)
      target4.destroy();
  if (Input.l)
      target5.destroy();
  // Input to test the destruction of objects

  // Clone/destroy test
  // count++;
  // if (count <= 370) {
  //     sphere.clone(cloneContainer).translate([2 * Math.sin(2 * time), 2 * Math.cos(2 * time), count * (13 / 370)]);
  // } else if (cloneContainer.children.at(-1)) delete cloneContainer.children.at(-1).destroy();
  // else count = 0;
  menu.run();
  renderSkybox(skyboxProgramInfo);
};
