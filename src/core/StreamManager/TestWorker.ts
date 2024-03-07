onmessage = (event) => {
    const { nodeList, point } = event.data
   const intersectedLayers = findIntersect(nodeList, point)
   postMessage(intersectedLayers)
}

const findIntersect = (nodeList: [], eventPoint: {x: number, y: number}, intersectedLayers?: [] = []) => {
    
    nodeList.forEach((node) => {
        const isIntersect = (eventPoint.x > node.localMatrix.elements[6] && eventPoint.x < node.size.x + node.localMatrix.elements[6]) && (eventPoint.y > node.localMatrix.elements[7] && eventPoint.y < node.size.y + node.localMatrix.elements[7])
        if (isIntersect) {
            intersectedLayers.push(node.guid)
            findIntersect(node.children, eventPoint, intersectedLayers)
        }
    });
    return intersectedLayers
}