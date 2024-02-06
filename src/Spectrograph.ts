import { Camera } from "./camera/Camera";
import { ControlNode } from "./controlNode/controlNode";
import { NodeManager } from "./core/NodeManager/NodeManager";
import { PluginManager } from "./core/PluginManager/PluginManager";
import { StreamManager } from "./core/StreamManager/StreamManager";
import { SystemExtensionManager } from "./core/SystemExtensionManager/SystemExtensionManager";
import { ToolManager } from "./core/ToolManager/ToolManager";
import { MoveToolPlugin } from "./plugins/MoveTool_Plugin/MoveToolPlugin";
import { RectanglePlugin } from "./plugins/Rectangle_Plugin/RectanglePlugin";
import { WebGLRenderer } from "./rendering/WebGLRenderer";
import { Scene } from "./scene/Scene";
import { Ticker } from "./ticker/Ticker";

export class Spectrograph {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    systemExtensionManager: SystemExtensionManager;
    nodeManager = new NodeManager();
    toolManager: ToolManager;
    pluginManager: PluginManager;
    controlNode = new ControlNode();
    streamsManager = new StreamManager();
    ticker: Ticker = new Ticker()
    constructor(){
        this.renderer = new WebGLRenderer()
        this.scene = new Scene();
        this.camera = new Camera();
        //Регистрация системных зависимостей
        this.systemExtensionManager = new SystemExtensionManager({
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
            streamManger: this.streamsManager,
            controlNode: this.controlNode,
        });

        this.toolManager = new ToolManager(this.systemExtensionManager)

        //Регистрация плагинов
        this.pluginManager = new PluginManager({
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
            nodeManager: this.nodeManager,
            controlNode: this.controlNode,
            systemExtensionManager: this.systemExtensionManager,
            toolManager: this.toolManager,
        })
        this.pluginManager.addPlugin(RectanglePlugin)
        this.pluginManager.addPlugin(MoveToolPlugin)


        this.controlNode.parent = this.scene //TODO скорее всего это костыль!
        console.log(this)
    }
    init() {
        this.ticker.start()
        this.ticker.add(() => {
            this.render()
        }, -25)
    }
    render(){
        this.renderer.render(this.scene, this.camera, this.controlNode)
    }
}
