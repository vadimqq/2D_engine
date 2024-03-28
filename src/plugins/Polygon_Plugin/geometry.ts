import earcut from "earcut";
import { BufferGeometry } from "../../core/Geometry";
import { Polygon } from "./Polygon";
import { CubicBezier } from "../../math/CubicBezier";

const b = 0.55342686;
const c = 0.99873585;

const cubicBezier = new CubicBezier(10);

export class PolygonGeometry extends BufferGeometry {
    constructor() {
        super()
    }

    updateGeometry(polygon: Polygon) {
      const { size, count, angle } = polygon
      const halfSizeX =  size.x / 2
      const halfSizeY =  size.y / 2
      const points = [];

      const step = (Math.PI * 2) / count ;

      const adjustedCount = count % 2 === 0 ? count : count + 1

      for (let i = 0; i < adjustedCount; i++) {
        const inc = step * i + angle;
        const cos = Math.cos(inc);
        const sin = Math.sin(inc);

        const x = halfSizeX * sin + halfSizeX;
        const y = halfSizeY * -cos + halfSizeY;
        points.push( x, y );
    }
    this.position = { numComponents: 2, data: points };
    this.indices = { numComponents: 2, data: earcut(points) };
    }
}