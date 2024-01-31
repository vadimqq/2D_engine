import { NodeManager } from "../../core/NodeManager/NodeManager";
import { Tool } from "../../core/ToolManager/Tool";
import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";

export class RectangleTool implements Tool {
    nodeManager: NodeManager;
    constructor(nodeManager: NodeManager) {
        this.nodeManager = nodeManager;
    }

    onClick (event: SpectrographMouseEvent) {
        const RectangleClass = this.nodeManager.getNodeClassByName('RECTANGLE')
        if (RectangleClass) {
            const newRectangle = new RectangleClass()
            // console.log(event, newRectangle)
        }

    }
}