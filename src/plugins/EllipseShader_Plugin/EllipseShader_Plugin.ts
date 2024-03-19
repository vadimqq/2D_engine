import { NODE_SYSTEM_TYPE, Node } from "../../core/Node/Node";
import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { RectangleGeometry } from "../Rectangle_Plugin/geometry";
import fs from "./shaders/fs";
import vs from "./shaders/vs";
import {RectangleTool} from "../Ellipse_Plugin/tool";
import {Ellipse} from "./Ellipse";

export class EllipseShader_Plugin implements Plugin {
    name = 'PIXEL_GRID_PLUGIN';

    constructor(options: PluginInitOptions) {
        options.renderer.registerProgram('ELLIPSE_SHADER', vs, fs)

        options.toolManager.registerNewTool('ELLIPSE_TOOL', new RectangleTool(options.nodeManager))
        options.nodeManager.registerNewNode('ELLIPSE_SHADER', Ellipse)

        const arr = [...Array(5).keys()];

        arr.forEach(() => {
            const ellipse = options.nodeManager.createNode('ELLIPSE_SHADER',{ transform: [
                    1, 0, 0,
                    0, 1, 0,
                    Math.floor(Math.random() * 900), Math.floor(Math.random() * 600), 1
                ]})

            options.scene.add_child(ellipse)
        })

        const grid = new EllipseShader()
        options.renderer.postEffects.push(grid)
    }

    init() {}
    destroy() {}


}


export class EllipseShader extends Node<RectangleGeometry> {
    constructor(transform?: [number, number, number, number, number, number, number, number, number,]) {
        super({
            geometry: new RectangleGeometry(),
            transform,
            systemType: NODE_SYSTEM_TYPE.GRAPHICS,
            shaderType: 'ELLIPSE_SHADER'
        })
       this.size.set(100, 100)
       this.geometry.updateGeometry(this.size)



    }
    setSize() {

    }
}