
export const WebGLShader = ( gl: WebGL2RenderingContext, type: number, shaderString: string ) => {
	const shader = gl.createShader(type) as WebGLShader;
    
	gl.shaderSource(shader, shaderString);
	gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        console.error("Shader error: \n:" + gl.getShaderInfoLog(shader));
    }
	return shader;
}

