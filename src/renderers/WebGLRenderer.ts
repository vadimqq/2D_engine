
import { Object2D } from '../core/Object2D';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';


export class WebGLRenderer{
	canvasElement: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	projectionMatrix: Matrix3;
	lastTime = 0
	sceneMatrix = new Matrix3();
	cameraMatrix = new Matrix3();
	constructor(){
		this.canvasElement = document.createElement('canvas')
        this.canvasElement.width = window.innerWidth
        this.canvasElement.height = window.innerHeight;
		
        document.getElementById('app')?.appendChild(this.canvasElement)

        this.gl = this.canvasElement.getContext("webgl2") as WebGL2RenderingContext;

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.projectionMatrix = new Matrix3();

		this.projectionMatrix.set(
            2 / this.canvasElement.width, 0, 0,
            0, -2 / this.canvasElement.height, 0,
            -1, 1, 1
        )
		
		this.rectangle = new Object2D(this.gl);
		// this.gl.uniformMatrix3fv

	}
	getDelta(timeStamp: number) {
		const elapsed = timeStamp - this.lastTime;
		this.lastTime = timeStamp;
		return elapsed
	}
	update(timeStamp: number){
		if (this.canvasElement.width !== window.innerWidth || this.canvasElement.height !== window.innerHeight) {
			this.canvasElement.width = window.innerWidth
			this.canvasElement.height = window.innerHeight;
			this.projectionMatrix.set(
            2 / this.canvasElement.width, 0, 0,
            0, -2 / this.canvasElement.height, 0,
            -1, 1, 1
        	);
		}

		this.cameraMatrix.scale(1, 1.001);

		this.sceneMatrix.copy(this.projectionMatrix).multiply(this.cameraMatrix)

		this.gl.viewport(0,0, this.canvasElement.width, this.canvasElement.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.rectangle.render(this.sceneMatrix);
	}
}