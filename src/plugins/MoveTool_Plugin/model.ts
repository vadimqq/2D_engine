import { ControlNode } from "../../controlNode/controlNode";
import { Node } from "../../core/Node/Node";
import { CursorStyleManager } from "../../core/ToolManager/CursorManager";
import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";
import { Vector2 } from "../../math/Vector2";

export type ActionOptionsType = {
    event: SpectrographMouseEvent;
    intersect: Node;
    startMousePosition: Vector2;
    controlNode: ControlNode;
    setCurrentIntersectionNode: (node: Node) => void;
    cursorStyleManager: CursorStyleManager;
}

export type ActionsType = {
    onPointerDown: (options: ActionOptionsType) => void;
    onPointerMove: (options: ActionOptionsType) => void;
    onPointerUp: (options: ActionOptionsType) => void;
    onDrag: (options: ActionOptionsType) => void;
    onDragEnd: (options: ActionOptionsType) => void;
}

export enum CURSOR_TYPE {
    DEFAULT = 'DEFAULT',
    RESIZE = 'RESIZE',
    RESIZE_SIDE = 'RESIZE_SIDE',
    ROTATE = 'ROTATE',
}