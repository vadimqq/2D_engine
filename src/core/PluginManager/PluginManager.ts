import { Camera } from "../../camera/Camera";
import { ControlNode } from "../../controlNode/controlNode";
import { WebGLRenderer } from "../../rendering/WebGLRenderer";
import { Scene } from "../../scene/Scene";
import { ClassType } from "../../utils/models";
import { NodeManager } from "../NodeManager/NodeManager";
import { SystemExtensionManager } from "../SystemExtensionManager/SystemExtensionManager";
import { ToolManager } from "../ToolManager/ToolManager";
import { Plugin, PluginInitOptions } from "./Plugin";

export class PluginManager {
    private renderer: WebGLRenderer;
    private scene: Scene;
    private camera: Camera;
    private nodeManager: NodeManager;
    private systemExtensionManager: SystemExtensionManager;
    private toolManager: ToolManager;
    private controlNode: ControlNode;
    
    plugins: Map<string, Plugin> = new Map()

    constructor(options: PluginInitOptions) {
        this.renderer = options.renderer
        this.scene = options.scene
        this.camera = options.camera
        this.nodeManager = options.nodeManager
        this.systemExtensionManager = options.systemExtensionManager
        this.toolManager = options.toolManager
        this.controlNode = options.controlNode
    }

    addPlugin(NewPlugin: ClassType<Plugin>) {
        const pluginInstance = new NewPlugin({
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
            nodeManager: this.nodeManager,
            controlNode: this.controlNode,
            systemExtensionManager: this.systemExtensionManager,
            toolManager: this.toolManager
        }) as Plugin

        pluginInstance.init()
        this.plugins.set(pluginInstance.name, pluginInstance)
    }
}