export default /* glsl */`#version 300 es
precision mediump float;
uniform vec2 u_resolution;
uniform float u_zoom;
uniform vec2 u_cameraPosition;

out vec4 outColor;

float getGrid() {
   float lineWidth = 0.5;
   float scale = u_resolution.y / u_zoom;
   vec2 r = scale * vec2(gl_FragCoord.x + u_zoom * u_cameraPosition.x, gl_FragCoord.y - u_zoom * u_cameraPosition.y) / u_resolution.yy;
   vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
   float line = min(grid.x, grid.y);
   return lineWidth - min(line, lineWidth);
 }

void main(){
   float grid = getGrid();
   float alpha = mix(0.15 * grid, grid, 0.1);
   if (alpha > 0.0) {
      outColor = vec4(0.0, 0.0, 0.0, 0.2);
   } else {
      discard;
   }
}
`

//GOOD!!!!!!!!!!!!!!!!!!!!!
// precision mediump float;
// uniform vec2 u_resolution;
// uniform mat3 u_matrixP;
// uniform mat3 u_matrixV;
// uniform float u_zoom;
// uniform vec2 u_cameraPosition;

// out vec4 outColor;

// float getGrid() {
//    float lineWidth = 0.5;
//    float scale = u_resolution.x / u_zoom;
//    vec2 r = scale * vec2(gl_FragCoord.x + u_zoom * u_cameraPosition.x, -gl_FragCoord.y + u_zoom * u_cameraPosition.y) / u_resolution.xx;
//    vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
//    float line = min(grid.x, grid.y);
//    return lineWidth - min(line, lineWidth);
//  }

// void main(){
//    float grid = getGrid();
//    float alpha = mix(0.15 * grid, grid, 0.1);
//    if (alpha > 0.0) {
//       outColor = vec4(0.0, 0.0, 0.0, 0.3);
//    } else {
//          discard;
//    }
// }