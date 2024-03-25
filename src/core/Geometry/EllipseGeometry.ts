import { BufferGeometry } from "../../core/Geometry";
import { Vector2 } from "../../math/Vector2";

export class EllipseGeometry extends BufferGeometry {
    constructor() {
        super()
    }

    updateGeometry(size: Vector2, segments: number) {
      const points = []
      const step = Math.PI * 2 / segments;
      let indices = []

      const halfWidth = size.x / 2
      const halfHeight = size.y / 2

      for (let i = 0; i <= segments ; i++) {
          let inc = step * i
          const cos = Math.cos(inc)
          const sin = Math.sin(inc)
          const x = halfWidth * cos + halfWidth;
          const y = halfHeight * sin + halfHeight;
          points.push( x, y );

          const startPoint = i * 2;
        //   if (i !== segments) {
              indices.push(startPoint, startPoint + 1, startPoint + 2);
              indices.push(startPoint + 1, startPoint + 2, startPoint + 3);
        //   }
      }

      this.position = { numComponents: 2, data: points };
      this.indices =  { numComponents: 2, data: indices};
    }
}