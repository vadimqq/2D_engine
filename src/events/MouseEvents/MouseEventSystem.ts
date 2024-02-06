import EventEmitter from "eventemitter3";
import { Camera } from "../../camera/Camera";
import { ControlNode } from "../../controlNode/controlNode";
import { BufferGeometry } from "../../core/BufferGeometry/BufferGeometry";
import { Node } from "../../core/Node/Node";
import { StreamManager } from "../../core/StreamManager/StreamManager";
import { Extension, ExtensionInitOptions } from "../../core/SystemExtensionManager/Extension";
import { WebGLRenderer } from "../../rendering/WebGLRenderer";
import { Scene } from "../../scene/Scene";
import { SpectrographMouseEvent } from "./SpectrographMouseEvent";

interface mouseEvents {
    _onPointerDown: [event: SpectrographMouseEvent];
    _onPointerMove: [event: SpectrographMouseEvent];
    _onPointerUp: [event: SpectrographMouseEvent];
}
export class MouseEventSystem extends EventEmitter<mouseEvents> implements Extension {
    name = 'MOUSE_EVENT_SYSTEM'
    public domElement: HTMLCanvasElement;
    public renderer: WebGLRenderer;
    public camera: Camera;
    public scene: Scene;
    public streamManager: StreamManager;
    public controlNode: ControlNode;


    mouseEvent: SpectrographMouseEvent;

    constructor({renderer, camera, scene, streamManger, controlNode}: ExtensionInitOptions) {
        super()
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
        this.domElement = renderer.canvasElement // как заглушка для тайпскрипта
        this.streamManager = streamManger
        this.mouseEvent = new SpectrographMouseEvent(this.camera, this.scene)
        this.controlNode = controlNode

        this._onPointerDown = this._onPointerDown.bind(this);
        this._onPointerMove = this._onPointerMove.bind(this);
        this._onPointerUp = this._onPointerUp.bind(this);

        // this._onPointerUp = this._onPointerUp.bind(this);
        // this._onPointerOverOut = this._onPointerOverOut.bind(this);
        // this._onWheel = this._onWheel.bind(this);
        // const stream = this.streamManager.getCollisionStream()

        // stream.onmessage = (ev) => {
        //     console.log(ev)
        // }

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
            // EventsTicker.addTickerListener();
    

                this.domElement.addEventListener('mousemove', this._onPointerMove, true);
                this.domElement.addEventListener('mousedown', this._onPointerDown, true);
                this.domElement.addEventListener('mouseup', this._onPointerUp, true);

            //     this.domElement.addEventListener('mouseout', this._onPointerOverOut, true);
            //     this.domElement.addEventListener('mouseover', this._onPointerOverOut, true);
            //     globalThis.addEventListener('mouseup', this._onPointerUp, true);
    
        }
    
        private _removeEvents(): void {
            // EventsTicker.removeTickerListener();
    
    
            this.domElement.removeEventListener('mousemove', this._onPointerMove, true);
            this.domElement.removeEventListener('mousedown', this._onPointerDown, true);
            this.domElement.removeEventListener('mouseup', this._onPointerUp, true);

            //     this.domElement.removeEventListener('mouseout', this._onPointerOverOut, true);
            //     this.domElement.removeEventListener('mouseover', this._onPointerOverOut, true);
    
            // this.domElement.removeEventListener('wheel', this._onWheel, true);
    
        }

        private _onPointerDown(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void {
            this.mouseEvent.updateEventInfo(nativeEvent)
            this.mouseEvent.isMouseDown = true;
            this.testIntersect([this.scene, this.controlNode], this.mouseEvent)
            this.emit('_onPointerDown', this.mouseEvent)
        }

        private _onPointerMove(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void {
            this.mouseEvent.updateEventInfo(nativeEvent)
            this.testIntersect([this.scene, this.controlNode], this.mouseEvent)
            this.emit('_onPointerMove', this.mouseEvent)
        }

        private _onPointerUp(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void {
            this.mouseEvent.isMouseDown = false;
            this.mouseEvent.updateEventInfo(nativeEvent)
            this.emit('_onPointerUp', this.mouseEvent)
        }

        testIntersect(nodeList: Node<BufferGeometry>[], event: SpectrographMouseEvent) {
            event.intersectNodes = []
            const intersects = findIntersect(nodeList, event.scenePosition )

             event.intersectNodes = intersects
        }
}


const findIntersect = (nodeList: Node<BufferGeometry>[], eventPoint: {x: number, y: number}, intersectedLayers: Node<BufferGeometry>[] = []) => {
    nodeList.forEach((node) => {
        const isIntersect = (eventPoint.x > node.localMatrix.elements[6] && eventPoint.x < node.size.x + node.localMatrix.elements[6]) && (eventPoint.y > node.localMatrix.elements[7] && eventPoint.y < node.size.y + node.localMatrix.elements[7])
        if (isIntersect) {
            intersectedLayers.push(node)
            findIntersect(node.children, eventPoint, intersectedLayers)
        }
    });
    return intersectedLayers
}