
export class Material{
	VS: string
	FS: string;
	constructor(
		uniforms: {[key: string]: any},
		vs: string,
		fs: string
	){
		this.VS = vs
		this.FS = fs
	}
}