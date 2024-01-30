import { BufferGeometry } from "../core/BufferGeometry";
import { Color } from "../core/Color";
import { Object2D } from "../core/Object2D";
import { Vector2 } from "../math/Vector2";



export class Ellipse extends Object2D {
    private radius: number;
    private segments: number;
    private round: number;
    private start_rad: number;
    private center: Vector2;
    constructor(center: Vector2, radius: number, segments: number, round: number, start_rad: number=0) {
        const geometry = new BufferGeometry();
        super(
            geometry,
            new Color({ r: Math.random(), g: Math.random(), b: Math.random(), a: 1 })
        );

        this.radius = radius;
        this.segments = segments;
        this.round = round;
        this.start_rad = start_rad;
        this.center = center;

        const points = [0, 0];
        const indices = [];
        const step = (Math.PI * (this.round / 100 * 2)) / this.segments;

        for (let i = 0; i <= this.segments; i++) {
            const inc = step * i + this.start_rad;
            const cos = Math.cos(inc);
            const sin = Math.sin(inc);

            const pointX = this.center.x + cos * this.radius;
            const pointY = this.center.y + sin * this.radius;

            points.push(pointX, pointY);

            indices.push(0, i + 1, i + 2);
            // indices.push(i, i + 1, 0);
        }

        geometry.position = {
            numComponents: 2,
            data: points,
        };
        geometry.indices =  {
            numComponents: 2,
            data: indices,
        };
    }
    getWidth() { return this.radius * 2 * this.scale.x }
    getHeight() { return this.getWidth() }
}