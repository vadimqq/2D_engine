import { Camera } from "./camera/Camera";
import { ControlNode } from "./controlNode/controlNode";
import { NodeManager } from "./core/NodeManager/NodeManager";
import { PluginManager } from "./core/PluginManager/PluginManager";
import { SystemExtensionManager } from "./core/SystemExtensionManager/SystemExtensionManager";
import { ToolManager } from "./core/ToolManager/ToolManager";
import { RectanglePlugin } from "./plugins/RectanglePlugin/RectanglePlugin";
import { WebGLRenderer } from "./renderers/WebGLRenderer";
import { Scene } from "./scene/Scene";

export class Spectrograph {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    systemExtensionManager: SystemExtensionManager;
    nodeManager = new NodeManager();
    toolManager: ToolManager;
    pluginManager: PluginManager;
    controlNode = new ControlNode();
    constructor(){
        this.renderer = new WebGLRenderer()
        this.scene = new Scene();
        this.camera = new Camera();

        //Регистрация системных зависимостей
        this.systemExtensionManager = new SystemExtensionManager({
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
        });

        this.toolManager = new ToolManager(this.systemExtensionManager)

        //Регистрация плагинов
        this.pluginManager = new PluginManager({
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
            nodeManager: this.nodeManager,
            systemExtensionManager: this.systemExtensionManager,
            toolManager: this.toolManager,
        })
        this.pluginManager.addPlugin(RectanglePlugin)
    }
    init() {
        this.render()
        console.log(this)
    }
    render(){
        const bind = this.render.bind(this)
        this.renderer.render(this.scene, this.camera)
	    requestAnimationFrame(bind);
    }
}
