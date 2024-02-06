import { Camera } from "../../camera/Camera";
import { ControlNode } from "../../controlNode/controlNode";
import { WebGLRenderer } from "../../rendering/WebGLRenderer";
import { Scene } from "../../scene/Scene";
import { StreamManager } from "../StreamManager/StreamManager";

export interface Extension {
    name: string;
    init: () => void;
    destroy: () => void;
}

export type ExtensionInitOptions = {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    streamManger: StreamManager;
    controlNode: ControlNode;
}