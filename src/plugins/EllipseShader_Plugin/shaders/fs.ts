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

float circleShape(vec2 position) {
    // Используйте переданные константы
    float distance = length(position - v_POSITION);
    if (distance < v_INNER_RADIUS || distance > v_OUTER_RADIUS) {
        discard;  // Фрагмент вне круга
    } else {
        float angle = atan(position.y - v_POSITION.y, position.x - v_POSITION.x);
        float normalizedAngle = mod(angle, v_PI * 2.0);
        if (normalizedAngle >= v_START_ANGLE && normalizedAngle <= v_END_ANGLE) {
            return 1.0;  // Фрагмент внутри сектора круга (жёлтый)
        } else {
            return 0.0;  // Фрагмент вне сектора круга (чёрный)
        }
    }
}

void main() {
    vec2 position = gl_FragCoord.xy;

    vec3 color = vec3(0.9843, 1.0, 0.0);

    float ring = circleShape(position);

    color *= ring;

    gl_FragColor = vec4(color, 1.0);
}
`