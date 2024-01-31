import { Camera } from "../../camera/Camera";
import { MouseEventSystem } from "../../events/MouseEvents/MouseEventSystem";
import { WebGLRenderer } from "../../renderers/WebGLRenderer";
import { Scene } from "../../scene/Scene";

export class SystemExtensionManager {
    // private renderer: WebGLRenderer;
    // private scene: Scene;
    // private camera: Camera;

    private MOUSE_EVENT_SYSTEM: MouseEventSystem;

    constructor(options: {
        renderer: WebGLRenderer;
        scene: Scene;
        camera: Camera;
    }) {
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