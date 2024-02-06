import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { Rectangle } from "./Rectangle";
import { RectangleTool } from "./tool";


export class RectanglePlugin implements Plugin {
    name = 'RECTANGLE_PLUGIN';

    // private scene: Scene;

    constructor(options: PluginInitOptions) {
        options.toolManager.registerNewTool('RECTANGLE_TOOL', new RectangleTool(options.nodeManager))
        // options.toolManager.setTool('RECTANGLE_TOOL')
        options.nodeManager.registerNewNode('RECTANGLE', Rectangle)
        const arr = [...Array(5).keys()];

        arr.forEach(() => {
            const rect = new Rectangle([
                1, 0, 0,
                0, 1, 0,
                Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 1
            ])

            options.scene.add_child(rect)
        })
    }

    init() {}
    destroy() {}
}