import { NODE_SYSTEM_TYPE, Node } from "../../core/Node/Node";
import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { RectangleGeometry } from "../Rectangle_Plugin/geometry";
import fs from "./shaders/fs";
import vs from "./shaders/vs";

export class PixelGridPlugin implements Plugin {
    name = 'PIXEL_GRID_PLUGIN';

    constructor(options: PluginInitOptions) {
        options.renderer.registerProgram('PIXEL_GRID', vs, fs)
        const grid = new Grid()
        options.renderer.postEffects.push(grid)
    }

    init() {}
    destroy() {}


}


export class Grid extends Node<RectangleGeometry> {
    constructor(transform?: [number, number, number, number, number, number, number, number, number,]) {
        super({
            geometry: new RectangleGeometry(),
            transform,
            systemType: NODE_SYSTEM_TYPE.GRAPHICS,
            shaderType: 'PIXEL_GRID'
        })
       this.size.set(1000, 1000)
       this.geometry.updateGeometry(this.size)
        
    }
    setSize() {

    }
}