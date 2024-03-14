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
    iterableLeftTop = new Vector2();
    iterableRightBottom = new Vector2();

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
        this.iterableLeftTop.set(0, 0).applyMatrix3(node.worldMatrix)
        this.iterableRightBottom.set(node.size.x, node.size.y).applyMatrix3(node.worldMatrix)

        return !(this.leftTop.y > this.iterableRightBottom.y || this.rightBottom.y < this.iterableLeftTop.y || this.rightBottom.x < this.iterableLeftTop.x || this.leftTop.x > this.iterableRightBottom.x)
    }
}

