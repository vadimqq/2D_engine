import {Object2D} from '../core/Object2D';
import {Matrix3} from '../math/Matrix3';

let STEP = 5;
const INITIAL_TRANSLATE_X = 100;
const INITIAL_TRANSLATE_Y = 100;

export class WebGLRenderer {
  canvasElement: HTMLCanvasElement;
  gl: WebGL2RenderingContext;
  projectionMatrix = new Matrix3();
  lastTime = 0;

  _count = 0;
  _step_horizontal = 0;
  _step_vertical = 0;
  _directing: 'RIGHT' | 'LEFT' | 'BOTTOM' | 'TOP' = 'RIGHT';

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

    this.rectangle = new Object2D(this.gl);
    // this.rectangle2 = new Object2D(this.gl);
    // this.rectangle2.matrix.translate(INITIAL_TRANSLATE_X, INITIAL_TRANSLATE_Y);

    this.rectangle.matrix.translate(INITIAL_TRANSLATE_X, INITIAL_TRANSLATE_Y);
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

    this._run();

    this.rectangle.render(this.projectionMatrix);
  }

  _run() {
    if (this._directing === 'RIGHT') {
      this.rectangle.matrix.translate(STEP, 0);
      this._step_horizontal += STEP;
    } else if (this._directing === 'LEFT') {
      this.rectangle.matrix.translate(-STEP, 0);
      this._step_horizontal -= STEP;
    } else if (this._directing === 'BOTTOM') {
      this.rectangle.matrix.translate(0, STEP);
      this._step_vertical += STEP;
    } else if (this._directing === 'TOP') {
      this.rectangle.matrix.translate(0, -STEP);
      this._step_vertical -= STEP;
    }

    if(this._step_horizontal > (this.canvasElement.width - INITIAL_TRANSLATE_X * 2) && this._step_vertical <= 0 && this._directing === 'RIGHT'){
      this._directing = 'BOTTOM';
    } else if (this._step_horizontal > (this.canvasElement.width - INITIAL_TRANSLATE_X * 2) && this._step_vertical > (this.canvasElement.height - INITIAL_TRANSLATE_Y * 2) && this._directing === 'BOTTOM'){
      this._directing = 'LEFT';
    } else if (this._step_horizontal < 0 && this._step_vertical >= (this.canvasElement.height - INITIAL_TRANSLATE_Y * 2) && this._directing === 'LEFT'){
      this._directing = 'TOP';
    } else if (this._step_horizontal < 0 && this._step_vertical <= 0 && this._directing === 'TOP'){
      this._directing = 'RIGHT';
    }
  }
}