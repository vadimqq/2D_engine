import { Color } from "../../core/Color";
import { Node } from "../../core/Node/Node";
import { RectangleGeometry } from "./geometry";

export class Rectangle extends Node<RectangleGeometry> {
    constructor() {
        super(
            new RectangleGeometry(),
            new Color({ r: Math.random(), g: Math.random(), b: Math.random(), a: 1 })
        )
        this.size.set(50, 50)

        this.geometry.updateGeometry(this.size)
    }
}