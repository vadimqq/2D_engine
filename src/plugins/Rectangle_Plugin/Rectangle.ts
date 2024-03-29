import { Color } from "../../core/Color";
import { Node } from "../../core/Node/Node";
import { CreateNodeOptionsType, NODE_SYSTEM_TYPE } from "../../core/Node/model";
import { SHADER_TYPE } from "../../rendering/const";
import { RectangleBezierGeometry } from "./geometry";

export class Rectangle extends Node<RectangleBezierGeometry> {
    rectangleTopLeftCornerRadius: number = 30;
    rectangleTopRightCornerRadius: number = 0;
    rectangleBottomLeftCornerRadius: number = 0;
    rectangleBottomRightCornerRadius: number = 0;

    constructor({ transform }: CreateNodeOptionsType) {
        super({
            type: 'RECTANGLE',
            geometry: new RectangleBezierGeometry(),
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
       this.setSize(100, 100);
    }
    //OVERRIDE
    setSize(x: number, y: number) {
        this.size.set(x, y);
        this.geometry.updateGeometry(this);
    }

    getMaxRadius() {
        return this.size.x > this.size.y ? this.size.y / 2 : this.size.x / 2
    }
}