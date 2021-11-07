initSkybox = () => {
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
}