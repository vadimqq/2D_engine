import { ControlNode } from "../../controlNode/controlNode";
import { Node } from "../../core/Node/Node";
import { SpectrographMouseEvent } from "../../events/MouseEvents/SpectrographMouseEvent";
import { Vector2 } from "../../math/Vector2";

export type ActionOptionsType = {
    event: SpectrographMouseEvent;
    intersect: Node;
    startMousePosition: Vector2;
    controlNode: ControlNode;
    setCurrentIntersectionNode: (node: Node) => void;
}

export type ActionsType = {
    onPointerDown: (options: ActionOptionsType) => void;
    onPointerMove: (options: ActionOptionsType) => void;
    onPointerUp: (options: ActionOptionsType) => void;
    onDrag: (options: ActionOptionsType) => void;
    onDragEnd: (options: ActionOptionsType) => void;
}