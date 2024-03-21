export class QuadraticBezier {
    constructor() {}
    getQuadraticXY(t: number, sx: number, sy: number, cp1x: number, cp1y: number, ex: number, ey: number) {
        return {
          x: (1-t) * (1-t) * sx + 2 * (1-t) * t * cp1x + t * t * ex,
          y: (1-t) * (1-t) * sy + 2 * (1-t) * t * cp1y + t * t * ey
        };
      }
}