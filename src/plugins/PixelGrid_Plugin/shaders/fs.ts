export default /* glsl */`#version 300 es
precision highp float;
uniform vec2 u_resolution;
uniform float u_zoom;
uniform vec2 u_cameraPosition;

out vec4 outColor;

void main() {
   if(
    mod(gl_FragCoord.x + u_cameraPosition.x * u_zoom,u_zoom) <1.0 ||
    mod(gl_FragCoord.y - u_cameraPosition.y * u_zoom,u_zoom) <1.0
   ){
      outColor = vec4(0.0, 0.0, 0.0, 0.3);
   }else {discard;}                      
 }
`