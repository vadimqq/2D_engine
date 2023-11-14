
import { Object2D } from '../core/Object2D';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';

const transitionX = 0.2;
const transitionY = 0.4;

export class WebGLRenderer{
	canvasElement: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	worldSpaceMatrix: Matrix3;
	transitionVector: Vector2;
	resizeVector: Vector2;
	lastTime = 0
	constructor(){
		this.canvasElement = document.createElement('canvas')
        this.canvasElement.width = window.innerWidth
        this.canvasElement.height = window.innerHeight;
		this.resizeVector = window.innerHeight > window.innerWidth ? new Vector2(1, window.innerWidth / window.innerHeight) 
		: new Vector2(window.innerHeight / window.innerWidth, 1);
		
        document.getElementById('app')?.appendChild(this.canvasElement)

        this.gl = this.canvasElement.getContext("webgl2") as WebGL2RenderingContext;

        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

		this.worldSpaceMatrix = new Matrix3();
		this.transitionVector = new Vector2(transitionX, transitionY)
		
		this.rectangle = 
		new Object2D(this.gl, this.worldSpaceMatrix.transition(this.transitionVector), this.resizeVector);

	}
	getDelta(timeStamp: number) {
		const elapsed = timeStamp - this.lastTime;
		this.lastTime = timeStamp;
		return elapsed
	}
	update(timeStamp: number){
		if (window.innerWidth !== this.canvasElement.width || window.innerHeight !== this.canvasElement.height) {
			this.canvasElement.width = window.innerWidth
			this.canvasElement.height = window.innerHeight;
			window.innerHeight > window.innerWidth ? this.resizeVector.set(1, window.innerWidth / window.innerHeight) 
			: this.resizeVector.set(window.innerHeight / window.innerWidth, 1);
		}
		this.gl.viewport(0,0, this.canvasElement.width, this.canvasElement.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		this.rectangle.render(this.resizeVector);
	}
}