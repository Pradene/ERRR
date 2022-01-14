uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float uStrenght;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

#define M_PI 3.1415926535

vec3 deformationCurve(vec3 position, vec2 uv, float strenght)
{
    position.x = position.x + (sin(uv.y * M_PI) * strenght);
    return position;
}

void main()
{
    vec3 newPosition = deformationCurve(position, uv, uStrenght);
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    modelPosition.z += sin(uv.x * M_PI) * 0.03;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
}