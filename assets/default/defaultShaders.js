/*
----------------------------------------------------------------------------------
Shaders should follow this template

Each one needs a unique name

Shaders are attached in the GameObject Constructor
----------------------------------------------------------------------------------
*/
defaultShaders = {
    vs: `#version 300 es
        precision mediump float;

        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 projectionMatrix;

        in vec3 position;
        in vec3 normal;
        in vec2 uv;

        out vec2 fragUV;
        out vec3 fragNormal;
        out vec3 fragPosition;

        void main () {
            vec4 newPosition = modelMatrix*vec4(position,1);
            fragPosition = newPosition.xyz;
            gl_Position = projectionMatrix*viewMatrix*modelMatrix*vec4(position,1);
            mat4 normalMatrix = transpose(inverse(modelMatrix));

            fragNormal = normalize((normalMatrix*vec4(normal,0)).xyz);
            fragUV = uv;
        }`,
    fs: `#version 300 es
        precision mediump float;

        uniform sampler2D tex;
        uniform samplerCube cubeMapTex;
        uniform int mapping;
        uniform vec3 eyePosition;
        uniform vec3 light1;
        uniform vec3 light2;
        uniform vec3 light3;

        in vec2 fragUV;
        in vec3 fragNormal;
        in vec3 fragPosition;

        out vec4 outColor;

        void main () {
            vec3 V = normalize(eyePosition-fragPosition);
            vec3 N = normalize(fragNormal);
            vec3 R = reflect(-V, N);
            vec3 lght1 = normalize(light1);
            vec3 lght2 = normalize(light2.xyz-fragPosition);
            vec3 lght3 = normalize(light3.xyz-fragPosition);

            vec3 texColor = texture( tex, fragUV ).rgb*clamp(dot(N, lght1),0.,1.);
            texColor += texture( tex, fragUV ).rgb*clamp(dot(N, lght2),0.,1.);     
            texColor += texture( tex, fragUV ).rgb*clamp(dot(N, lght3),0.,1.);  

            vec3 envColor = texture( cubeMapTex, R ).rgb*clamp(dot(N, lght1),0.,1.);
            envColor += texture( cubeMapTex, R ).rgb*clamp(dot(N, lght2),0.,1.);
            envColor += texture( cubeMapTex, R ).rgb*clamp(dot(N, lght3),0.,1.);

            outColor = vec4(mapping == 1 ? texColor : envColor, 1);
            // outColor = vec4(abs(N), 1);
        }`
}