import { BufferGeometry } from "../core/BufferGeometry";
import { Color } from "../core/Color";
import { Object2D } from "../core/Object2D";

export class Mesh extends Object2D {
    constructor() {
        super(
            new BufferGeometry(),
            new Color({ r: Math.random(), g: Math.random(), b: Math.random(), a: 1 })
        )
    }
    getWidth() { return 50 * this.scale.x }
	getHeight() { return 50 * this.scale.y}
}