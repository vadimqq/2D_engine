import { Material } from '../materials/Material';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';
import fs from '../shaders/fs';
import vs from '../shaders/vs';

const rectangle_vertex = [
    -0.5, -0.5,
    0.9, 0.1, 0.1,
    -0.5, 0.5,
    0.9, 0.1, 0.1,
    0.5, 0.5,
    0.1, 0.9, 0.0,
    0.5, -0.5,
    0.0, 0.0, 0.9,
]

const rectangle_face = [0, 1, 2, 0, 2, 3];

export class Object2D {
	constructor(gl: WebGL2RenderingContext, matrix: Matrix3, resizeVector: Vector2) {
		this.gl = gl;
		this.vertexData = rectangle_vertex;
		this.faceData = rectangle_face;
        this.material = new Material(gl, vs, fs)
		this.matrix = matrix;
		this.resizeVector = resizeVector;
			
		this.a_Position = this.gl.getAttribLocation(this.material.program, 'a_Position');
		this.a_Color = this.gl.getAttribLocation(this.material.program, 'a_Color');
		this.u_matrix = this.gl.getUniformLocation(this.material.program, "u_matrix");
		this.u_Resize = this.gl.getUniformLocation(this.material.program, 'u_Resize');
	}
	render(newResizeVector: Vector2) {
		this.resizeVector = newResizeVector;
		this.gl.useProgram(this.material.program);
		this.gl.enableVertexAttribArray(this.a_Position);
		this.gl.enableVertexAttribArray(this.a_Color);

		this.TRIANGLE_VERTEX = this.gl.createBuffer();

		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.TRIANGLE_VERTEX);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.vertexData), this.gl.STATIC_DRAW);

		this.TRIANGLE_FACES = this.gl.createBuffer();
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.TRIANGLE_FACES);
		this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.faceData), this.gl.STATIC_DRAW);

		this.gl.vertexAttribPointer(this.a_Position, 2, this.gl.FLOAT, false, 4 * (2 + 3), 0);
		this.gl.vertexAttribPointer(this.a_Color, 3, this.gl.FLOAT, false, 4 * (2 + 3), 2 * 4);
		this.gl.uniform2f(this.u_Resize, this.resizeVector.x, this.resizeVector.y);
		this.gl.uniformMatrix3fv(this.u_matrix, false, this.matrix.matrix);

		this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
		this.gl.useProgram(null);
	}
}