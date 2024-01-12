
import { Object2D } from '../core/Object2D';
import { Matrix3 } from '../math/Matrix3';
import { Vector2 } from '../math/Vector2';

const size1 = 50;
const size2 = 25;

const rectangle_vertex1 = [
    0, 0,
    0.9, 0.1, 0.1,
    size1, 0,
    0.9, 0.1, 0.1,
    0, size1,
    0.1, 0.9, 0.0,
    size1, size1,
    0.0, 0.0, 0.9,
];

const rectangle_vertex2 = [
    0, 0,
    0.9, 0.2, 0.9,
    size2, 0,
    0.9, 0.4, 0.1,
    0, size2,
    0.1, 0.2, 0.0,
    size2, size2,
    0.0, 0.7, 0.9,
];


export class WebGLRenderer{
	canvasElement: HTMLCanvasElement;
	gl: WebGL2RenderingContext;
	projectionMatrix: Matrix3;
	parentRectangle: Object2D;
	rectangle: Object2D;
	lastTime = 0
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
		
		this.rectangle = new Object2D(this.gl, size2, rectangle_vertex2);

		this.parentRectangle = new Object2D(this.gl, size1, rectangle_vertex1);

		this.parentRectangle.add(this.rectangle);

		// this.rectangle.setPosition({x: this.rectangle.position.x + 50, y: this.rectangle.position.y + 50});
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

		this.gl.viewport(0,0, this.canvasElement.width, this.canvasElement.height);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
		
		this.gl.enable(this.gl.BLEND);
		this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

		// this.rectangle.setScale({x: this.rectangle.scale.x * 1.001, y: this.rectangle.scale.y * 1.001});
		this.parentRectangle.setPosition({x: this.parentRectangle.position.x + 0.1, y: this.parentRectangle.position.y + 0.1});
		this.parentRectangle.setRotation(this.parentRectangle.rotation + 0.01);
		// this.parentRectangle.setScale({x: this.parentRectangle.scale.x * 1.001, y: this.parentRectangle.scale.y * 1.001 });
		// this.rectangle.setRotation(this.rectangle.rotation + 0.03);
		this.parentRectangle.render(this.projectionMatrix);
		this.rectangle.render(this.parentRectangle.worldMatrix);
	}
}