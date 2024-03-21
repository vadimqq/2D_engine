import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { MoveTool } from "./moveTool";


export class MoveToolPlugin implements Plugin {
    name = 'MOVE_TOOL_PLUGIN';
    constructor(options: PluginInitOptions) {
        options.toolManager.registerNewTool('MOVE_TOOL', new MoveTool(options.controlNode, options.toolManager.cursorStyleManager))
        options.toolManager.setTool('MOVE_TOOL')
    }

    init() {}
    destroy() {}
}