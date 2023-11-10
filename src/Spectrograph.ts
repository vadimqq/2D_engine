import { WebGLRenderer } from "./renderers/WebGLRenderer";
import { Scene } from "./scene/Scene";

export class Spectrograph {
    renderer: WebGLRenderer
    scene: Scene;
    camera: any;
    constructor(){
        this.renderer = new WebGLRenderer()
        this.scene = new Scene();
    }
    init() {}
    render(){}
}