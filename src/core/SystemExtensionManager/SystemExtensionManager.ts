import { MouseEventSystem } from "../../events/MouseEvents/MouseEventSystem";
import { ExtensionInitOptions } from "./Extension";

export class SystemExtensionManager {
    // private renderer: WebGLRenderer;
    // private scene: Scene;
    // private camera: Camera;

    private MOUSE_EVENT_SYSTEM: MouseEventSystem;

    constructor(options: ExtensionInitOptions) {
        // this.renderer = options.renderer
        // this.scene = options.scene
        // this.camera = options.camera

        this.MOUSE_EVENT_SYSTEM = new MouseEventSystem(options)
        this.MOUSE_EVENT_SYSTEM.init()
      
    }

    getMouseEventSystem() {
        return this.MOUSE_EVENT_SYSTEM
    }
   
}