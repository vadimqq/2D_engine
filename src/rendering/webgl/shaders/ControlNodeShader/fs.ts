export default /* glsl */`
precision mediump float;

uniform vec4 u_color;
varying vec2 v_position;
varying vec2 v_border;

void main() {
  vec2 dist = abs(v_position) - v_border;

  if (dist.x < 0.0 && dist.y < 0.0) {
      gl_FragColor = u_color;
  } else {
      gl_FragColor = vec4(0, 0.392, 0.937, 1.0);
  }
}
`
