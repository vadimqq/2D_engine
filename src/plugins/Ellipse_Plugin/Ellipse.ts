import { Color } from "../../core/Color";
import { CreateNodeOptionsType, NODE_SYSTEM_TYPE, Node } from "../../core/Node/Node";
import { SHADER_TYPE } from "../../rendering/const";
import { EllipseGeometry } from "./geometry";

export class Ellipse extends Node<EllipseGeometry> {
    constructor({ transform }: CreateNodeOptionsType) {
        super({
            geometry: new EllipseGeometry(),
            color: new Color({
                r: 109 / 255,
                g: 200 / 255,
                b: 150 / 255,
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