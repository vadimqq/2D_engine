import { ControlNode } from "../../controlNode/controlNode";
import { Node } from "../../core/Node/Node";
import { Plugin, PluginInitOptions } from "../../core/PluginManager/Plugin";
import { RadiusControlsManager } from "./controls/RadiusControlsManager";
import { RECTANGLE_RADIUS_CONTROLS_NAME } from "./model";
import { Rectangle } from "./Rectangle";
import { RectangleTool } from "./tool";


export class RectanglePlugin implements Plugin {
    name = 'RECTANGLE_PLUGIN';
    controlNode: ControlNode;

    constructor(options: PluginInitOptions) {
        this.controlNode = options.controlNode;

        options.toolManager.registerNewTool('RECTANGLE_TOOL', new RectangleTool(options.nodeManager));
        options.nodeManager.registerNewNode('RECTANGLE', Rectangle);
        options.controlNode.registerNewNodeControls(RadiusControlsManager);

        this._onHoverChange = this._onHoverChange.bind(this);
        options.systemExtensionManager.getMouseEventSystem().addListener('_onHoverChange', this._onHoverChange)


        const arr = [...Array(2).keys()];
        
        arr.forEach(() => {
            const rect = options.nodeManager.createNode('RECTANGLE',{ transform: [
                1, 0, 0,
                0, 1, 0,
                Math.floor(Math.random() * 500), Math.floor(Math.random() * 500), 1
            ]})

            options.scene.add_child(rect)
        })
    }
    init() {}
    destroy() {}

    _onHoverChange(node: Node) {
        if (node instanceof ControlNode && node.nodeMap.size === 1 && node.getFirstNode().type === 'RECTANGLE') {
           const ControlManager = node.nodeControlsMap.get(RECTANGLE_RADIUS_CONTROLS_NAME) as RadiusControlsManager;
           ControlManager.setIsVisibleControls(true);
        } else {
            const ControlManager = this.controlNode.nodeControlsMap.get(RECTANGLE_RADIUS_CONTROLS_NAME) as RadiusControlsManager;
            ControlManager.setIsVisibleControls(false);
        }
    }
}