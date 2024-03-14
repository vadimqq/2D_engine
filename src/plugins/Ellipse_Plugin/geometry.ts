import { BufferGeometry } from "../../core/BufferGeometry/BufferGeometry";
import { Vector2 } from "../../math/Vector2";

export class EllipseGeometry extends BufferGeometry {
    constructor(x = 1, y = 1) {
        super()
        this.position = { numComponents: 2, data: [0, 0, x, 0, 0, y, x, y], };
    }

    updateGeometry(size: Vector2) {
        this.position = { numComponents: 2, data: [0, 0, size.x, 0, 0, size.y, size.x, size.y], };
    }
}