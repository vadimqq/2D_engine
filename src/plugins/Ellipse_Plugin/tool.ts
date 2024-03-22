import { NodeManager } from "../../core/NodeManager/NodeManager";
import { Tool } from "../../core/ToolManager/Tool";
import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";

export class EllipseTool implements Tool {
    nodeManager: NodeManager;
    constructor(nodeManager: NodeManager) {
        this.nodeManager = nodeManager;
    }

    onPointerDown (event: SpectrographMouseEvent) {

        const EllipseClass = this.nodeManager.getNodeClassByName('ELLIPSE')
        if (EllipseClass) {
            console.log(event.intersectNodes[0])
            const newEllipse = this.nodeManager.createNode('ELLIPSE',[
                1, 0, 0,
                0, 1, 0,
                event.scenePosition.x, event.scenePosition.y, 1
            ])
            event.intersectNodes[0].add_child(newEllipse)
        }

    }
}