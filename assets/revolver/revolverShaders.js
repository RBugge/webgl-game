            
           /*
----------------------------------------------------------------------------------
Shaders should follow this template

Each one needs a unique name

Shaders are attached in the GameObject Constructor
----------------------------------------------------------------------------------
*/
revolverShaders = {
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
        uniform sampler2D normalTexture;

        in vec2 fragUV;
        in vec3 fragNormal;
        in vec3 fragPosition;

        out vec4 outColor;

        void main () {
            vec3 V = normalize(eyePosition-fragPosition);
            vec3 N = normalize(fragNormal);
            vec3 R = reflect(-V, N);

            vec3 texColor = texture( tex, fragUV ).rgb;
            vec3 envColor = texture( cubeMapTex, R ).rgb;


                
            vec3 normalN = N;

            vec3 normal = texture(normalTexture, fragUV).rgb;
            // transform normal vector to range [-1,1]
            normal = normalize(normal * 2.0 - 1.0); 

            

            float normalModifier = dot(vec3(1.0,1.0,1.0), normal) * .2 + 1.2;

            float fakeLight = dot(vec3(1.0,1.0,1.0), normalN) * .1 + 0.8;
            outColor = vec4(texColor * fakeLight * normalModifier, 1.0);
            

            // outColor = vec4(texColor * , normal), 1);
            // outColor = vec4(normalize(normalTex.xyz) * texColor , 1);
            // outColor = vec4(abs(N), 1);
        }`
}
           