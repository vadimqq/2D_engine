import { BufferGeometry } from "../../core/Geometry";
import { Ellipse } from "./Ellipse";

export class EllipseGeometry extends BufferGeometry {
    constructor() {
        super()
    }

    updateGeometry(ellipse: Ellipse) {
      const {innerRadius, start, segments, sweep, size} = ellipse
      const points = []
      const step = (Math.PI / 50 * sweep) / segments ;
      let indices = []
      const halfSizeX =  size.x / 2
      const halfSizeY =  size.y / 2

      for (let i = 0; i <= segments ; i++) {
          let inc = step * i + start
          const cos = Math.cos(inc)
          const sin = Math.sin(inc)
          const pointX =  halfSizeX / 100 * innerRadius * cos + halfSizeX;
          const pointY =  halfSizeY /100 * innerRadius * sin + halfSizeY;
          points.push(pointX, pointY)
          const x = halfSizeX * cos + halfSizeX;
          const y = halfSizeY * sin + halfSizeY;
          points.push( x, y );

          const startPoint = i * 2;
          if (i !== segments) {
              indices.push(startPoint, startPoint + 1, startPoint + 2);
              indices.push(startPoint + 1, startPoint + 2, startPoint + 3);
          }
      }

      this.position = { numComponents: 2, data: points };
      this.indices =  { numComponents: 2, data: indices};
    }
}