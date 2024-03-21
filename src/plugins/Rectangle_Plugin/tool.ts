import { NodeManager } from "../../core/NodeManager/NodeManager";
import { Tool } from "../../core/ToolManager/Tool";
import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";

export class RectangleTool implements Tool {
    nodeManager: NodeManager;
    constructor(nodeManager: NodeManager) {
        this.nodeManager = nodeManager;
    }

    onPointerDown (event: SpectrographMouseEvent) {
    
        const RectangleClass = this.nodeManager.getNodeClassByName('RECTANGLE')
        if (RectangleClass) {
            const newRectangle = this.nodeManager.createNode('RECTANGLE',[
                1, 0, 0,
                0, 1, 0,
                event.scenePosition.x, event.scenePosition.y, 1
            ])
            event.intersectNodes[0].add_child(newRectangle)
        }

    }
}