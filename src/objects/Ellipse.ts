import { BufferGeometry } from "../core/BufferGeometry";
import { Color } from "../core/Color";
import { Object2D } from "../core/Object2D";
import { Vector2 } from "../math/Vector2";

const center = new Vector2(0, 0)
const radius = 100;

const segment = 12;

export class Ellipse extends Object2D {
    constructor() {
        const points = [];
        const indices = [];
        const step = (Math.PI * 2) / segment;

        for (let i = 0; i <= segment; i++) {
            const inc = step * i;
            const cos = Math.cos(inc);
            const sin = Math.sin(inc);

            const pointX = center.x + cos * radius;
            const pointY = center.y + sin * radius;

            points.push(pointX, pointY)

            if (i < segment) {
                indices.push(0, i + 1, i + 2);
            }
        }

        const geometry = new BufferGeometry();

        geometry.position = {
            numComponents: 2,
            data: points,
        };
        geometry.indices =  {
            numComponents: 2,
            data: indices,
        };
        super(
            geometry,
            new Color({ r: Math.random(), g: Math.random(), b: Math.random(), a: 1 })
        );
    }
    getRadius() { return radius * this.scale.x }
}