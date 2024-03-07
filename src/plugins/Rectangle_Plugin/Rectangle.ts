import { Color } from "../../core/Color";
import { CreateNodeOptionsType, NODE_SYSTEM_TYPE, Node } from "../../core/Node/Node";
import { SHADER_TYPE } from "../../rendering/const";
import { RectangleGeometry } from "./geometry";

export class Rectangle extends Node<RectangleGeometry> {
    constructor({ transform }: CreateNodeOptionsType) {
        super({
            geometry: new RectangleGeometry(),
            color: new Color({
                r: 209 / 255,
                g: 209 / 255,
                b: 209 / 255,
                a: 1,
            }),
            transform,
            systemType: NODE_SYSTEM_TYPE.GRAPHICS,
            shaderType: SHADER_TYPE.PRIMITIVE
        })
       this.size.set(50, 50)
       this.geometry.updateGeometry(this.size)
        
    }
    setSize() {

    }
}