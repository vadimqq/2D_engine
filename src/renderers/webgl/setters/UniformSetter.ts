

export class UniformSetter {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    uniformSetters = new Map<string, ((v: Iterable<number>) => void) | ((v: number) => void)>();

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
        this.gl = gl;
        this.program = program;
        const activeUniformsCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

        for (let index = 0; index < activeUniformsCount; ++index) {
            const uniformInfo = gl.getActiveUniform(program, index);
            if (!uniformInfo) {
              break;
            }
            let name = uniformInfo.name;
           
            // remove the array suffix.
            if (name.substr(-3) === '[0]') {
              name = name.substr(0, name.length - 3);
            }
            const setter = this.createUniformSetter(program, uniformInfo);
            this.uniformSetters.set(name, setter)
          }

       
    }
    private createUniformSetter(program: WebGLProgram, uniformInfo: WebGLActiveInfo) {
        const location = this.gl.getUniformLocation(program, uniformInfo.name);
        const type = uniformInfo.type;
        const isArray = (uniformInfo.size > 1 && uniformInfo.name.substr(-3) === '[0]');
        if (type === this.gl.FLOAT && isArray) {
          return (v: Iterable<number>) => {
            this.gl.uniform1fv(location, v);
          };
        }
        if (type === this.gl.FLOAT) {
          return (v: number) => {
            this.gl.uniform1f(location, v);
          };
        }
        if (type === this.gl.FLOAT_VEC2) {
          return (v: Iterable<number>) => {
            this.gl.uniform2fv(location, v);
          };
        }
        if (type === this.gl.FLOAT_VEC3) {
          return (v: Iterable<number>) => {
            this.gl.uniform3fv(location, v);
          };
        }
        if (type === this.gl.FLOAT_VEC4) {
          return (v: Iterable<number>) => {
            this.gl.uniform4fv(location, v);
          };
        }
        if (type === this.gl.INT && isArray) {
          return (v: Iterable<number>) => {
            this.gl.uniform1iv(location, v);
          };
        }
        if (type === this.gl.INT) {
          return (v: number) => {
            this.gl.uniform1i(location, v);
          };
        }
        if (type === this.gl.INT_VEC2) {
          return (v: Iterable<number>) => {
            this.gl.uniform2iv(location, v);
          };
        }
        if (type === this.gl.INT_VEC3) {
          return (v: Iterable<number>) => {
            this.gl.uniform3iv(location, v);
          };
        }
        if (type === this.gl.INT_VEC4) {
          return (v: Iterable<number>) => {
            this.gl.uniform4iv(location, v);
          };
        }
        if (type === this.gl.BOOL) {
          return (v: Iterable<number>) => {
            this.gl.uniform1iv(location, v);
          };
        }
        if (type === this.gl.BOOL_VEC2) {
          return (v: Iterable<number>) => {
            this.gl.uniform2iv(location, v);
          };
        }
        if (type === this.gl.BOOL_VEC3) {
          return (v: Iterable<number>) => {
            this.gl.uniform3iv(location, v);
          };
        }
        if (type === this.gl.BOOL_VEC4) {
          return (v: Iterable<number>) => {
            this.gl.uniform4iv(location, v);
          };
        }
        if (type === this.gl.FLOAT_MAT2) {
          return (v: Iterable<number>) => {
            this.gl.uniformMatrix2fv(location, false, v);
          };
        }
        if (type === this.gl.FLOAT_MAT3) {
          return (v: Iterable<number>) => {
            this.gl.uniformMatrix3fv(location, false, v);
          };
        }
        if (type === this.gl.FLOAT_MAT4) {
          return (v: Iterable<number>) =>{
            this.gl.uniformMatrix4fv(location, false, v);
          };
        }
        throw ('unknown type: 0x' + type.toString(16)); //Обработка ошибок
    }

    setUniforms(object: {[key: string]: any}) {
        const objectKeys = Object.keys(object);
        objectKeys.forEach(key => {
            const setter = this.uniformSetters.get(key)
            if (setter) {
                setter(object[key]);
            }
        })
    }
} 