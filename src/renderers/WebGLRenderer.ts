
import { Object2D } from '../core/Object2D';
import { Matrix3 } from '../math/Matrix3';
import { Scene } from '../scene/Scene';
import fs from '../shaders/fs';
import vs from '../shaders/vs';
import { createAttributeSetters, createUniformSetters } from '../utils';
import { WebGLProgram } from './webgl/WebGLProgram';

export class WebGLRenderer{
	canvasElement: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	lastTime = 0;
	projectionMatrix = new  Matrix3();
	webGLProgram: WebGLProgram
	constructor(){
		this.canvasElement = document.createElement('canvas')
        this.canvasElement.width = window.innerWidth
        this.canvasElement.height = window.innerHeight;
		
        document.getElementById('app')?.appendChild(this.canvasElement)

        this.gl = this.canvasElement.getContext("webgl2") as WebGL2RenderingContext;

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.webGLProgram = new WebGLProgram(this.gl, vs, fs)

		this.uniformSetters = createUniformSetters(this.gl, this.webGLProgram.program);
		this.attribSetters  = createAttributeSetters(this.gl, this.webGLProgram.program);

		this.projectionMatrix.set(
			2 / this.canvasElement.width, 0, 0,
			0, -2 / this.canvasElement.height, 0,
			-1, 1, 1
		)
	}
	// getDelta(timeStamp: number) {
	// 	const elapsed = timeStamp - this.lastTime;
	// 	this.lastTime = timeStamp;
	// 	return elapsed
	// }

	render(scene: Scene, camera: any) {
		this.gl.viewport(0,0, this.canvasElement.width, this.canvasElement.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);


		//TODO ставим матрицу проэкции в сцену(надо подумать как сделать по другому)

		scene.worldMatrix.copy(this.projectionMatrix)
		scene.worldMatrix.multiply(camera.computedMatrix())

		this.gl.useProgram(this.webGLProgram.program);
		this.objectsRender(scene.children)
	}
	objectsRender(objects: Object2D[]) {
		objects.forEach(object => {
			var attribs = {
				a_position: { buffer: object.geometry.array, numComponents: 6, },
			};
			// setAttributes(this.attribSetters, attribs);








			//----------------------------------------------------------------
			const positionBuffer = this.gl.createBuffer();
			// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
			// Put geometry data into buffer
			this.gl.bufferData(
				this.gl.ARRAY_BUFFER,
				object.geometry.array,
				object.geometry.usage
			);
			// Bind the position buffer.
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
			
			// look up where the vertex data needs to go.
			const positionLocation = this.gl.getAttribLocation(this.webGLProgram.program, "a_position");
			this.gl.enableVertexAttribArray(positionLocation);

			// lookup uniforms
			const colorLocation = this.gl.getUniformLocation(this.webGLProgram.program, "u_color");
			const matrixLocation = this.gl.getUniformLocation(this.webGLProgram.program, "u_matrix");

				
			// Tell it to use our program (pair of shaders)
			this.gl.useProgram(this.webGLProgram.program);
		
			// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
			var type = this.gl.FLOAT;   // the data is 32bit floats
			var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
			var offset = 0;        // start at the beginning of the buffer
			this.gl.vertexAttribPointer(
				positionLocation,
				object.geometry.itemSize,
				type,
				object.geometry.normalized,
				stride,
				offset
			);
			// set the color
			this.gl.uniform4fv(colorLocation, object.color);

			// Set the matrix.
			object.computeWorldMatrix()
			this.gl.uniformMatrix3fv(matrixLocation, false, object.worldMatrix.toArray());
			// ------------------------------------------------------------------------------------------------

			
			// Draw the geometry..projecti.projectionMatrix
			var primitiveType = this.gl.TRIANGLES;
			var offset = 0;
			var count = 6;  // 3 points per triangle
			this.gl.drawArrays(primitiveType, offset, count);

			if (object.children.length) {
				this.objectsRender(object.children)
			}
		})
	}
}