import { ControlNode } from "../../controlNode/controlNode";
import { Node } from "../../core/Node/Node";
import { NODE_SYSTEM_TYPE } from "../../core/Node/model";
import { CursorStyleManager } from "../../core/ToolManager/CursorManager";
import { Tool } from "../../core/ToolManager/Tool";
import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";
import { Vector2 } from "../../math/Vector2";
import { controlNodeActions } from "./actions/controlNodeActions";
import { defaultActions } from "./actions/defaultActions";
import { graphicsActions } from "./actions/graphicsActions";
import { resizeControlActions } from "./actions/resizeControlActions";
import { resizeSideControlActions } from "./actions/resizeSideControlActions";
import { rotateControlActions } from "./actions/rotateControlActions";
import { sceneActions } from "./actions/sceneActions";



export class MoveTool implements Tool {
    controlNode: ControlNode;
    cursorStyleManager: CursorStyleManager
    startPosition = new Vector2();
    currentIntersectionNode: Node;
    actionMapper = {
        [NODE_SYSTEM_TYPE.CONTROL_NODE]: controlNodeActions,
        [NODE_SYSTEM_TYPE.RESIZE_CONTROL]: resizeControlActions,
        [NODE_SYSTEM_TYPE.RESIZE_SIDE_CONTROL]: resizeSideControlActions,
        [NODE_SYSTEM_TYPE.ROTATE_CONTROL]: rotateControlActions,
        [NODE_SYSTEM_TYPE.GRAPHICS]: graphicsActions,
        [NODE_SYSTEM_TYPE.SCENE]: sceneActions,
        [NODE_SYSTEM_TYPE.EFFECT]: defaultActions,
    };
    
    constructor(controlNode: ControlNode, cursorStyleManager: CursorStyleManager) {
        this.controlNode = controlNode;
        this.setCurrentIntersectionNode = this.setCurrentIntersectionNode.bind(this)
        this.cursorStyleManager = cursorStyleManager;
    }
    setCurrentIntersectionNode(node: Node) {
        this.currentIntersectionNode = node;
        // if (this.currentCursorType !== node.systemType) {
        //     this.actionMapper[this.currentIntersectionNode.systemType].setCursor(this.canvas, this.controlNode, this.currentIntersectionNode)
        //     this.currentCursorType = node.systemType;
        // }
    }
    onPointerDown(event: SpectrographMouseEvent) {
        this.setCurrentIntersectionNode(event.getLastIntersection());
        this.startPosition.copy(event.scenePosition)

        const instrumentOptions = {
            event,
            intersect: this.currentIntersectionNode,
            startMousePosition: this.startPosition,
            controlNode: this.controlNode,
            cursorStyleManager: this.cursorStyleManager,
            setCurrentIntersectionNode: this.setCurrentIntersectionNode,
        }
        this.actionMapper[this.currentIntersectionNode.systemType]?.onPointerDown(instrumentOptions)
    }

    onPointerMove(event: SpectrographMouseEvent) {
        const instrumentOptions = {
            event,
            intersect: this.currentIntersectionNode,
            startMousePosition: this.startPosition,
            controlNode: this.controlNode,
            cursorStyleManager: this.cursorStyleManager,
            setCurrentIntersectionNode: this.setCurrentIntersectionNode
        }
        if (event.isMouseDown) { //TODO нужна машина состояний
        // DRAG
            this.actionMapper[this.currentIntersectionNode.systemType]?.onDrag(instrumentOptions)
        } else {
        // MOVE
            this.setCurrentIntersectionNode(event.getLastIntersection());
            this.actionMapper[this.currentIntersectionNode.systemType]?.onPointerMove(instrumentOptions)
        }
            
    }

    onPointerUp(event: SpectrographMouseEvent) {
        const instrumentOptions = {
            event,
            intersect: this.currentIntersectionNode,
            startMousePosition: this.startPosition,
            controlNode: this.controlNode,
            cursorStyleManager: this.cursorStyleManager,
            setCurrentIntersectionNode: this.setCurrentIntersectionNode
        }

        if (event.scenePosition.equals(this.startPosition)) {
        // ON POINTER UP
            this.actionMapper[this.currentIntersectionNode.systemType]?.onPointerUp(instrumentOptions)  
        } else {
        //on DRAG END
            this.actionMapper[this.currentIntersectionNode.systemType]?.onDragEnd(instrumentOptions)  
        }
    }
}

