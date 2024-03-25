import { Color } from "../Color";
import { Node } from "./Node";

export type NodeEvents = {
    'added': [container: Node];
    'child_added': [child: Node, container: Node, index: number];
    'removed': [container: Node];
    'child_removed': [child: Node, container: Node, index: number];
    'destroyed': [];
	'change_visible': [node: Node];
}

export type AnyEvent = {
    [K: ({} & string) | ({} & symbol)]: any;
}

export type InitialOptionsType<G> = {
	geometry: G;
	color: Color;
	transform?: [number, number, number, number, number, number, number, number, number,];
	systemType: NODE_SYSTEM_TYPE;
	shaderType: string;
	type: string;
};

export type CreateNodeOptionsType = {
	color?: Color;
	transform?: [number, number, number, number, number, number, number, number, number,];
	systemType?: NODE_SYSTEM_TYPE;
	shaderType?: string;
}

export enum NODE_SYSTEM_TYPE {
	SCENE = 'SCENE',
	CONTROL_NODE = 'CONTROL_NODE',
	CONTROL = 'CONTROL',
	// RESIZE_CONTROL = 'RESIZE_CONTROL',
	// RESIZE_SIDE_CONTROL = 'RESIZE_SIDE_CONTROL',
	// ROTATE_CONTROL = 'ROTATE_CONTROL',
	GRAPHICS = 'GRAPHICS',
	EFFECT = 'EFFECT',
}