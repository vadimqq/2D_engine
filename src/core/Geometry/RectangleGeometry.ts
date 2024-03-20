import { Vector2 } from "../../math/Vector2";
import { BufferGeometry } from "./BufferGeometry";

export class RectangleGeometry extends BufferGeometry {
    constructor(x = 1, y = 1) {
        super()
        this.position = { numComponents: 2, data: [0, 0, x, 0, x, y, 0, y], };
        this.indices =  { numComponents: 2, data: [0, 1, 2, 2, 3, 0 ]};
    }
    updateGeometry(size: Vector2) {
        this.position = { numComponents: 2, data: [0, 0, size.x, 0, size.x, size.y, 0, size.y] };
    }
}