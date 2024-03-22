import { Color } from "../../core/Color";
import { Node } from "../../core/Node/Node";
import { CreateNodeOptionsType, NODE_SYSTEM_TYPE, } from "../../core/Node/model";

import { SHADER_TYPE } from "../../rendering/const";
import { EllipseGeometry } from "./geometry";

export class Ellipse extends Node<EllipseGeometry> {
    innerRadius: number = 0; //Percent value
    start: number = 0; //Radian value
    sweep: number = 100; //Percent value
    segments: number = 100;
    constructor({ transform }: CreateNodeOptionsType) {
        super({
            geometry: new EllipseGeometry(),
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
        this.size.set(100, 100)
        this.geometry.updateGeometry(this)
    }
    setSize(x: number, y: number) {
        this.size.set(x, y);
        this.geometry.updateGeometry(this);
    }
}


