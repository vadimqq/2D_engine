export default /* glsl */`
// attribute vec2 a_position;

// uniform mat3 u_matrix;
// uniform mat3 u_matrixP;
// uniform mat3 u_matrixV;


// varying mat3 v_matrixW;

// void main() {
//     v_matrixW = u_matrixP;
//     vec2 position = (u_matrixP * u_matrixV * u_matrix * vec3(a_position, 1)).xy;
//     gl_Position = vec4( position, 0, 1);
// }

varying vec3 localPosition;
varying vec4 worldPosition;

uniform vec3 worldCamProjPosition;
uniform vec3 worldPlanePosition;

uniform mat3 u_matrixP;
uniform mat3 u_matrixV;

void main() {
    localPosition = position.xzy;
    localPosition *= 1.0;

    worldPosition = modelMatrix * vec4(localPosition, 1.0);

    worldPosition.xyz += (worldCamProjPosition - worldPlanePosition);
    localPosition = (inverse(modelMatrix) * worldPosition).xyz;

    gl_Position = u_matrixP * u_matrixV * worldPosition;
    }
`
