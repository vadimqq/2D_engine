export default /* glsl */`
//    #ifdef GL_ES
//    precision mediump float;
//    #endif

//    varying mat3 v_matrixW;
//    uniform vec2 u_resolution;

//    void main(){
//       float scale = 1.0;
//       float t = 0.01;

//       vec2 uv = (v_matrixW  * vec3(gl_FragCoord.xy, 1)).xy;
//       vec2 uv2 = fract(8.0 * uv  + 0.5) - 0.5;

//       float thickness = scale * t;

//       if (abs(uv2.x) < thickness || abs(uv2.y) < thickness) {
//          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
//       } else {
//          discard;
//       }
// }

varying vec3 localPosition;
varying vec4 worldPosition;

uniform vec3 worldCamProjPosition;
uniform float cellSize;
uniform vec3 cellColor;
uniform float cellThickness;

float getGrid(float size, float thickness) {
   vec2 r = localPosition.xz / size;
   vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
   float line = min(grid.x, grid.y) + 1.0 - thickness;
   return 1.0 - min(line, 1.0);
}

void main() {
   float grid = getGrid(cellSize, cellThickness);

   float dist = distance(worldCamProjPosition, worldPosition.xyz);
   vec3 color = mix(cellColor, cellColor, min(1.0, cellThickness * grid));

   gl_FragColor = vec4(color, grid);
   //тут альфа настраивается
   gl_FragColor.a = mix(0.15 * gl_FragColor.a, gl_FragColor.a, 0.1);
   if (gl_FragColor.a <= 0.0) discard;

      // #include <tonemapping_fragment>
      // #include <encodings_fragment>
    }
`