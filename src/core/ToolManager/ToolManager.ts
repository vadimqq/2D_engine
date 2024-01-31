import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";
import { SystemExtensionManager } from "../SystemExtensionManager/SystemExtensionManager";
import { Tool } from "./Tool";

export class ToolManager {
    private systemExtensionManager: SystemExtensionManager;
    currentTool: Tool = DEFAULT_TOOL
    toolMap = new Map();
    constructor(systemExtensionManager: SystemExtensionManager) {
        this.systemExtensionManager = systemExtensionManager
        this._onPointerDown =  this._onPointerDown.bind(this);
        this.systemExtensionManager.getMouseEventSystem().addListener('_onPointerDown', this._onPointerDown)
    }

    registerNewTool(name: string, tool: Tool) {
        this.toolMap.set(name, tool)
    }
    getCurrentTool() {}
    setTool(toolName: string) {
        this.currentTool = this.toolMap.get(toolName)
    }

    _onPointerDown(event: SpectrographMouseEvent) {
        this.currentTool.onClick(event)
    }
}

const DEFAULT_TOOL: Tool = {
    onClick: () => {}
}