export default /* glsl */`
precision mediump float;

attribute vec2 a_position;

uniform mat3 u_matrix;
uniform mat3 u_matrixV;
uniform mat3 u_matrixP;
uniform vec2 u_size;
uniform float u_zoom;

varying vec2 v_position;
varying vec2 v_border;


void main() {
    vec2 position = (u_matrixP * u_matrixV * u_matrix * vec3(a_position, 1)).xy;
    gl_Position = vec4( position, 0, 1);
    v_position = a_position;
    v_border = vec2((u_size.x - 1.0) / u_zoom, (u_size.y - 1.0) / u_zoom);
}
`