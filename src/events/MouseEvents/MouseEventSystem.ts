import EventEmitter from "eventemitter3";
import { Camera } from "../../camera/Camera";
import { ControlNode } from "../../controlNode/controlNode";
import { Node } from "../../core/Node/Node";
import { Extension, ExtensionInitOptions } from "../../core/SystemExtensionManager/Extension";
import { Vector2 } from "../../math/Vector2";
import { WebGLRenderer } from "../../rendering/WebGLRenderer";
import { Scene } from "../../scene/Scene";
import { SpectrographMouseEvent } from "./SpectrographMouseEvent";

class IntersectService {
    p1 = new Vector2();
    p2 = new Vector2();
    p3 = new Vector2();
    p4 = new Vector2();

    v1 = new Vector2();
    v2 = new Vector2();
    v3 = new Vector2();
    v4 = new Vector2();

    findIntersect(nodeList: Node[], eventPoint: Vector2, intersectedLayers: Node[] = []) {
        nodeList.forEach((node) => {
            this.p1.set(0, 0).applyMatrix3(node.worldMatrix);
            this.p2.set(node.size.x, 0).applyMatrix3(node.worldMatrix);
            this.p3.set(node.size.x, node.size.y).applyMatrix3(node.worldMatrix);
            this.p4.set(0, node.size.y).applyMatrix3(node.worldMatrix);
    
            this.v1.set(-(this.p2.y - this.p1.y), (this.p2.x - this.p1.x)); //Top
            this.v2.set(-(this.p3.y - this.p2.y), (this.p3.x - this.p2.x)); //Right
            this.v3.set(-(this.p4.y - this.p3.y), (this.p4.x - this.p3.x)); //Bottom
            this.v4.set(-(this.p1.y - this.p4.y), (this.p1.x - this.p4.x)); //Left
    
            const c1 = -(this.v1.x * this.p1.x + this.v1.y * this.p1.y);
            const c2 = -(this.v2.x * this.p2.x + this.v2.y * this.p2.y);
            const c3 = -(this.v3.x * this.p3.x + this.v3.y * this.p3.y);
            const c4 = -(this.v4.x * this.p4.x + this.v4.y * this.p4.y);
            
            if (
                this.isIntersect(this.v1, c1, eventPoint.x, eventPoint.y)
                && this.isIntersect(this.v2, c2, eventPoint.x, eventPoint.y)
                && this.isIntersect(this.v3, c3, eventPoint.x, eventPoint.y)
                && this.isIntersect(this.v4, c4, eventPoint.x, eventPoint.y)
            ) {
                intersectedLayers.push(node);
            }     
    
        });
        return intersectedLayers
    }

    isIntersect(v: Vector2, c: number, x: number, y: number) {
        return (v.x * x + v.y * y + c) / Math.sqrt( v.x*v.x + v.y*v.y )  > 0;
    }

}
interface mouseEvents {
    _onPointerDown: [event: SpectrographMouseEvent];
    _onPointerMove: [event: SpectrographMouseEvent];
    _onPointerUp: [event: SpectrographMouseEvent];
    _onWheel: [event: SpectrographMouseEvent];
}
export class MouseEventSystem extends EventEmitter<mouseEvents> implements Extension {
    name = 'MOUSE_EVENT_SYSTEM'
    public domElement: HTMLCanvasElement;
    public renderer: WebGLRenderer;
    public camera: Camera;
    public scene: Scene;
    public controlNode: ControlNode;


    mouseEvent: SpectrographMouseEvent;
    intersectService = new IntersectService();

    constructor({renderer, camera, scene, controlNode}: ExtensionInitOptions) {
        super()
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
        this.domElement = renderer.canvasElement // как заглушка для тайпскрипта
        this.mouseEvent = new SpectrographMouseEvent(this.camera, this.scene)
        this.controlNode = controlNode

        this._onPointerDown = this._onPointerDown.bind(this);
        this._onPointerMove = this._onPointerMove.bind(this);
        this._onPointerUp = this._onPointerUp.bind(this);
        this._onWheel = this._onWheel.bind(this);
    }

    init() {
        const { canvasElement } = this.renderer;
        this.setTargetElement(canvasElement);
    };

    destroy () {};

    public setTargetElement(element: HTMLCanvasElement): void {
        this._removeEvents();
        this.domElement = element;
        this._addEvents();
    }

        private _addEvents(): void {    
                this.domElement.addEventListener('mousemove', this._onPointerMove, true);
                this.domElement.addEventListener('mousedown', this._onPointerDown, true);
                this.domElement.addEventListener('mouseup', this._onPointerUp, true);
                this.domElement.addEventListener('wheel', this._onWheel, true);    
        }
    
        private _removeEvents(): void {
            this.domElement.removeEventListener('mousemove', this._onPointerMove, true);
            this.domElement.removeEventListener('mousedown', this._onPointerDown, true);
            this.domElement.removeEventListener('mouseup', this._onPointerUp, true);
            this.domElement.removeEventListener('wheel', this._onWheel, true);
        }

        private _onPointerDown(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void {
            this.mouseEvent.updateEventInfo(nativeEvent)
            this.mouseEvent.isMouseDown = true;
            this.testIntersect(this.renderer.frustum.nodesInViewport, this.mouseEvent)
            this.emit('_onPointerDown', this.mouseEvent)
        }

        private _onPointerMove(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void {
            this.mouseEvent.updateEventInfo(nativeEvent)
            this.testIntersect(this.renderer.frustum.nodesInViewport, this.mouseEvent)
            this.emit('_onPointerMove', this.mouseEvent)
        }

        private _onPointerUp(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void {
            this.mouseEvent.isMouseDown = false;
            this.mouseEvent.updateEventInfo(nativeEvent)
            this.emit('_onPointerUp', this.mouseEvent)
        }

        private _onWheel(nativeEvent: WheelEvent): void {
            this.mouseEvent.updateEventInfo(nativeEvent)
            this.emit('_onWheel', this.mouseEvent) 
        }

        testIntersect(nodeList: Node[], event: SpectrographMouseEvent) {
            event.intersectNodes = []
            const intersects = this.intersectService.findIntersect(nodeList, event.scenePosition)
            event.intersectNodes = intersects
        }
}
