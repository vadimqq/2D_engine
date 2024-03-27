import { Color } from "../../core/Color";
import { Node } from "../../core/Node/Node";
import { CreateNodeOptionsType, NODE_SYSTEM_TYPE, } from "../../core/Node/model";

import { SHADER_TYPE } from "../../rendering/const";
import { PolygonGeometry } from "./geometry";

export class Polygon extends Node<PolygonGeometry> {
    count: number = 3;
    radius: number = 0;
    angle: number = 0;
    constructor({ transform }: CreateNodeOptionsType) {
        super({
            type: 'POLYGON',
            geometry: new PolygonGeometry(),
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
