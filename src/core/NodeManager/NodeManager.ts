import { WebGLRenderer } from "../../rendering/WebGLRenderer"
import { ClassType } from "../../utils/models"
import { Node } from "../Node/Node"
import { CreateNodeOptionsType } from "../Node/model"

export class NodeManager {
    renderer: WebGLRenderer
    nodeMap: Map<string, ClassType<Node>> = new Map()

    constructor(renderer: WebGLRenderer) {
        this.renderer = renderer
    }
    registerNewNode(name: string, NodeClass: any) {
        this.nodeMap.set(name, NodeClass)
    }
    getNodeClassByName(name: string) {
        return this.nodeMap.get(name)
    }
    
    createNode(name: string, options: CreateNodeOptionsType) {
        const nodeClass = this.getNodeClassByName(name)
        return new nodeClass(options)
    }
}