import { BufferGeometry } from "../core/BufferGeometry/BufferGeometry";
import { Vector2 } from "../math/Vector2";

export class SceneGeometry extends BufferGeometry {
    constructor(x = 1, y = 1) {
        super()
        this.position = { numComponents: 2, data: [0, 0, x, 0, 0, y, x, y], };
        this.indices =  { numComponents: 2, data: [0, 1, 2, 0, 2, 3, ]};
    }

    updateGeometry(size: Vector2) {
        this.position = {
            numComponents: 2, data: [
                -size.x / 2, -size.y / 2,
                size.x / 2, -size.y / 2,
                size.x / 2, size.y / 2,
                -size.x / 2, size.y / 2,
            ],
        };
    }
}