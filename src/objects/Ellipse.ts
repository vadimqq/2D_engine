
import { Color } from "../core/Color";
import { EllipseGeometry } from "../core/EllipseGeometry";
import { Object2D } from "../core/Object2D";

export interface IEllipse {
    radius: number;
    innerRadius: number;
    segments: number;
    length: number;
    startPosition: number;
}
        
export class Ellipse extends Object2D<EllipseGeometry> {
    options: IEllipse;
    constructor(radius: number, innerRadius: number, segments: number, length: number = Math.PI * 2, startPosition: number = 0) {
        const geometry = new EllipseGeometry();
        super(
            geometry,
            new Color({ r: Math.random(), g: Math.random(), b: Math.random(), a: 1 })
        )

        this.options = { radius, innerRadius, segments, length, startPosition };
        geometry.update(this.options);
    }

    setLength(length: number) {
        this.options.length = length;
        this.geometry.update(this.options);
    }

    //TODO сделать сеттеры на свойства { this.radius = radius + update() }
    getWidth() { return 50 * this.scale.x }
    getHeight() { return 50 * this.scale.y}
}