export default /* glsl */`
	attribute vec2 a_Position;
	attribute vec3 a_Color;
	varying vec3 v_Color;
	uniform vec2 u_Resize;
	uniform mat3 u_matrix;

	void main() {
		v_Color = a_Color;
		vec2 resized_Position = a_Position * u_Resize;
		gl_Position = vec4(u_matrix * vec3(resized_Position, 1), 1);
	}
`