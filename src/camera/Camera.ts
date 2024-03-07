import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";

export class Camera {
    matrix = new Matrix3();
    inverseMatrix = new Matrix3().invert()
    position = new Vector2();
    zoom = 1;

    height = 0;
    width = 0;

    private needUpdateMatrix = true;
    needUpdateFrustum = true;

    constructor(canvas: HTMLCanvasElement) {
        this.height = canvas.height;
        this.width = canvas.width;
    }

    setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
        this.needUpdateMatrix = true
    }

    setZoom(zoom: number) {
        this.zoom = zoom;
        this.needUpdateMatrix = true
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