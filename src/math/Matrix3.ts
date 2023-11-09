import { Vector2 } from "./Vector2";

export class Matrix3{
	matrix = [
		1, 0, 0,
		0, 1, 0,
		0, 0, 1 
	];
	M00 = 0;
	M01 = 1;
	M02 = 2;
	M10 = 3;
	M11 = 4;
	M12 = 5;
	M20 = 6;
	M21 = 7;
	M22 = 8;
	constructor(){}
	multiply(m: Matrix3){
		var output = new Matrix3();
		output.matrix = [
			this.matrix[this.M00] * m.matrix[this.M00] + this.matrix[this.M10] * m.matrix[this.M01] + this.matrix[this.M20] * m.matrix[this.M02],
			this.matrix[this.M01] * m.matrix[this.M00] + this.matrix[this.M11] * m.matrix[this.M01] + this.matrix[this.M21] * m.matrix[this.M02],
			this.matrix[this.M02] * m.matrix[this.M00] + this.matrix[this.M12] * m.matrix[this.M01] + this.matrix[this.M22] * m.matrix[this.M02],
			
			this.matrix[this.M00] * m.matrix[this.M10] + this.matrix[this.M10] * m.matrix[this.M11] + this.matrix[this.M20] * m.matrix[this.M12],
			this.matrix[this.M01] * m.matrix[this.M10] + this.matrix[this.M11] * m.matrix[this.M11] + this.matrix[this.M21] * m.matrix[this.M12],
			this.matrix[this.M02] * m.matrix[this.M10] + this.matrix[this.M12] * m.matrix[this.M11] + this.matrix[this.M22] * m.matrix[this.M12],
			
			this.matrix[this.M00] * m.matrix[this.M20] + this.matrix[this.M10] * m.matrix[this.M21] + this.matrix[this.M20] * m.matrix[this.M22],
			this.matrix[this.M01] * m.matrix[this.M20] + this.matrix[this.M11] * m.matrix[this.M21] + this.matrix[this.M21] * m.matrix[this.M22],
			this.matrix[this.M02] * m.matrix[this.M20] + this.matrix[this.M12] * m.matrix[this.M21] + this.matrix[this.M22] * m.matrix[this.M22]
		];
		return output;
	}
	transition(v: Vector2){
		var output = new Matrix3();
		output.matrix = [
			this.matrix[this.M00],
			this.matrix[this.M01],
			this.matrix[this.M02],
			
			this.matrix[this.M10],
			this.matrix[this.M11],
			this.matrix[this.M12],
			
			v.x * this.matrix[this.M00] + v.y * this.matrix[this.M10] + this.matrix[this.M20],
			v.x * this.matrix[this.M01] + v.y * this.matrix[this.M11] + this.matrix[this.M21],
			v.x * this.matrix[this.M02] + v.y * this.matrix[this.M12] + this.matrix[this.M22]
		];
		return output;
	}
	scale(v: Vector2){
		var output = new Matrix3();
		output.matrix = [
			this.matrix[this.M00] * v.x,
			this.matrix[this.M01] * v.x,
			this.matrix[this.M02] * v.x,
			
			this.matrix[this.M10] * v.y,
			this.matrix[this.M11] * v.y,
			this.matrix[this.M12] * v.y,
			
			this.matrix[this.M20],
			this.matrix[this.M21],
			this.matrix[this.M22]
		];
		return output;
	}
	getFloatArray(){
		return new Float32Array(this.matrix);
	}
}
