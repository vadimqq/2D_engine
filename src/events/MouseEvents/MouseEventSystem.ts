import EventEmitter from "eventemitter3";
import { Camera } from "../../camera/Camera";
import { Extension, ExtensionInitOptions } from "../../core/SystemExtensionManager/Extension";
import { WebGLRenderer } from "../../renderers/WebGLRenderer";
import { Scene } from "../../scene/Scene";
import { SpectrographMouseEvent } from "./SpectrographMouseEvent";

interface mouseEvents {
    _onPointerDown: [event: SpectrographMouseEvent];
    _onPointerMove: [event: SpectrographMouseEvent]
}
export class MouseEventSystem extends EventEmitter<mouseEvents> implements Extension {
    name = 'MOUSE_EVENT_SYSTEM'
    public domElement: HTMLCanvasElement;
    public renderer: WebGLRenderer;
    public camera: Camera;
    public scene: Scene;

    constructor({renderer, camera, scene}: ExtensionInitOptions) {
        super()
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
        this.domElement = renderer.canvasElement // как заглушка для тайпскрипта

        this._onPointerDown = this._onPointerDown.bind(this);
        this._onPointerMove = this._onPointerMove.bind(this);
        // this._onPointerUp = this._onPointerUp.bind(this);
        // this._onPointerOverOut = this._onPointerOverOut.bind(this);
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
            // EventsTicker.addTickerListener();
    

                this.domElement.addEventListener('mousemove', this._onPointerMove, true);
                this.domElement.addEventListener('mousedown', this._onPointerDown, true);
            //     this.domElement.addEventListener('mouseout', this._onPointerOverOut, true);
            //     this.domElement.addEventListener('mouseover', this._onPointerOverOut, true);
            //     globalThis.addEventListener('mouseup', this._onPointerUp, true);
                this.domElement.addEventListener('wheel', this._onWheel, true);
    
        }
    
        private _removeEvents(): void {
            // EventsTicker.removeTickerListener();
    
    
            this.domElement.removeEventListener('mousemove', this._onPointerMove, true);
            this.domElement.removeEventListener('mousedown', this._onPointerDown, true);
            //     this.domElement.removeEventListener('mouseout', this._onPointerOverOut, true);
            //     this.domElement.removeEventListener('mouseover', this._onPointerOverOut, true);
            //     globalThis.removeEventListener('mouseup', this._onPointerUp, true);
    
            this.domElement.removeEventListener('wheel', this._onWheel, true);
    
        }

        private _onPointerDown(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void {
            const event = new SpectrographMouseEvent(nativeEvent, this.camera, this.scene);
            const objects = this.scene.children
                  
            this.emit('_onPointerDown', event)
        }

        private _onPointerMove(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void {
            const event = new SpectrographMouseEvent(nativeEvent, this.camera, this.scene);                
            this.emit('_onPointerMove', event)
        }
    
        // private _onPointerMove(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void {
        //     const event = new SpectrographMouseEvent(nativeEvent, this.camera);
        // }
        // {
        //     if (!this.features.move) return;
        //     this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    
        //     EventsTicker.pointerMoved();
    
        //     const normalizedEvents = this._normalizeToPointerData(nativeEvent);
    
        //     for (let i = 0, j = normalizedEvents.length; i < j; i++)
        //     {
        //         const event = this._bootstrapEvent(this._rootPointerEvent, normalizedEvents[i]);
    
        //         this.rootBoundary.mapEvent(event);
        //     }
    
        //     this.setCursor(this.rootBoundary.cursor);
        // }
    
        // private _onPointerUp(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void
        // {
        //     if (!this.features.click) return;
        //     this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    
        //     let target = nativeEvent.target;
    
        //     // if in shadow DOM use composedPath to access target
        //     if (nativeEvent.composedPath && nativeEvent.composedPath().length > 0)
        //     {
        //         target = nativeEvent.composedPath()[0];
        //     }
    
        //     const outside = target !== this.domElement ? 'outside' : '';
        //     const normalizedEvents = this._normalizeToPointerData(nativeEvent);
    
        //     for (let i = 0, j = normalizedEvents.length; i < j; i++)
        //     {
        //         const event = this._bootstrapEvent(this._rootPointerEvent, normalizedEvents[i]);
    
        //         event.type += outside;
    
        //         this.rootBoundary.mapEvent(event);
        //     }
    
        //     this.setCursor(this.rootBoundary.cursor);
        // }
       
        // private _onPointerOverOut(nativeEvent: MouseEvent | PointerEvent | TouchEvent): void
        // {
        //     if (!this.features.click) return;
        //     this.rootBoundary.rootTarget = this.renderer.lastObjectRendered;
    
        //     const normalizedEvents = this._normalizeToPointerData(nativeEvent);
    
        //     for (let i = 0, j = normalizedEvents.length; i < j; i++)
        //     {
        //         const event = this._bootstrapEvent(this._rootPointerEvent, normalizedEvents[i]);
    
        //         this.rootBoundary.mapEvent(event);
        //     }
    
        //     this.setCursor(this.rootBoundary.cursor);
        // }
    
        protected _onWheel(nativeEvent: WheelEvent): void {
            const event = new SpectrographMouseEvent(nativeEvent, this.camera, this.scene);
            console.log(event)
            // this.camera.setPosition(this.camera.position.x + nativeEvent.deltaX, this.camera.position.y + nativeEvent.deltaY)
        }

    
}

