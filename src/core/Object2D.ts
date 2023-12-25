import { Material } from '../materials/Material';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';
import fs from '../shaders/fs';
import vs from '../shaders/vs';

const size = 50;

const rectangle_vertex = [
    0, 0,
    0.9, 0.1, 0.1,
    size, 0,
    0.9, 0.1, 0.1,
    0, size,
    0.1, 0.9, 0.0,
    size, size,
    0.0, 0.0, 0.9,
];

const rectangle_face = [0, 1, 2, 1, 2, 3];

export class Object2D {
	localMatrix = new Matrix3();
	worldMatrix = new Matrix3();
	needUpdateMatrix = true;

	position = new Vector2(50, 50);
	rotation = 0;
	scale = new Vector2(1, 1);
	
	constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
		this.vertexData = rectangle_vertex;
		this.faceData = rectangle_face;
        this.material = new Material(gl, vs, fs);
			
		this.a_Position = this.gl.getAttribLocation(this.material.program, 'a_Position');
		this.a_Color = this.gl.getAttribLocation(this.material.program, 'a_Color');
		// this.u_Resolution = this.gl.getUniformLocation(this.material.program, "u_Resolution");
		this.u_Matrix = this.gl.getUniformLocation(this.material.program, "u_Matrix");
	}
	setRotation(angle: number) {
		this.rotation = angle
		this.needUpdateMatrix = true
	}
	setPosition(vector: Vector2) {
		this.position = vector
		this.needUpdateMatrix = true
	}
	setScale(vector: Vector2) {
		this.scale = vector
		this.needUpdateMatrix = true
	}

	computeLocalMatrix() {
		if (this.needUpdateMatrix) {
			const width = size;
			const height = size;
			this.localMatrix.identity();
	
			this.localMatrix.translate(this.position.x, this.position.y);
	
			this.localMatrix.translate(width / 2, height /2)
			this.localMatrix.rotate(this.rotation);
			this.localMatrix.translate(-width / 2, -height / 2)
			
			this.localMatrix.scale(this.scale.x, this.scale.y)
	
			this.needUpdateMatrix = false
		}
	}

	render(projectionMatrix: Matrix3) {
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

		// this.gl.uniform2f(this.u_Resolution, this.gl.canvas.width, this.gl.canvas.height)
		this.computeLocalMatrix();
		this.worldMatrix.copy(projectionMatrix).multiply(this.localMatrix)
		this.gl.uniformMatrix3fv(this.u_Matrix, false, this.worldMatrix.elements);

		this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
		this.gl.useProgram(null);
	}
}
