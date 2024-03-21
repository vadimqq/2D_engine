export default /* glsl */`
// #ifdef GL_ES
// precision mediump float;
// #endif
//
// attribute vec2 a_position;
//
// uniform mat3 u_matrix;
// uniform mat3 u_matrixV;
// uniform mat3 u_matrixP;
//
// varying float v_PI;
// varying float v_INNER_RADIUS;
// varying float v_OUTER_RADIUS;
// varying vec2 v_POSITION;
// varying float v_ROTATION;
// varying float v_START_ANGLE;
// varying float v_END_ANGLE;
//
// void main() {
//     v_PI = 3.1415926535;
//     v_INNER_RADIUS = 80.0;
//     v_OUTER_RADIUS = 150.0;
//     v_POSITION = vec2(300.0, 300.0);
//     v_ROTATION = v_PI / 1.0;
//     v_START_ANGLE = 0.0;
//     v_END_ANGLE = v_PI * 1.1;
//
//     vec2 position = (u_matrixP * u_matrixV * u_matrix * vec3(a_position, 1)).xy;
//     gl_Position = vec4( position, 0, 1);
// }


attribute vec2 a_position;

uniform mat3 u_matrix;
uniform mat3 u_matrixP;
uniform mat3 u_matrixV;

void main() {
    vec2 position = (u_matrixP * u_matrixV * u_matrix * vec3(a_position, 1)).xy;
    gl_Position = vec4( position, 0, 1);
}

`