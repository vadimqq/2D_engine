import { Node } from "./Node";



export type NodeEvents =
{
    'added': [container: Node];
    'child_added': [child: Node, container: Node, index: number];
    'removed': [container: Node];
    'child_removed': [child: Node, container: Node, index: number];
    'destroyed': [];
}

