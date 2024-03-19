export default /* glsl */`
#ifdef GL_ES
precision mediump float;
#endif

varying float v_PI;
varying float v_INNER_RADIUS;
varying float v_OUTER_RADIUS;
varying vec2 v_POSITION;
varying float v_ROTATION;
varying float v_START_ANGLE;
varying float v_END_ANGLE;

void main() {
    v_PI = 3.1415926535;
    v_INNER_RADIUS = 80.0;
    v_OUTER_RADIUS = 150.0;
    v_POSITION = vec2(300.0, 300.0);
    v_ROTATION = v_PI / 1.0;
    v_START_ANGLE = 0.0;
    v_END_ANGLE = v_PI * 1.1;

    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}
`