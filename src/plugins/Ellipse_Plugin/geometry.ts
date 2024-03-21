import { Vector2 } from "../../math/Vector2";
import {BufferGeometry} from "../../core/Geometry";

export class EllipseGeometry extends BufferGeometry {
    constructor(x = 1, y = 1) {
        super()
        this.position = {numComponents: 2, data: [0, 0, x, 0, 0, y, x, y],};
    }

    updateGeometry(radius: number, innerRadius: number, segments: number, round: number, start_rad: number=0, size:Vector2) {
        const points = [];
        const indices = [];
        const step = (Math.PI * (round / 100 * 2)) / segments;

        for (let i = 0; i <= segments; i++) {
            const inc = step * i + start_rad;
            const cos = Math.cos(inc);
            const sin = Math.sin(inc);

            const pointX = cos * radius + size.x / 2;
            const pointY = sin * radius + size.y / 2;
            const innerPointX = cos * innerRadius + size.x / 2;
            const innerPointY = sin * innerRadius + size.y / 2;

            points.push(pointX, pointY);
            points.push(innerPointX, innerPointY);

            const start = i * 2;
            // indices.push(start, start + 1, start + 2);
            // indices.push(start + 1, start + 2, start + 3);

            if(i !== segments) {
                indices.push(start, start + 1, start + 2);
                indices.push(start + 1, start + 2, start + 3);
            }
        }
        console.log();
        this.position = {
            numComponents: 2,
            data: points,
        };
        this.indices = {
            numComponents: 3,
            data: indices,
        };
    }
}
