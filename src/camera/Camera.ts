import EventEmitter from 'eventemitter3';
import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";

type CameraEvents =
{
    'changeZoom': [camera: Camera];
    'changePosition': [camera: Camera];
}

export class Camera extends EventEmitter<CameraEvents> {
    matrix = new Matrix3();
    inverseMatrix = new Matrix3().invert()
    position = new Vector2();
    zoom = 1;

    height = 0;
    width = 0;

    private needUpdateMatrix = true;
    needUpdateFrustum = true;

    constructor(canvas: HTMLCanvasElement) {
        super()
        this.height = canvas.height;
        this.width = canvas.width;
    }

    setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
        this.needUpdateMatrix = true
        this.emit('changePosition', this)
    }

    setZoom(zoom: number) {
        this.zoom = zoom;
        this.needUpdateMatrix = true
        this.emit('changeZoom', this)
    }

    computedMatrix() {
         if (this.needUpdateMatrix) {
            this.matrix.identity()
            this.matrix.scale(this.zoom, this.zoom)
            this.matrix.translate(-this.position.x, -this.position.y);
    
            this.inverseMatrix.copy(this.matrix).invert()
            this.needUpdateMatrix = false
            this.needUpdateFrustum = true
         }
		return this.matrix
	}
};