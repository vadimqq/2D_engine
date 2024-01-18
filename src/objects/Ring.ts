import { BufferGeometry } from "../core/BufferGeometry";
import { Color } from "../core/Color";
import { Object2D } from "../core/Object2D";
import { Vector2 } from "../math/Vector2";

const center = new Vector2(0, 0)
const radius = 100;
const innerRadius = 40;

const SEGMENTS = 4;
const ROUND = '50%';
const START_DEG = 90;

export class Ring extends Object2D {
    constructor() {
        const points = [];
        const indices = [];
        const step = (Math.PI * (parseFloat(ROUND) / 100 * 2)) / SEGMENTS;
        const start_rad = START_DEG * Math.PI / 180;

        for (let i = 0; i <= SEGMENTS; i++) {
            const inc = step * i + start_rad;
            const cos = Math.cos(inc);
            const sin = Math.sin(inc);

            const pointX = center.x + cos * radius;
            const pointY = center.y + sin * radius;
            const innerPointX = center.x + cos * innerRadius;
            const innerPointY = center.y + sin * innerRadius;

            points.push(pointX, pointY);
            points.push(innerPointX, innerPointY);

            const start = i * 2;
            indices.push(start, start + 1, start + 2);
            indices.push(start + 1, start + 2, start + 3);
        }

        console.log(points);
        console.log(indices);

        const geometry = new BufferGeometry();

        geometry.position = {
            numComponents: 2,
            data: points,
        };
        geometry.indices =  {
            numComponents: 3,
            data: indices,
        };
        super(
            geometry,
            new Color({ r: Math.random(), g: Math.random(), b: Math.random(), a: 1 })
        );
    }
    getRadius() { return radius * this.scale.x }
}