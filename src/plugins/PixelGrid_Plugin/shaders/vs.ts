export default /* glsl */`#version 300 es
precision highp float;
in vec2 a_position;

uniform mat3 u_matrixV;
uniform mat3 u_matrixP;

out vec2 localPosition;
out vec3 worldPosition;

void main() {
    gl_Position = vec4(a_position, 0, 1.0);
}
`
