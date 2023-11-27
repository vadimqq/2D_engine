import {Object2D} from '../core/Object2D';
import {Matrix3} from '../math/Matrix3';

let STEP = 0.019;

export class WebGLRenderer {
  canvasElement: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  projectionMatrix = new Matrix3();
  lastTime = 0;

  _count = 0;
  _step = STEP;
  _directing: 'RIGHT' | 'LEFT' = 'RIGHT';

  constructor() {
    this.canvasElement = document.createElement('canvas')
    this.canvasElement.width = window.innerWidth
    this.canvasElement.height = window.innerHeight;


    document.getElementById('app')?.appendChild(this.canvasElement)

    this.gl = this.canvasElement.getContext("webgl2") as WebGL2RenderingContext;

    this.gl.clearColor(0.15, 0.5, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);


    this.projectionMatrix.set(
      2 / this.canvasElement.width, 0, 0,
      0, -2 / this.canvasElement.height, 0,
      -1, 1, 1
    )

    this.rectangle =
      new Object2D(this.gl);

  }

  getDelta(timeStamp: number) {
    const elapsed = timeStamp - this.lastTime;
    this.lastTime = timeStamp;
    return elapsed
  }

  update(timeStamp: number) {
    this.gl.viewport(0,0, this.canvasElement.width, this.canvasElement.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

    this.rectangle.matrix.translate(1,0);
    // this._run();
    // this.rectangle =
    //   new Object2D(this.gl, this.worldSpaceMatrix.translate(this.transitionVector), this.resizeVector);
    this.rectangle.render(this.projectionMatrix);
  }

  _run() {
    if (this._count < 0.7 && this._directing === 'RIGHT') {
      this.transitionVector.setX(this._count += this._step);
      this._step -= STEP / 200;
    } else if (this._count > -0.7 && this._directing === 'LEFT') {
      this.transitionVector.setX(this._count -= this._step);
      this._step -= STEP / 200;
    }

    if(this._count > 0.7 && this._directing === 'RIGHT'){
      this._directing = 'LEFT';
      this._step = STEP;
    } else if (this._count < -0.7 && this._directing === 'LEFT'){
      this._directing = 'RIGHT';
      this._step = STEP;
    }
  }
}