import { Color } from "../core/Color";
import { BufferGeometry } from "../core/Geometry";
import { NODE_SYSTEM_TYPE } from "../core/Node/model";
import { Node } from "../core/Node/Node";

type initOptionsType<G> = {
    geometry: G;
    color: Color;
    shaderType: string;
    controlManagerName: string;
}
export class Control<G extends BufferGeometry = BufferGeometry> extends Node<G> {
    controlManagerName: string;
    constructor({ geometry, color, shaderType, controlManagerName }: initOptionsType<G>) {
        super({
            type: 'CONTROL',
            geometry: geometry,
            color: color,
            systemType: NODE_SYSTEM_TYPE.CONTROL,
            shaderType: shaderType,
            })
        this.controlManagerName = controlManagerName
    }
}