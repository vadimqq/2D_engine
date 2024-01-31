import { Camera } from "../../camera/Camera";
import { BufferGeometry } from "../../core/BufferGeometry/BufferGeometry";
import { Node } from "../../core/Node/Node";
import { Scene } from "../../scene/Scene";

export class SpectrographMouseEvent {
    private camera: Camera
    nativeEvent: MouseEvent | PointerEvent | TouchEvent;
    positionOnSceneX = 0;
    positionOnSceneY = 0;
    intersectNodes = [];

    constructor(nativeEvent: MouseEvent | PointerEvent | TouchEvent, camera: Camera, scene: Scene) {
        this.nativeEvent = nativeEvent;
        this.camera = camera;
        this._mapPositionToScene()
        this.testIntersect(scene)
        // console.log(nativeEvent)
    }

    private _mapPositionToScene(): void {
        this.positionOnSceneX = (this.nativeEvent.offsetX) / this.camera.scale + this.camera.position.x
        this.positionOnSceneY = (this.nativeEvent.offsetY ) / this.camera.scale + this.camera.position.y
    }


    testIntersect(node: Node<BufferGeometry>){
            console.log(node.getWorldPosition(), node.size)
    }
}