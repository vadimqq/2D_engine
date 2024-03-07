import { Camera } from "../../camera/Camera";
import { BufferGeometry } from "../../core/BufferGeometry/BufferGeometry";
import { NODE_SYSTEM_TYPE, Node } from "../../core/Node/Node";
import { Vector2 } from "../../math/Vector2";
import { Scene } from "../../scene/Scene";

export class SpectrographMouseEvent {
    private camera: Camera
    nativeEvent: MouseEvent | PointerEvent | TouchEvent | WheelEvent;
    scenePosition = new Vector2();
    intersectNodes: Node<BufferGeometry>[] = [];
    isMouseDown = false;
    shiftKey = false;
    altKey = false;
    metaKey = false;

    constructor(camera: Camera, scene: Scene) {
        this.camera = camera;
    }

    updateEventInfo(nativeEvent: MouseEvent | PointerEvent | TouchEvent) {
        this.nativeEvent = nativeEvent;
        this._mapPositionToScene()
        this.shiftKey = nativeEvent.shiftKey
        this.altKey = nativeEvent.altKey
        this.metaKey = nativeEvent.metaKey
    }

    private _mapPositionToScene(): void {
        this.scenePosition.set(
            (this.nativeEvent.offsetX) / this.camera.zoom + this.camera.position.x,
            (this.nativeEvent.offsetY ) / this.camera.zoom + this.camera.position.y
        )
    }

    getLastIntersection() {
        return this.intersectNodes[this.intersectNodes.length - 1]
    }
    getFirstGraphicsNode() {
        for (let i = this.intersectNodes.length - 1; i > 0; i--) {
            const node = this.intersectNodes[i];
            if (node.systemType === NODE_SYSTEM_TYPE.GRAPHICS) {
                return node
            }
        }
        return null
    }
}

