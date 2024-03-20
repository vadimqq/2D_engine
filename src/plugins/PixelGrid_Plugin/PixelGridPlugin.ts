import { Camera } from "../../camera/Camera";
import { BufferGeometry } from "../../core/Geometry";
import { Node } from "../../core/Node/Node";
import { NODE_SYSTEM_TYPE } from "../../core/Node/model";
import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { PixelGridProgram } from "./PixelGridProgram";

export class PixelGridPlugin implements Plugin {
    name = 'PIXEL_GRID_PLUGIN';
    gridNode: Grid;
    constructor(options: PluginInitOptions) {

        options.renderer.registerProgram('PIXEL_GRID', PixelGridProgram)
        this.gridNode = new Grid()
        options.renderer.postEffects.push(this.gridNode)

        this._onCameraChangeZoom = this._onCameraChangeZoom.bind(this);
        options.camera.addListener('changeZoom',this._onCameraChangeZoom)
    }

    _onCameraChangeZoom(camera: Camera) {
        this.gridNode.isVisible = camera.zoom > 4
    }

    init() {}
    destroy() {}

}

export class PixelGridGeometry extends BufferGeometry {
    constructor() {
        super()
        this.position = { numComponents: 2, data: [-1, 1,  1, 1,  1, -1, -1, -1], };
        this.indices =  { numComponents: 2, data: [0, 1, 2, 2, 3, 0]};
    }
}


export class Grid extends Node<PixelGridGeometry> {
    constructor() {
        super({
            geometry: new PixelGridGeometry(),
            systemType: NODE_SYSTEM_TYPE.EFFECT,
            shaderType: 'PIXEL_GRID'
        })
        this.isVisible = false;
        
    }
    setSize() {

    }
}