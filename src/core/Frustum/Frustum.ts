import { Camera } from "../../camera/Camera";
import { ControlNode } from "../../controlNode/controlNode";
import { Matrix3 } from "../../math/Matrix3";
import { Vector2 } from "../../math/Vector2";
import { Scene } from "../../scene/Scene";
import { BufferGeometry } from "../BufferGeometry/BufferGeometry";
import { Node } from "../Node/Node";

export class Frustum {
    nodesInViewport: Node<BufferGeometry>[] = [];
    projectionMatrix: Matrix3
    leftTop = new Vector2();
    rightBottom = new Vector2();

    calculateMinMaxService = new CalculateMinMaxService;

    constructor(projectionMatrix: Matrix3) {
        this.projectionMatrix = projectionMatrix
    }

    updateRenderList(scene: Scene, controlNode: ControlNode, camera: Camera) {
        if (camera.needUpdateFrustum) {
            this.nodesInViewport.splice(0, this.nodesInViewport.length); // очистка массива пересечений

            this.nodesInViewport.push(scene)
            this.leftTop.set(0, 0).applyMatrix3(camera.inverseMatrix)
            this.rightBottom.set(camera.width, camera.height).applyMatrix3(camera.inverseMatrix)
            this.findIntersect(scene.children) // возможно стоит возвращать значение из метода поиска?
            this.findIntersect([controlNode])
            camera.needUpdateFrustum = false
        }
    }
    findIntersect(nodeList: Node<BufferGeometry>[]) {
        nodeList.forEach((node) => {
            if (node.isVisible) {
                const isIntersect = this.intersects(node)
                if (isIntersect) {
                    this.nodesInViewport.push(node)
                    this.findIntersect(node.children)
                }
            }
        });
    }

    intersects(node: Node<BufferGeometry>) {
        const { maxX, maxY, minX, minY } = this.calculateMinMaxService.calculateSizeMultiLayer(node);

        return !(this.leftTop.y > maxY || this.rightBottom.y < minY || this.rightBottom.x < minX || this.leftTop.x > maxX)
    }
}

class CalculateMinMaxService {
	leftTop = new Vector2();
	rightTop = new Vector2();
	rightBottom = new Vector2();
	leftBottom = new Vector2();

    min = new Vector2();
    max = new Vector2();

	calculateSizeMultiLayer(node: Node<BufferGeometry>) {
		this.leftTop
		    .set(0, 0)
			.applyMatrix3(node.worldMatrix);
		this.rightTop
			.set(node.size.x, 0)
			.applyMatrix3(node.worldMatrix);
		this.rightBottom
			.set(node.size.x, node.size.y)
			.applyMatrix3(node.worldMatrix);
		this.leftBottom
			.set(0, node.size.y)
			.applyMatrix3(node.worldMatrix);
	
		const min = this.min
			.copy(this.leftTop)
			.min(this.rightTop)
			.min(this.rightBottom)
			.min(this.leftBottom);
	
		const max = this.max
			.copy(this.leftTop)
			.max(this.rightTop)
			.max(this.rightBottom)
			.max(this.leftBottom);
	
		return {
            maxX: max.x,
            maxY: max.y,
            minX: min.x,
            minY: min.y,
        };
	  }
}

