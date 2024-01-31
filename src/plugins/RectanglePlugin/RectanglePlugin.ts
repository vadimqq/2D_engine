import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { Rectangle } from "./Rectangle";
import { RectangleTool } from "./tool";


export class RectanglePlugin implements Plugin {
    name = 'RECTANGLE_PLUGIN';

    // private scene: Scene;

    constructor(options: PluginInitOptions) {
        // this.scene = options.scene
        options.toolManager.registerNewTool('RECTANGLE_TOOL', new RectangleTool(options.nodeManager))
        options.toolManager.setTool('RECTANGLE_TOOL')
        options.nodeManager.registerNewNode('RECTANGLE', Rectangle)
        const newRect = new Rectangle()
        options.scene.add_child(newRect)
    }

    init() {}
    destroy() {}
}