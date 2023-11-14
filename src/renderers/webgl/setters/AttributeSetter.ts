

export class AttributeSetter {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    attributeSetters = new Map<string, ((v: Iterable<number>) => void) | ((v: number) => void)>();

    constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
        this.gl = gl;
        this.program = program;
        const activeAttributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

        for (let index = 0; index < activeAttributeCount; ++index) {
            const attributeInfo = gl.getActiveAttrib(program, index);
            if (!attributeInfo) {
              break;
            }
            const location = gl.getAttribLocation(program, attributeInfo.name);
            const setter = this.createAttribSetter(location);
            this.attributeSetters.set(attributeInfo.name, setter)
          }

       
    }
    private createAttribSetter(location: number) {
        return (bufferObj) => {
            if (bufferObj.value) {
              this.gl.disableVertexAttribArray(location);
              switch (bufferObj.value.length) {
                case 4:
                  this.gl.vertexAttrib4fv(location, bufferObj.value);
                  break;
                case 3:
                  this.gl.vertexAttrib3fv(location, bufferObj.value);
                  break;
                case 2:
                  this.gl.vertexAttrib2fv(location, bufferObj.value);
                  break;
                case 1:
                  this.gl.vertexAttrib1fv(location, bufferObj.value);
                  break;
                default:
                  throw new Error('the length of a float constant value must be between 1 and 4!');
              }
            } else {
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, bufferObj.buffer);
                this.gl.enableVertexAttribArray(location);
                this.gl.vertexAttribPointer(
                    location, bufferObj.numComponents || bufferObj.size, bufferObj.type || this.gl.FLOAT, bufferObj.normalize || false, bufferObj.stride || 0, bufferObj.offset || 0);
            }
          };
    }

    setAttributes(object: {[key: string]: any}) {
        const objectKeys = Object.keys(object);
        objectKeys.forEach(key => {
            const setter = this.attributeSetters.get(key)
            if (setter) {
                setter(object[key]);
            }
        })
    }
    
    setBuffersAndAttributes(bufferInfo: {
        attribs: {};
        indices: WebGLBuffer | null;
        numElements: number;
    }) {
        this.setAttributes(bufferInfo.attribs);
        if (bufferInfo.indices) {
          this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, bufferInfo.indices);
        }
    }
} 