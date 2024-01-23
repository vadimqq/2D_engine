import { IEllipse } from "../objects/Ellipse";
import { BufferGeometry } from "./BufferGeometry";

export class EllipseGeometry extends BufferGeometry {
    constructor() {
        super()
    }

    update(options: IEllipse) {
        const { radius, innerRadius, segment, length, startPosition } = options;
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

        this.position.data = points;
        this.indices.data = indices;

        console.log({points, indices})
    }
}