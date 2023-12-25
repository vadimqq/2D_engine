import { Material } from '../materials/Material';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';
import fs from '../shaders/fs';
import vs from '../shaders/vs';



const rectangle_face = [0, 1, 2, 1, 2, 3];

export class Object2D {
	localMatrix = new Matrix3();
	worldMatrix = new Matrix3();
	needUpdateMatrix = true;

	position = new Vector2(50, 50);
	rotation = 0;
	scale = new Vector2(1, 1);
	size: number;


	parent: Object2D | null = null;
	children: Object2D[] = [];
	
	constructor(gl: WebGL2RenderingContext, size: number, vertex: number[]) {
		this.gl = gl;
		this.vertexData = vertex;
		this.faceData = rectangle_face;
        this.material = new Material(gl, vs, fs);
		this.size = size;
			
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

	add(object: Object2D) {
		if (object.parent !== null) {
			object.parent.remove(object);
		}
		object.parent = this;
		this.children.push(object);
	}

	remove(object: Object2D) {
		const index = this.children.indexOf( object );
		if (index !== - 1) {
			object.parent = null;
			this.children.splice( index, 1 );
		}
	}

	computeWorldMatrix() {
		if (this.needUpdateMatrix) {
			this.worldMatrix.identity()
			
			if (this.parent) {
				this.worldMatrix.multiply(this.parent.worldMatrix)
			}
			this.computeLocalMatrix()
			this.worldMatrix.multiply(this.localMatrix)
			this.needUpdateMatrix = false
			this.children.forEach((child) => {child.needUpdateMatrix = true})
		}
		return this.worldMatrix
	}

	computeLocalMatrix() {
		const width = this.size;
		const height = this.size;
		this.localMatrix.identity();

		this.localMatrix.translate(this.position.x, this.position.y);

		this.localMatrix.translate(width * this.scale.x / 2, height * this.scale.y /2)
		this.localMatrix.rotate(this.rotation);
		this.localMatrix.translate(-width * this.scale.x / 2, -height * this.scale.y / 2)
		
		this.localMatrix.scale(this.scale.x, this.scale.y)

		this.needUpdateMatrix = false
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
		this.computeWorldMatrix();
		this.worldMatrix.copy(projectionMatrix).multiply(this.localMatrix)
		this.gl.uniformMatrix3fv(this.u_Matrix, false, this.worldMatrix.elements);

		this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
		this.gl.useProgram(null);
	}
}
