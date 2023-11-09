import { WebGLRenderer } from "./renderers/WebGLRenderer";

const renderer = new WebGLRenderer()
loop()

function loop(timeStamp = 0){
	renderer.update(timeStamp);
	requestAnimationFrame(loop);
}
