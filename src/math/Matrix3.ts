import { Vector2 } from "./Vector2";

export class Matrix3 {
	elements = [
		1, 0, 0,
		0, 1, 0,
		0, 0, 1
	]
	constructor() {}
		set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number) {
			this.elements[0] = n11; this.elements[1] = n12; this.elements[2] = n13;
			this.elements[3] = n21; this.elements[4] = n22; this.elements[5] = n23;
			this.elements[6] = n31; this.elements[7] = n32; this.elements[8] = n33;
		}
		translate (x: number, y: number) {
			_m3.set(
				1, 0, 0,
				0, 1, 0,
				x, y, 1,
			)
		  return this.multiply(_m3)
		}
		rotate (angleInRadians: number) {
		  var c = Math.cos(angleInRadians);
		  var s = Math.sin(angleInRadians);
		
		  _m3.set(
				c,-s, 0,
				s, c, 0,
				0, 0, 1,
			)
		  return this.multiply(_m3)
		}
		scale (x: number, y: number) {
			_m3.set(
				x, 0, 0,
				0, y, 0,
				0, 0, 1,
			)
		  return this.multiply(_m3)
		}
		multiply (matrix: Matrix3) {
		  var a00 = this.elements[0 * 3 + 0];
		  var a01 = this.elements[0 * 3 + 1];
		  var a02 = this.elements[0 * 3 + 2];
		  var a10 = this.elements[1 * 3 + 0];
		  var a11 = this.elements[1 * 3 + 1];
		  var a12 = this.elements[1 * 3 + 2];
		  var a20 = this.elements[2 * 3 + 0];
		  var a21 = this.elements[2 * 3 + 1];
		  var a22 = this.elements[2 * 3 + 2];
		  var b00 = matrix.elements[0 * 3 + 0];
		  var b01 = matrix.elements[0 * 3 + 1];
		  var b02 = matrix.elements[0 * 3 + 2];
		  var b10 = matrix.elements[1 * 3 + 0];
		  var b11 = matrix.elements[1 * 3 + 1];
		  var b12 = matrix.elements[1 * 3 + 2];
		  var b20 = matrix.elements[2 * 3 + 0];
		  var b21 = matrix.elements[2 * 3 + 1];
		  var b22 = matrix.elements[2 * 3 + 2];
		  this.set(
			b00 * a00 + b01 * a10 + b02 * a20,
			b00 * a01 + b01 * a11 + b02 * a21,
			b00 * a02 + b01 * a12 + b02 * a22,
			b10 * a00 + b11 * a10 + b12 * a20,
			b10 * a01 + b11 * a11 + b12 * a21,
			b10 * a02 + b11 * a12 + b12 * a22,
			b20 * a00 + b21 * a10 + b22 * a20,
			b20 * a01 + b21 * a11 + b22 * a21,
			b20 * a02 + b21 * a12 + b22 * a22,
		  );
		  return this
		}
		identity() {
			this.set(
				1, 0, 0,
				0, 1, 0,
				0, 0, 1,
			)
			return this
		}
		copy(m: Matrix3) {
			this.set(
				m.elements[0], m.elements[1], m.elements[2],
				m.elements[3], m.elements[4], m.elements[5],
				m.elements[6], m.elements[7], m.elements[8],
			)
			return this
		}
		clone(): Matrix3 {
			return new Matrix3().copy(this);
		}
		toArray() {
			return this.elements
		}
		setPosition(vec: Vector2) {
			this.set(
				1, 0, 0,
				0, 1, 0,
				vec.x, vec.y, 1,
			)
			return this
		}
}
const _m3 = new Matrix3()