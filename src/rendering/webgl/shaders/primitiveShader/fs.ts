export default /* glsl */`
   precision mediump float;

   uniform vec4 u_color;
   uniform int u_radius;


   void main() {
      gl_FragColor = u_color;
   }
`
