let gl;
let bufferInfo;
let skyboxProgramInfo;
let quadBufferInfo;
let v3 = twgl.v3;
let m4 = twgl.m4;
let mat4;
const loader = new THREE.OBJLoader();

let fov_Y = 70;
let cameraAngles = {
    y_angle: 180,
    x_angle: -60,
};

let near = 0.1;
let far = 2.5;
let canvasWidth = 1000;
let canvasHeight = 1000;
let aspect = canvasWidth / canvasHeight;
let radius = 1;
let camera;

let scene = [];

/** @type {WebGLRenderingContext} */
window.addEventListener("load", async function () {
    mat4 = importMat4();
    gl = document.getElementById("glcanvas").getContext("webgl2");
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.3, 0.4, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const textures = twgl.createTextures(gl, {
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

    const models = {
        rayman: createSCs(await loadOBJ('assets/rayman/raymanModel.obj'))
    };

    // Example Game Objects
    rayman = new GameObject(
        models.rayman,
        textures.rayman,
        raymanShaders,
        raymanScript
    );

    rayman2 = new GameObject(
        models.rayman,
        textures.rayman,
        raymanShaders,
        raymanScript
    );

    // Example movement
    rayman.translate([-5, 0, 0]);
    rayman2.rotate({ z: -45 });

    camera = {
        position: [0, 10, 30],
        lookAt: [0, 0, 0],
    }

    // Skybox stuff, should be separated from main
    quadBufferInfo = twgl.createBufferInfoFromArrays(gl, {
        position: {
            numComponents: 2,
            data: [-1, -1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1]
        }
    })

    let sbvs = `#version 300 es
        precision mediump float;
        in vec2 position;
        out vec2 fragPosition;
        void main() {
            fragPosition = position;
            gl_Position = vec4(position, 1, 1);
        }`;
    let sbfs = `#version 300 es
        precision mediump float;
        uniform samplerCube cubemap;
        in vec2 fragPosition;
        out vec4 outColor;
        uniform mat4 invViewProjectionMatrix;
        uniform vec3 eyePosition;

        void main () {
            vec4 farPlanePosition = invViewProjectionMatrix*vec4(fragPosition, 1, 1);
            vec3 direction = farPlanePosition.xyz/farPlanePosition.w - eyePosition;

            outColor = texture(cubemap, normalize(direction));
        }`;
    skyboxProgramInfo = twgl.createProgramInfo(gl, [sbvs, sbfs]);

    // start render loop
    // gameLoop = new RenderLoop(onRender).start();
    gameLoop = new GameLoop(onRender).start();
});

renderScene = (viewMatrix, projectionMatrix, o) => {
    let programInfo = o.programInfo;
    gl.useProgram(programInfo.program);
    // const eyePosition = m4.inverse(viewMatrix).slice(12, 15);
    const eyePosition = camera.position;
    const uniforms = ({
        eyePosition,
        modelMatrix: o.getModelMatrix(),
        viewMatrix: viewMatrix,
        projectionMatrix: projectionMatrix,
        tex: o.texture,
        cubeMapTex: cubemap,
        mapping: 1
    })
    twgl.setUniforms(programInfo, uniforms);
    o.bufferInfoArray.forEach((bufferInfo) => {
        twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
        twgl.drawBufferInfo(gl, bufferInfo);
    });
}

renderSkybox = (skyboxProgramInfo, viewMatrix, projectionMatrix) => {
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

getViewMatrix = (r, x_angle, y_angle, object) => {
    // const gazeDirection = m4.transformDirection(
    //     m4.multiply(m4.rotationY(y_angle), m4.rotationX(x_angle)),
    //     [0, 0, 1]
    // );
    // const eye = v3.add(camera.lookAt, v3.mulScalar(gazeDirection, r * object.modelDim.dia));
    // const eye = v3.add(camera.lookAt, camera.position);
    const cameraMatrix = m4.lookAt(camera.position, camera.lookAt, [0, 1, 0]);
    return m4.inverse(cameraMatrix);
}

getProjectionMatrix = (fov, near, far, object) => {
    return m4.perspective(
        deg2rad(fov),
        aspect,
        near * object.modelDim.dia,
        far * object.modelDim.dia
    );
}

// Main Loop, called every frame
onRender = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    camera.position = [10*Math.sin(time), 10, 30];

    // Render every game object and run its update function
    scene.forEach(o => {
        o.update();
        renderScene(
            getViewMatrix(
                radius,
                deg2rad(cameraAngles.x_angle),
                deg2rad(cameraAngles.y_angle),
                o
            ),
            getProjectionMatrix(fov_Y, near, far, o),
            o
        );
    });

    renderSkybox(
        skyboxProgramInfo,
        getViewMatrix(
            radius,
            deg2rad(cameraAngles.x_angle),
            deg2rad(cameraAngles.y_angle),
            rayman
        ),
        getProjectionMatrix(fov_Y, near, far, rayman)
    );
}