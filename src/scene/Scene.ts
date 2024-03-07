import { Color } from "../core/Color";
import { NODE_SYSTEM_TYPE, Node } from "../core/Node/Node";
import { SHADER_TYPE } from "../rendering/const";
import { SceneGeometry } from "./SceneGeometry";

export class Scene extends Node<SceneGeometry> {
    type = 'Scene';
    backgroundColor: null = null;
    constructor(){
        super({
            geometry: new SceneGeometry(), 
            color: new Color({
                r: 239 / 255,
                g: 239 / 255,
                b: 239 / 255,
                a: 1,
            }),
            systemType: NODE_SYSTEM_TYPE.SCENE,
            shaderType: SHADER_TYPE.PRIMITIVE,
        });
        this.size.set(2600, 2600)
        this.geometry.updateGeometry(this.size)
    }
}