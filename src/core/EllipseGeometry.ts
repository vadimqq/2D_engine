import { IEllipse } from "../objects/Ellipse";
import { BufferGeometry } from "./BufferGeometry";

export class EllipseGeometry extends BufferGeometry {
    constructor() {
        super()
    }

    update(options: IEllipse) {
        const { radius, innerRadius, segments, length, startPosition } = options;
        const points = [];
        const indices = [];
        const step = length / segments;
        for (let i = 0; i <= segments; i++) {
            const inc = step * i + startPosition;
            const cos = Math.cos(inc);
            const sin = Math.sin(inc);

            const pointX = cos * radius;
            const pointY = sin * radius;
            const innerPointX = cos * innerRadius;
            const innerPointY = sin * innerRadius

            points.push(pointX, pointY);
            points.push(innerPointX, innerPointY);

            const start = i * 2;
            if (i !== segments) {
                indices.push(start, start + 1, start + 2);
                indices.push(start + 1, start + 2, start + 3);
            }
        }
        this.position.data = points;
        this.indices.data = indices;

        console.log({points, indices})
    }
}