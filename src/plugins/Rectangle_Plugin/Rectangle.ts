import { Color } from "../../core/Color";
import { NODE_SYSTEM_TYPE, Node } from "../../core/Node/Node";
import { RectangleGeometry } from "./geometry";

export class Rectangle extends Node<RectangleGeometry> {
    constructor(transform?: [number, number, number, number, number, number, number, number, number,]) {
        super({
            geometry: new RectangleGeometry(),
            color: new Color({
                r: 209 / 255,
                g: 209 / 255,
                b: 209 / 255,
                a: 1,
            }),
            transform,
            systemType: NODE_SYSTEM_TYPE.GRAPHICS
        })
       this.size.set(50, 50)
       this.geometry.updateGeometry(this.size)
        
    }
    setSize() {

    }
}