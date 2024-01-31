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
}