
import { Object2D } from '../core/Object2D';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';


export class WebGLRenderer{
	canvasElement: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	worldSpaceMatrix: Matrix3;
	lastTime = 0
	constructor(){
		this.canvasElement = document.createElement('canvas')
        this.canvasElement.width = window.innerWidth
        this.canvasElement.height = window.innerHeight;
		
        document.getElementById('app')?.appendChild(this.canvasElement)

        this.gl = this.canvasElement.getContext("webgl2") as WebGL2RenderingContext;

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.worldSpaceMatrix = new Matrix3();
		
		this.rectangle = new Object2D(this.gl, new Vector2(2, 1));
		// this.gl.uniformMatrix3fv

	}
	getDelta(timeStamp: number) {
		const elapsed = timeStamp - this.lastTime;
		this.lastTime = timeStamp;
		return elapsed
	}
	update(timeStamp: number){
		this.gl.viewport(0,0, this.canvasElement.width, this.canvasElement.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.rectangle.render();
	}
}