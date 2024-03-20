import earcut from 'earcut';
import { BufferGeometry } from "../../core/BufferGeometry/BufferGeometry";
import { CubicBezier } from '../../math/CubicBezier';
import { Rectangle } from './Rectangle';

const b = 0.55342686;
const c = 0.99873585;

const cubicBezier = new CubicBezier(10)
export class RectangleGeometry extends BufferGeometry {
    constructor() {
        super()
    }

    updateGeometry(rect: Rectangle) {
        const maxRadius = rect.getMaxRadius();

        const currentLeftTopRadius = rect.rectangleTopLeftCornerRadius > maxRadius ? maxRadius : rect.rectangleTopLeftCornerRadius;
        const currentRightTopRadius = rect.rectangleTopRightCornerRadius > maxRadius ? maxRadius : rect.rectangleTopRightCornerRadius;
        const currentRightBottomRadius = rect.rectangleBottomRightCornerRadius > maxRadius ? maxRadius : rect.rectangleBottomRightCornerRadius;
        const currentLeftBottomRadius =  rect.rectangleBottomLeftCornerRadius > maxRadius ? maxRadius : rect.rectangleBottomLeftCornerRadius;

        const leftTopArc = rect.rectangleTopLeftCornerRadius ? cubicBezier.getCurve(
            0, currentLeftTopRadius,

            rect.size.x / 2 - (rect.size.x / 2 * c), currentLeftTopRadius - currentLeftTopRadius * b,
            currentLeftTopRadius - currentLeftTopRadius * b, rect.size.y / 2 - (rect.size.y / 2 * c),

            currentLeftTopRadius, 0
        ) : [
            // 0, rect.size.y / 2,
            0, 0,
            // rect.size.x / 2, 0
        ]
        const rightTopArc = rect.rectangleTopRightCornerRadius ? cubicBezier.getCurve(
            rect.size.x - currentRightTopRadius, 0,

            rect.size.x - currentRightTopRadius + currentRightTopRadius * b, rect.size.y / 2 - (rect.size.y / 2 * c),
            rect.size.x * c, currentRightTopRadius - currentRightTopRadius * b,

            rect.size.x, currentRightTopRadius,
        ) : [
            // rect.size.x / 2, 0,
            rect.size.x, 0,
            // rect.size.x, rect.size.y / 2
        ]

        const rightBottomArc = rect.rectangleBottomRightCornerRadius ? cubicBezier.getCurve(
            rect.size.x, rect.size.y - currentRightBottomRadius,

            rect.size.x * c, rect.size.y - currentRightBottomRadius + currentRightBottomRadius * b,
            rect.size.x - currentRightBottomRadius + currentRightBottomRadius * b, rect.size.y * c,

            rect.size.x - currentRightBottomRadius, rect.size.y
        ) : [
            // rect.size.x, rect.size.y / 2,
            rect.size.x, rect.size.y,
            // rect.size.x / 2, rect.size.y,
        ]

        const leftBottomArc = rect.rectangleBottomLeftCornerRadius ? cubicBezier.getCurve(
            currentLeftBottomRadius, rect.size.y,

            currentLeftBottomRadius - currentLeftBottomRadius * b, rect.size.y * c,
            rect.size.x / 2 - (rect.size.x / 2 * c), rect.size.y - currentLeftBottomRadius + currentLeftBottomRadius * b,

            0, rect.size.y - currentLeftBottomRadius
        ) : [
            // rect.size.x / 2, rect.size.y,
            0, rect.size.y,
            // 0, rect.size.y / 2
        ]

        const points: number[] = [...leftTopArc, ...rightTopArc, ...rightBottomArc, ...leftBottomArc];

        this.indices.data = earcut(points)

        this.position = { numComponents: 2, data: points };
    }
}

