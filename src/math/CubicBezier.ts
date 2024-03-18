export class CubicBezier {
    counts: number
    constructor(counts: number = 1) {
        this.counts = counts;
    }

    getCurve(
        startPointX: number, startPointXY: number,
        bezierPointX1: number, bezierPointY1: number,
        bezierPointX2: number, bezierPointY2: number,
        endPointX: number, endPointY: number,
    ) {
        const vectors = [startPointX, startPointXY];
        for (let t = 0; t < 1; t += 1 / this.counts) {
            const point = this.getBezierXY(t, startPointX, startPointXY,  bezierPointX1,  bezierPointY1, bezierPointX2 ,bezierPointY2,  endPointX, endPointY)
            vectors.push(point.x)
            vectors.push(point.y)
        }
        return vectors;
    }

    getBezierXY(t: number, sx: number, sy: number, cp1x: number, cp1y: number, cp2x: number, cp2y: number, ex: number, ey: number) {
        return {
          x: Math.pow(1-t,3) * sx + 3 * t * Math.pow(1 - t, 2) * cp1x 
            + 3 * t * t * (1 - t) * cp2x + t * t * t * ex,
          y: Math.pow(1-t,3) * sy + 3 * t * Math.pow(1 - t, 2) * cp1y 
            + 3 * t * t * (1 - t) * cp2y + t * t * t * ey
        };
      }
}