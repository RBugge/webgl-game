let gl;
let bufferInfo;
let skyboxProgramInfo;
let quadBufferInfo;
let v3 = twgl.v3;
let m4 = twgl.m4;
let mat4;
const loader = new THREE.OBJLoader();

let fov = 70;
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
            src: 'assets/default/defaultTexture.jpg',
            flipY: true,
        },
        rayman: {
            src: 'assets/rayman/Rayman.png',
            flipY: true
        },
        environment: {
            target: gl.TEXTURE_CUBE_MAP,
            src: await [
                "posx.jpg",
                "negx.jpg",
                "posy.jpg",
                "negy.jpg",
                "posz.jpg",
                "negz.jpg"
            ].map((url) => "https://twgljs.org/examples/images/niagarafalls2s/" + url),
            flipY: false,
            min: gl.LINEAR_MIPMAP_LINEAR
        }
    });
    cubemap = textures.environment;
    initSkybox();

    // Load models here, only OBJs can be loaded currently
    const models = {
        sphere: createSCs(await loadOBJ('assets/default/sphere.obj')),
        cube: createSCs(await loadOBJ('assets/default/cube.obj')),
        rayman: createSCs(await loadOBJ('assets/rayman/raymanModel.obj')),
        boy: createSCs(await loadOBJ('assets/boy/BoyOBJ.obj')),
        revolver: createSCs(await loadOBJ('assets/revolver/revolver_light.obj')),
    };



    // Camera object with lookAt as child
    // Set render to false so no model shows. Models can be added for debugging purposes
    lookAt = new GameObject({
        model: models.cube,
        render: false,
    });
    lookAt.translate([0, 0, -5]);

    camera = new GameObject({
        script: cameraScript,
        render: false,
    });
    camera.addChild(lookAt);



    // Gun placeholder will need to adjust for gun model
    gun = new GameObject({
        model: models.cube,
    });
    gun.scale(0.05);
    gun.translate([0.1, -0.1, -0.2]);
    camera.addChild(gun);



    // Player Object with camera attached
    player = new GameObject({
        script: playerScript,
        render: false,
    });
    player.addChild(camera);
    player.setPosition([0, 0, 15]);



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
    })

    // Example transformations

    // Can create empty objects to be used as containers
    // Container objects are useful for positioning child objects in local space
    boyContainer = new GameObject();
    boyContainer.addChild(boy);
    boyContainer.rotate({ z: 45 })

    rayman.scale(2);
    rayman.addChild(boyContainer);

    boyContainer.translate([0, 0, -2]);
    rayman.translate([4, 0, 0], false);
    rayman.rotate({ z: 45 })

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
        eyePosition
    };
    gl.depthFunc(gl.LEQUAL);
    gl.useProgram(skyboxProgramInfo.program);
    twgl.setUniforms(skyboxProgramInfo, uniforms);

    twgl.setBuffersAndAttributes(gl, skyboxProgramInfo, quadBufferInfo);
    twgl.drawBufferInfo(gl, quadBufferInfo);
    gl.depthFunc(gl.LESS);
}

updateViewMatrix = () => {
    const cameraMatrix = m4.lookAt(camera.position, lookAt.position, [0, 1, 0]);
    viewMatrix = m4.inverse(cameraMatrix);
}

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
    scene.forEach(o => {
        if (o.update) o.update();
        if (o.render) o.render(o);
    });

    renderSkybox(skyboxProgramInfo,);
}