import { Camera } from "../../camera/Camera";
import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";
import { Matrix3 } from "../../math/Matrix3";
import { Vector2 } from "../../math/Vector2";


export class CameraControlPlugin implements Plugin {
    name = 'CAMERA_CONTROL_PLUGIN';
    camera: Camera;
    projectionMatrix: Matrix3;
    tempMatrix = new Matrix3()
    private prevMousePosition = new Vector2();
    private postMousePosition = new Vector2();

    constructor(options: PluginInitOptions) {
        this.camera = options.camera
        this.projectionMatrix = options.renderer.projectionMatrix
        this.onWheel = this.onWheel.bind(this);
        options.systemExtensionManager.getMouseEventSystem().addListener('_onWheel', this.onWheel)
    }

    onWheel({ nativeEvent }: SpectrographMouseEvent) {
        nativeEvent.preventDefault()
        if (nativeEvent.ctrlKey) {
            const [clipX, clipY] = this.getClipSpaceMousePosition(nativeEvent as WheelEvent);

            this.camera.computedMatrix();
            this.prevMousePosition.set(clipX, clipY);
            this.tempMatrix.copy(this.projectionMatrix).multiply(this.camera.matrix).invert()
            this.prevMousePosition.applyMatrix3(this.tempMatrix);

            const newZoom = this.camera.zoom * Math.pow(2, nativeEvent.deltaY * -0.01);
            this.camera.setZoom(Math.max(0.02, Math.min(100, newZoom)))
            
            this.camera.computedMatrix();
            this.postMousePosition.set(clipX, clipY);
            this.tempMatrix.copy(this.projectionMatrix).multiply(this.camera.matrix).invert()
            this.postMousePosition.applyMatrix3(this.tempMatrix);
      
            this.camera.setPosition(
                this.camera.position.x +
                this.prevMousePosition.x -
                this.postMousePosition.x,
                this.camera.position.y +
                this.prevMousePosition.y -
                this.postMousePosition.y,
            );
            console.log(this.camera)
        } else {
            // const currentX = getMinMaxNumber(this.camera.position.x + nativeEvent.deltaX / this.camera.zoom, -1300, 1300)
            
            // const currentY = getMinMaxNumber(this.camera.position.y + nativeEvent.deltaY / this.camera.zoom, -1300, 1300)
            // this.camera.setPosition(
            //     currentX,
            //     currentY,
            // );
            this.camera.setPosition(
                this.camera.position.x + nativeEvent.deltaX / this.camera.zoom,
                this.camera.position.y + nativeEvent.deltaY / this.camera.zoom,
              );
        }
    }

    getClipSpaceMousePosition(e: WheelEvent) {
        const canvas = e.target as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const cssX = e.clientX - rect.left;
        const cssY = e.clientY - rect.top;
      
        const normalizedX = cssX / canvas.clientWidth;
        const normalizedY = cssY / canvas.clientHeight;
      
        const clipX = normalizedX * 2 - 1;
        const clipY = normalizedY * -2 + 1;
      
        return [clipX, clipY];
      };

    init() {}
    destroy() {}
}