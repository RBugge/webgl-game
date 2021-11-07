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

let near = 0.01;
let far = 2000;
let aspect;
let projectionMatrix;
let viewMatrix;

let radius = 1;
let camera;

let defaultModel;

let textures;
let scene = [];

/** @type {WebGLRenderingContext} */
window.addEventListener("load", async function () {
    mat4 = importMat4();

    gl = document.getElementById("glcanvas").getContext("webgl2");
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.3, 0.4, 0.5, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    projectionMatrix = m4.perspective(fov, aspect, near, far);

    textures = twgl.createTextures(gl, {
        default: {
            src: 'assets/default/defaultTexture.jpg',
            flipY: true
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

    const models = {
        rayman: createSCs(await loadOBJ('assets/rayman/raymanModel.obj')),
        boy: createSCs(await loadOBJ('assets/boy/BoyOBJ.obj')),
    };

    defaultModel = {}
    // Example Game Objects
    rayman = new GameObject({
        model: models.rayman,
        texture: textures.rayman,
        shaders: raymanShaders,
        script: raymanScript
    });

    boy = new GameObject({
        model: models.boy,
    });

    // Example transforms
    rayman.translate([0, 0, 0]);
    rayman.rotate({z: 30});
    rayman.scale(2);

    boy.rotate({z: 90});
    boy.translate([2, 0, 0]);

    // house.scale(0.5);

    camera = {
        position: [0, 0, 0],
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
    gameLoop = new GameLoop(onRender).start();
});

renderScene = (viewMatrix, projectionMatrix, o) => {
    let programInfo = o.programInfo;
    gl.useProgram(programInfo.program);
    // const eyePosition = m4.inverse(viewMatrix).slice(12, 15);
    const eyePosition = camera.position;
    const uniforms = ({
        eyePosition,
        modelMatrix: o.modelMatrix,
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

// Might be able to remove most of this
updateViewMatrix = () => {
    // const gazeDirection = m4.transformDirection(
    //     m4.multiply(m4.rotationY(y_angle), m4.rotationX(x_angle)),
    //     [0, 0, 1]
    // );
    // const eye = v3.add(camera.lookAt, v3.mulScalar(gazeDirection, r * object.modelDim.dia));
    // const eye = v3.add(camera.lookAt, camera.position);
    const cameraMatrix = m4.lookAt(camera.position, camera.lookAt, [0, 1, 0]);
    viewMatrix = m4.inverse(cameraMatrix);
}

// Main Loop, called every frame
onRender = () => {
    aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    camera.position = [Math.sin(time), 1, 5];
    updateViewMatrix();

    // Render every game object and run its update function
    scene.forEach(o => {
        o.update();
        renderScene(
            viewMatrix,
            projectionMatrix,
            o
        );
    });

    renderSkybox(
        skyboxProgramInfo,
        viewMatrix,
        projectionMatrix
    );
}