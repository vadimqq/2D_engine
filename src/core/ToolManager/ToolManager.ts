import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";
import { SystemExtensionManager } from "../SystemExtensionManager/SystemExtensionManager";
import { CursorStyleManager } from "./CursorManager";
import { Tool } from "./Tool";

export class ToolManager {
    private systemExtensionManager: SystemExtensionManager;
    currentTool: Tool = DEFAULT_TOOL;
    toolMap = new Map();
    cursorStyleManager: CursorStyleManager;

    constructor(systemExtensionManager: SystemExtensionManager) {
        this.systemExtensionManager = systemExtensionManager;
        this.cursorStyleManager = new CursorStyleManager(systemExtensionManager.canvas);

        this._onPointerDown =  this._onPointerDown.bind(this);
        this.systemExtensionManager.getMouseEventSystem().addListener('_onPointerDown', this._onPointerDown)

        this._onPointerMove =  this._onPointerMove.bind(this);
        this.systemExtensionManager.getMouseEventSystem().addListener('_onPointerMove', this._onPointerMove)

        this._onPointerUp =  this._onPointerUp.bind(this);
        this.systemExtensionManager.getMouseEventSystem().addListener('_onPointerUp', this._onPointerUp)

    }

    registerNewTool(name: string, tool: Tool) {
        this.toolMap.set(name, tool)
    }
    getCurrentTool() {}
    setTool(toolName: string) {
        this.currentTool = this.toolMap.get(toolName);
    }

    _onPointerDown(event: SpectrographMouseEvent) {
        this.currentTool?.onPointerDown(event)
    }

    _onPointerMove(event: SpectrographMouseEvent) {
        this.currentTool?.onPointerMove(event)
    }

    _onPointerUp(event: SpectrographMouseEvent) {
        this.currentTool?.onPointerUp(event)
    }
}

const DEFAULT_TOOL: Tool = {
    onClick: () => {},
    onPointerDown: () => {},
}