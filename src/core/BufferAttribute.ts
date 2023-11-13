import { STATIC_DRAW_USAGE } from "../constants";

export class BufferAttribute {
    array: number[] | Float32Array;
    itemSize: number;
    normalized: boolean;
    usage: number;
	constructor( array: number[] | Float32Array, itemSize: number, normalized = false ) {
		if ( Array.isArray( array ) ) {
			throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );
		}

		this.array = array;
		this.itemSize = itemSize;
		// this.count = array !== undefined ? array.length / itemSize : 0;
		this.normalized = normalized;

		this.usage = STATIC_DRAW_USAGE;
		// this.updateRange = { offset: 0, count: - 1 };
		// this.gpuType = FloatType;

		// this.version = 0;

	}
}

export class Float32BufferAttribute extends BufferAttribute {
	constructor( array: number[], itemSize: number, normalized?: boolean) {
		super( new Float32Array( array ), itemSize, normalized );
	}
}