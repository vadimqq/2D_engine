import EventEmitter from 'eventemitter3';
import { Camera } from '../../camera/Camera';
import { Matrix3 } from '../../math/Matrix3';
import { Vector2 } from '../../math/Vector2';
import { BufferGeometry } from '../BufferGeometry/BufferGeometry';
import { Color } from '../Color';
import { NodeEvents } from './model';

type AnyEvent = {
    [K: ({} & string) | ({} & symbol)]: any;
}

export type InitialOptionsType<G> = {
	geometry: G;
	color: Color;
	transform?: [number, number, number, number, number, number, number, number, number,];
	systemType: NODE_SYSTEM_TYPE;
	shaderType: string;
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
	RESIZE_CONTROL = 'RESIZE_CONTROL',
	GRAPHICS = 'GRAPHICS',
	EFFECT = 'EFFECT',
}

export class Node<G extends BufferGeometry = BufferGeometry>  extends EventEmitter<NodeEvents & AnyEvent>{
	guid: number;
	systemType: NODE_SYSTEM_TYPE;
	shaderType: string;
	localMatrix = new Matrix3();
	worldMatrix = new Matrix3();
	needUpdateMatrix = true;
	size = new Vector2(1, 1)
	
	parent: Node<BufferGeometry> | null = null;
	children: Node<BufferGeometry>[] = [];

	geometry: G;
	color: Color;

	isIntractable = true;
	isVisible = true;

	constructor(options: InitialOptionsType<G>) {
		super();
		this.shaderType = options.shaderType
		this.systemType = options.systemType 
		this.guid = Math.floor(Math.random() * 10000000)
		this.geometry = options.geometry;
		this.color = options.color;
		if (options.transform) {
			this.localMatrix.set(...options.transform)
		}
	}

	add_child(object: Node<BufferGeometry>) {
		if (object.parent !== null) {
			object.parent.remove_child(object);
		}
		object.parent = this;
		this.children.push(object);
		this.emit('child_added', object, this, this.children.length - 1);
        object.emit('added', this);
	}

	remove_child(object: Node<BufferGeometry>) {
		const index = this.children.indexOf( object );
		if (index > -1) {
			this.children.splice( index, 1 );
			object.parent = null;
			this.emit('child_removed', object, this, index);
			object.emit('removed', this);
		}
	}

	computeWorldMatrix() {
		if (this.needUpdateMatrix) {
			this.worldMatrix.identity()
			if (this.parent) {
				this.worldMatrix.multiply(this.parent.worldMatrix)
			}
			this.worldMatrix.multiply(this.localMatrix)
			this.needUpdateMatrix = false
			this.children.forEach((child) => {child.needUpdateMatrix = true})
		}
		return this.worldMatrix
	}

	getWorldPosition() {
		return new Vector2(this.worldMatrix.elements[2], this.worldMatrix.elements[5])
	}
	getChildrenByGuid(guid: number) {
		return this.children.find((node) => node.guid === guid)
	}

	setSize(x: number, y: number) {
		this.size.set(x, y)
	}
	beforeRender(camera: Camera) {}
}
