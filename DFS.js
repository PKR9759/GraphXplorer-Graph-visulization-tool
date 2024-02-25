let str = ""
let vis = []
async function dfs(graph, startNode) {
    vis.push(startNode);
    // arr.push(startNode + "->");
    str += `${startNode}->`;
    console.log(str);

    for (const adjNode of graph[startNode]) {
        if (!vis.includes(adjNode)) {
            showAnimation(startNode, adjNode);
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.log("dfs has called for start node " + )
            dfs(graph, adjNode);
        }
    }
}

function triggerDfs(event) {
    const svgRect = graphSvg.getBoundingClientRect();
    const xPos = event.clientX - svgRect.left;
    const yPos = event.clientY - svgRect.top;

    // Find the vertex closest to the click position
    let closestVertex = vertices.reduce((closest, vertex) => {
        const distance = Math.sqrt(Math.pow(xPos - vertex.x, 2) + Math.pow(yPos - vertex.y, 2));
        if (distance < closest.distance) {
            return { vertex, distance };
        }
        return closest;
    }, { vertex: null, distance: Infinity }).vertex;


    // bfs(graph, closestVertex.id);
    // const visited = [];
    dfs(graph, closestVertex.id);
}