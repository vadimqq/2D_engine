import { MouseEventSystem } from "../../events/MouseEvents/MouseEventSystem";
import { ExtensionInitOptions } from "./Extension";

export class SystemExtensionManager {
    // private scene: Scene;
    // private camera: Camera;
    canvas: HTMLCanvasElement;

    private MOUSE_EVENT_SYSTEM: MouseEventSystem;

    constructor(options: ExtensionInitOptions) {
        this.canvas = options.renderer.canvasElement;
        // this.scene = options.scene
        // this.camera = options.camera

        this.MOUSE_EVENT_SYSTEM = new MouseEventSystem(options)
        this.MOUSE_EVENT_SYSTEM.init()
      
    }

    getMouseEventSystem() {
        return this.MOUSE_EVENT_SYSTEM
    }
   
}