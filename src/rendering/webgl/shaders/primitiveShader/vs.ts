export default /* glsl */`
attribute vec2 a_position;

uniform mat3 u_matrix;
uniform mat3 u_matrixP;
uniform mat3 u_matrixV;

void main() {
    vec2 position = (u_matrixP * u_matrixV * u_matrix * vec3(a_position, 1)).xy;
    gl_Position = vec4( position, 0, 1);
}
`
