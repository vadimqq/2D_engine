import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { Polygon } from "./Polygon";


export class PolyginPlugin implements Plugin {
    name = 'POLYGON_PLUGIN';

    constructor(options: PluginInitOptions) {
        options.nodeManager.registerNewNode('POLYGON', Polygon)

        Array(5).fill('').forEach(() => {
            const polygon = options.nodeManager.createNode('POLYGON',{ transform: [
                1, 0, 0,
                0, 1, 0,
                Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 1
            ]})

            options.scene.add_child(polygon)
        })
    }

    init() {}
    destroy() {}
}