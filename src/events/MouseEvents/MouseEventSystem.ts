import EventEmitter from "eventemitter3";
import { Camera } from "../../camera/Camera";
import { ControlNode } from "../../controlNode/controlNode";
import { BufferGeometry } from "../../core/BufferGeometry/BufferGeometry";
import { Node } from "../../core/Node/Node";
import { StreamManager } from "../../core/StreamManager/StreamManager";
import { Extension, ExtensionInitOptions } from "../../core/SystemExtensionManager/Extension";
import { Vector2 } from "../../math/Vector2";
import { WebGLRenderer } from "../../rendering/WebGLRenderer";
import { Scene } from "../../scene/Scene";
import { SpectrographMouseEvent } from "./SpectrographMouseEvent";

//TODO Похожий класс есть в контрол ноде, вычисления слишком сложные нужно думать как искать пересечения проще!
class CalculateSizeService {
	leftTop = new Vector2();
	rightTop = new Vector2();
	rightBottom = new Vector2();
	leftBottom = new Vector2();

    min = new Vector2();
    max = new Vector2();

	calculateSizeMultiLayer(node: Node<BufferGeometry>) {
		this.leftTop
		    .set(0, 0)
			.applyMatrix3(node.worldMatrix);
		this.rightTop
			.set(node.size.x, 0)
			.applyMatrix3(node.worldMatrix);
		this.rightBottom
			.set(node.size.x, node.size.y)
			.applyMatrix3(node.worldMatrix);
		this.leftBottom
			.set(0, node.size.y)
			.applyMatrix3(node.worldMatrix);
	
		const min = this.min
			.copy(this.leftTop)
			.min(this.rightTop)
			.min(this.rightBottom)
			.min(this.leftBottom);
	
		const max = this.max
			.copy(this.leftTop)
			.max(this.rightTop)
			.max(this.rightBottom)
			.max(this.leftBottom);
	
		return {
            maxX: max.x,
            maxY: max.y,
            minX: min.x,
            minY: min.y,
        };
	  }
}

const calculateSizeService = new CalculateSizeService();

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
            const intersects = findIntersect(nodeList, event.scenePosition)
            event.intersectNodes = intersects
        }
}


const findIntersect = (nodeList: Node<BufferGeometry>[], eventPoint: {x: number, y: number}, intersectedLayers: Node<BufferGeometry>[] = []) => {
    nodeList.forEach((node) => {
        const { maxX, minX, minY, maxY } = calculateSizeService.calculateSizeMultiLayer(node)
        
        const isIntersect = (eventPoint.x > minX && eventPoint.x < maxX) && (eventPoint.y > minY && eventPoint.y < maxY)
        if (isIntersect) {
            intersectedLayers.push(node)
        }
    });
    return intersectedLayers
}
  