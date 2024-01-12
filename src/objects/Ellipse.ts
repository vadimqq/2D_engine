
import { BufferGeometry } from "../core/BufferGeometry";
import { Color } from "../core/Color";
import { Object2D } from "../core/Object2D";
        
const radius = 50
const innerRadius = 20;
const segment = 100;
const length = Math.PI * 2;
const coefficient = length === Math.PI * 2 ? 2 : 0

export class Ellipse extends Object2D {
    constructor() {
        const points = [Math.sin(0) * innerRadius, Math.cos(0) * innerRadius];
        const indices = [];
        const step = length / segment;

        for (let i = 0; i <= segment + coefficient; i++) {
            if (i % 2 === 0) {
                const cos = Math.cos(step * i)
                const sin = Math.sin(step * i)
    
                const pointX = sin  * radius;
                const pointY = cos  * radius;
                points.push(pointX, pointY);
            } else {
                const cos = Math.cos(step * i)
                const sin = Math.sin(step * i)
    
                const pointX = sin  * innerRadius;
                const pointY = cos  * innerRadius;
    
                points.push(pointX, pointY);
            }
           indices.push(i, i + 1, i + 2)
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