import { Node } from "./Node";

export enum EVENTS_NAME {
    CHILD_ADDED = 'CHILD_ADDED',
    ADDED = 'ADDED',
    REMOVED = 'REMOVED',
    CHILD_REMOVED = 'CHILD_REMOVED',
    DESTROYED = 'DESTROYED'
}

export interface NodeEvents
{
    [EVENTS_NAME.ADDED]: [container: Node];
    [EVENTS_NAME.CHILD_ADDED]: [child: Node, container: Node, index: number];
    [EVENTS_NAME.REMOVED]: [container: Node];
    [EVENTS_NAME.CHILD_REMOVED]: [child: Node, container: Node, index: number];
    [EVENTS_NAME.DESTROYED]: [];
}

