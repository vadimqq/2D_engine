import { Matrix3 } from "./Matrix3";

export class Vector2{
	x: number;
	y: number;
	constructor(x=0, y=0){
		this.x = x;
		this.y = y;
	}
	public set(x: number, y: number): this {
        this.x = x;
        this.y = y;

        return this;
    }

	public clone(): Vector2 {
        return new Vector2(this.x, this.y);
    }

	public copyFrom(vec: Vector2): this {
        this.set(vec.x, vec.y);

        return this;
    }

	public equals(vec: Vector2): boolean {
        return (vec.x === this.x) && (vec.y === this.y);
    }

    public sub(vec: Vector2) {
		this.x -= vec.x;
		this.y -= vec.y;

		return this;
	}

    public applyMatrix3(matrix: Matrix3) {
		const x = this.x, y = this.y;
		const e = matrix.elements;

		this.x = e[ 0 ] * x + e[ 3 ] * y + e[ 6 ];
		this.y = e[ 1 ] * x + e[ 4 ] * y + e[ 7 ];

		return this;
    }

    public min(vec: Vector2) {
		this.x = Math.min( this.x, vec.x );
		this.y = Math.min( this.y, vec.y );

		return this;
	}
    public max(vec: Vector2) {
		this.x = Math.max( this.x, vec.x );
		this.y = Math.max( this.y, vec.y );

		return this;
	}

	public round() {
		this.x = Math.round(this.x)
		this.y = Math.round(this.y)
		
		return this;
	}

	public divide(vec: Vector2) {
		this.x /= vec.x;
		this.y /= vec.y;

		return this;
	}
	public divideScalar(scalar: number) {
		return this.multiplyScalar(1 / scalar);
	}

	public multiply(vec: Vector2) {
		this.x *= vec.x;
		this.y *= vec.y;

		return this;
	}

	public multiplyScalar(scalar: number) {
		this.x *= scalar;
		this.y *= scalar;
		
		return this;
	}

}