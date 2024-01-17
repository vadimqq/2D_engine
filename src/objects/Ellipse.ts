
import { BufferGeometry } from "../core/BufferGeometry";
import { Color } from "../core/Color";
import { Object2D } from "../core/Object2D";
        
const radius = 50
const innerRadius = 20;
const segment = 20;
const length = Math.PI;
const startPosition = 0;

export class Ellipse extends Object2D {
    constructor() {
        const points = [Math.sin(0 + startPosition) * innerRadius, Math.cos(0 + startPosition) * innerRadius];
        const indices = [];
        const step = length / segment;

        for (let i = 0; i <= segment; i++) {
            let cos = Math.cos(step * i + startPosition)
            let sin = Math.sin(step * i + startPosition)
            let pointX;
            let pointY;

            if (i % 2 === 0) {
                pointX = sin  * radius;
                pointY = cos  * radius;
            } else {    
                pointX = sin  * innerRadius;
                pointY = cos  * innerRadius;
            }

            if (i >= segment - 1) {
                pointX = Math.round(pointX / 10) * 10;
                pointY = Math.round(pointY / 10) * 10;
            }

            points.push(pointX, pointY);
            indices.push(i, i + 1, i + 2);
        }

        console.log({points, indices})

        const geometry = new BufferGeometry()

        geometry.position = {
            numComponents: 2,
            data: points, 
        }
        geometry.indices =  {
            numComponents: 2,
            data: indices,
        };
        super(
            geometry,
            new Color({ r: Math.random(), g: Math.random(), b: Math.random(), a: 1 })
        )
    }
    getWidth() { return 50 * this.scale.x }
    getHeight() { return 50 * this.scale.y}
}