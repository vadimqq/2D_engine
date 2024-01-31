import { Camera } from "../../camera/Camera";
import { WebGLRenderer } from "../../renderers/WebGLRenderer";
import { Scene } from "../../scene/Scene";

export interface Extension {
    name: string;
    init: () => void;
    destroy: () => void;
}

export type ExtensionInitOptions = {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
}