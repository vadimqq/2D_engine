import { Object2D } from '../core/Object2D';
import { Material } from '../materials/Material';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';
import fs from '../shaders/fs';
import vs from '../shaders/vs';

export class Rectangle extends Object2D {
	matrix = new Matrix3();
	position = new Vector2(100, 100);

	scale = new Vector2(1, 1);
	rotation = 0;

	constructor(gl: WebGL2RenderingContext) {
		this.gl = gl;
        this.material = new Material(gl, vs, fs)
		this.color = [Math.random(), Math.random(), Math.random(), 1];
	}
	render() {
		// look up where the vertex data needs to go.
		const positionLocation = this.gl.getAttribLocation(this.material.program, "a_position");

		// lookup uniforms
		const resolutionLocation = this.gl.getUniformLocation(this.material.program, "u_resolution");
		const colorLocation = this.gl.getUniformLocation(this.material.program, "u_color");
		const matrixLocation = this.gl.getUniformLocation(this.material.program, "u_matrix");

			
		// Tell it to use our program (pair of shaders)
		this.gl.useProgram(this.material.program);

		 // Create a buffer to put positions in
		const positionBuffer = this.gl.createBuffer();
		 // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
		 this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
		 // Put geometry data into buffer
		this.gl.bufferData(
			this.gl.ARRAY_BUFFER,
			new Float32Array([
				0, 0,
				50, 0,
				0, 50,
				0, 50,
				50, 0,
				50, 50,
			]),
			this.gl.DYNAMIC_DRAW
		);
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
	
		// Turn on the attribute
		this.gl.enableVertexAttribArray(positionLocation);
	
		// Bind the position buffer.

	
		// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
		var size = 2;          // 2 components per iteration
		var type = this.gl.FLOAT;   // the data is 32bit floats
		var normalize = true; // don't normalize the data
		var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
		var offset = 0;        // start at the beginning of the buffer
		this.gl.vertexAttribPointer(
			positionLocation, size, type, normalize, stride, offset);
	
		// set the resolution
		this.gl.uniform2f(resolutionLocation, this.gl.canvas.width, this.gl.canvas.height);
	
		// set the color
		this.gl.uniform4fv(colorLocation, this.color);
	
		// Compute the matrices
		// var translationMatrix = new Matrix3().translate(translation);
		// var rotationMatrix = new Matrix3().rotate(angleInRadians);
		// var scaleMatrix = new Matrix3().scale(scale);
	
		// // Multiply the matrices.
		// var matrix = new Matrix3()
		// .multiply(translationMatrix)
		// .multiply(rotationMatrix)
		// .multiply(scaleMatrix);
		this.matrix
			.identity()
			.scale(this.scale)
			.translate(new Vector2(-25, -25))
			.rotate(this.rotation)
			.translate(new Vector2(25, 25))
			.translate(this.position)

		// Set the matrix.
		this.gl.uniformMatrix3fv(matrixLocation, false, this.matrix.toArray());
	
		// Draw the geometry.
		var primitiveType = this.gl.TRIANGLES;
		var offset = 0;
		var count = 6;  // 3 points per triangle
		this.gl.drawArrays(primitiveType, offset, count);
	}
}
