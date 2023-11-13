export default /* glsl */`
attribute vec2 a_position;

uniform mat3 u_matrix;

void main() {
    vec2 XY = vec2(
        u_matrix[0].x*a_position.x + u_matrix[1].x*a_position.y + u_matrix[2].x,
        u_matrix[0].y*a_position.x + u_matrix[1].y*a_position.y + u_matrix[2].y
    );
    gl_Position = vec4(XY, 0, 1);
}
`