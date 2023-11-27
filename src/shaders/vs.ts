export default /* glsl */`
	attribute vec2 a_Position;
	attribute vec3 a_Color;
	varying vec3 v_Color;
	uniform mat3 u_matrix;

	void main() {
		v_Color = a_Color;
		gl_Position = vec4(
			u_matrix[0].x*a_Position.x + u_matrix[1].x*a_Position.y + u_matrix[2].x,
			u_matrix[0].y*a_Position.x + u_matrix[1].y*a_Position.y + u_matrix[2].y,
			0,
			1
		);
	}
`

