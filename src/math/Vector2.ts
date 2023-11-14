export class Vector2{
	x: number;
	y: number;
	constructor(x=0, y=0){
		this.x = x;
		this.y = y;
	}
	setX(x: number) {
		this.x = x;
	}
	setY(y: number) {
		this.y = y;
	}
	set(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
}