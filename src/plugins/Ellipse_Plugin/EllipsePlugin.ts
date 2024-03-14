import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { Ellipse } from "./Ellipse";
import { RectangleTool } from "./tool";


export class EllipsePlugin implements Plugin {
    name = 'ELLIPSE_PLUGIN';

    constructor(options: PluginInitOptions) {
        options.toolManager.registerNewTool('ELLIPSE_TOOL', new RectangleTool(options.nodeManager))
        options.nodeManager.registerNewNode('ELLIPSE', Ellipse)
        const arr = [...Array(10).keys()];

        arr.forEach(() => {
            const rect = options.nodeManager.createNode('ELLIPSE',{ transform: [
                1, 0, 0,
                0, 1, 0,
                Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 1
            ]})

            options.scene.add_child(rect)
        })
    }

    init() {}
    destroy() {}
}