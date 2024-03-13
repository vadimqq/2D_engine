import { ControlNode } from "../../controlNode/controlNode";
import { Tool } from "../../core/ToolManager/Tool";
import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";
import { Vector2 } from "../../math/Vector2";
import { Scene } from "../../scene/Scene";

export class MoveTool implements Tool {
    controlNode: ControlNode;
    startPosition = new Vector2();

    constructor(controlNode: ControlNode) {
        this.controlNode = controlNode;
    }
    onPointerDown(event: SpectrographMouseEvent) {
        const intersect = event.getLastIntersection()

        if (intersect && intersect instanceof Scene) {
            this.controlNode.clearNodeList()
        } else if (intersect instanceof ControlNode) {
            this.startPosition.copyFrom(event.scenePosition)
            
            // this.controlNode.startNodeMutation()
        } else {
            if (event.shiftKey) {
                this.controlNode.addNode(intersect)
            } else {
                this.controlNode.clearNodeList()
                this.controlNode.addNode(intersect)
            }
        }
        this.startPosition.copyFrom(event.scenePosition)
       
    }

    onPointerMove(event: SpectrographMouseEvent) {
        if (event.isMouseDown) { //TODO нужна машина состояний
            this.controlNode.setPosition(event.scenePosition.sub(this.startPosition).round())
        }
    }

    onPointerUp(event: SpectrographMouseEvent) {
        const intersect = event.getLastIntersection()
        const graphicsNode = event.getFirstGraphicsNode()
        if (event.scenePosition.equals(this.startPosition) && intersect instanceof ControlNode && graphicsNode) {
            if (event.shiftKey) {
                if (this.controlNode.hasNode(graphicsNode.guid)) {
                    this.controlNode.removeNode(graphicsNode.guid)
                } else {
                    this.controlNode.addNode(graphicsNode)
                }
            } else {
                this.controlNode.clearNodeList()
                this.controlNode.addNode(graphicsNode)
            }
        }
       
        this.controlNode.endNodeMutation()//TODO нужно делать проверку была ли трансформация
    }
    
}

