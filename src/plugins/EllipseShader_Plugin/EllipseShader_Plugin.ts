import { Node } from "../../core/Node/Node";
import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { RectangleTool } from "./tool";
import {Ellipse} from "./Ellipse";
import {NODE_SYSTEM_TYPE} from "../../core/Node/model";
import {RectangleGeometry} from "../../core/Geometry";
import {EllipseShaderProgram} from "./EllipseShaderProgram";

export class EllipseShader_Plugin implements Plugin {
    name = 'ELLIPSE_SHADER_PLUGIN';

    constructor(options: PluginInitOptions) {
        options.renderer.registerProgram('ELLIPSE_SHADER', EllipseShaderProgram)

        //options.toolManager.registerNewTool('ELLIPSE_TOOL', new RectangleTool(options.nodeManager))
        options.nodeManager.registerNewNode('ELLIPSE_SHADER', Ellipse)

        const arr = [...Array(1).keys()];

        arr.forEach(() => {
            const ellipse = options.nodeManager.createNode('ELLIPSE_SHADER',{ transform: [
                    1, 0, 0,
                    0, 1, 0,
                    0, 0, 1
                ]})
console.log(ellipse);
            options.scene.add_child(ellipse)
        })

        // const grid = new EllipseShader()
        // options.renderer.postEffects.push(grid)
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