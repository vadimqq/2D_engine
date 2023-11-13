import { Matrix3 } from "../math/Matrix3";
import { Vector2 } from "../math/Vector2";

export class Camera {
    matrix = new Matrix3();
    position = new Vector2();
    scale = 1;
    constructor() {}

    setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }

    setScale(scale: number) {
        this.scale = scale;
    }

    computedMatrix() {
		this.matrix.identity()

		this.matrix.scale(this.scale, this.scale)
		this.matrix.translate(-this.position.x, -this.position.y);

		return this.matrix
	}
};