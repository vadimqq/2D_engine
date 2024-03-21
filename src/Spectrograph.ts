import { Camera } from "./camera/Camera";
import { ControlNode } from "./controlNode/controlNode";
import { NodeManager } from "./core/NodeManager/NodeManager";
import { PluginManager } from "./core/PluginManager/PluginManager";
import { SystemExtensionManager } from "./core/SystemExtensionManager/SystemExtensionManager";
import { ToolManager } from "./core/ToolManager/ToolManager";
import { WebGLRenderer } from "./rendering/WebGLRenderer";
import { Scene } from "./scene/Scene";
import { Ticker } from "./ticker/Ticker";

export class Spectrograph {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    systemExtensionManager: SystemExtensionManager;
    nodeManager: NodeManager;
    toolManager: ToolManager;
    pluginManager: PluginManager;
    controlNode = new ControlNode();
    ticker: Ticker = new Ticker()
    constructor(){
        const canvas = document.createElement('canvas')
        canvas.width = 1024
        canvas.height = 768;
        document.getElementById('app')?.appendChild(canvas)
        
        this.camera = new Camera(canvas);
        this.scene = new Scene();

        this.renderer = new WebGLRenderer(canvas)

        this.updateFrustum = this.updateFrustum.bind(this);
        this.controlNode.addListener('change_visible', this.updateFrustum)//TODO нужно подумать как вынести все это дело, в рутовом классе подписка на разные инстансы это плохо
       

        this.nodeManager = new NodeManager(this.renderer);

        //Регистрация системных зависимостей
        this.systemExtensionManager = new SystemExtensionManager({
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
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



        this.controlNode.parent = this.scene //TODO скорее всего это костыль!
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

    updateFrustum() {
        this.camera.needUpdateFrustum = true;
    }
}
