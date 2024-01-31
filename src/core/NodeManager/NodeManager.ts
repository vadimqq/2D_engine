import { ClassType } from "../../utils/models"
import { BufferGeometry } from "../BufferGeometry/BufferGeometry"
import { Node } from "../Node/Node"

export class NodeManager {
    nodeMap: Map<string, ClassType<Node<BufferGeometry>>> = new Map()

    registerNewNode(name: string, NodeClass: any) {
        this.nodeMap.set(name, NodeClass)
    }
    getNodeClassByName(name: string) {
        return this.nodeMap.get(name)
    }
}