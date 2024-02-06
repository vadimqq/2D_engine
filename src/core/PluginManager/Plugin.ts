import { Camera } from "../../camera/Camera";
import { ControlNode } from "../../controlNode/controlNode";
import { WebGLRenderer } from "../../rendering/WebGLRenderer";
import { Scene } from "../../scene/Scene";
import { NodeManager } from "../NodeManager/NodeManager";
import { SystemExtensionManager } from "../SystemExtensionManager/SystemExtensionManager";
import { ToolManager } from "../ToolManager/ToolManager";

export interface Plugin {
    name: string;
    init: () => void;
    destroy: () => void;
}

export type PluginInitOptions = {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    nodeManager: NodeManager;
    systemExtensionManager: SystemExtensionManager;
    toolManager: ToolManager;
    controlNode: ControlNode;
}