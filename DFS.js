// let str = ""
// let vis = {}
let count = 1;

function writeDfnNumber(node)
{
    let xPos = 0;
    let yPos = 0;
    for(const vertex of vertices)
    {
        if(vertex.id == node)
        {
            xPos = vertex.x;
            yPos = vertex.y;
            break;
        }
    }

    yPos -= 30;

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', xPos);
    text.setAttribute('y', yPos);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', 'black');
    text.setAttribute('font-size', '16');
    text.setAttribute('id',`dfn-${count}`);
    text.textContent = count;
    count++;

    graphSvg.appendChild(text);
}
async function dfs(graph, startNode, visited) {
    // Mark the current node as visited
    visited[startNode] = true;
    writeDfnNumber(startNode);
    // Log or process the current node as needed
    console.log("Visited node: " + startNode);

    // Get the neighbors of the current node
    let neighbors = graph[startNode];

    // Traverse through all the neighbors
    for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        // If neighbor is not visited, recursively call DFS on it
        if (!visited[neighbor]) {
            showAnimation(startNode,neighbor);
            await new Promise(resolve => setTimeout(resolve,5000));
            await dfs(graph, neighbor, visited);
        }
    }
}


function triggerDfs(event) {
    formatSVG();
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
    const visited = {};
    markAsStartedNode(closestVertex.id);
    dfs(graph, closestVertex.id,visited);
}