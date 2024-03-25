import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { ResizeControlsManager } from "./ResizeControls/ResizeControlsManager";
import { ResizeSideControlsManager } from "./ResizeSideControls/ResizeSideControlsManager";
import { RotateControlsManager } from "./RotateControls/RotateControlsManager";


export class BaseControls_Plugin implements Plugin {
    name = 'BASE_CONTROL_PLUGIN';

    constructor(options: PluginInitOptions) {
        options.controlNode.registerNewNodeControls(RotateControlsManager);
        options.controlNode.registerNewNodeControls(ResizeSideControlsManager);
        options.controlNode.registerNewNodeControls(ResizeControlsManager);
    }

    init() {}
    destroy() {}
}