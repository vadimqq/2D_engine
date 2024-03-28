import earcut from "earcut";
import { BufferGeometry } from "../../core/Geometry";
import { Polygon } from "./Polygon";

export class PolygonGeometry extends BufferGeometry {
    constructor() {
        super()
    }

    updateGeometry(polygon: Polygon) {
      const { size, count, radius, angle } = polygon
      const halfSizeX =  size.x / 2
      const halfSizeY =  size.y / 2
      const points = [];

      const step = (Math.PI * 2) / count ;

      for (let i = 0; i <= count; i++) {
        const inc = step * i + angle;
        const cos = Math.cos(inc);
        const sin = Math.sin(inc);
        const pointX = halfSizeX;
        const pointY = halfSizeY;
        points.push(pointX, pointY);
        const x = halfSizeX * sin + halfSizeX;
        const y = halfSizeY * -cos + halfSizeY;
        points.push( x, y );
    }

    this.position = { numComponents: 2, data: points };
    this.indices = { numComponents: 2, data: earcut(points) };
    }
}