let isCycle = false;

function isCyclicUtil(node, visited, parent, path) {
    visited[node] = true;
    path.push(node);

    for (let i = 0; i < graph[node].length; ++i) {
        let adjNode = graph[node][i];

        if (!visited[adjNode]) {
            if (isCyclicUtil(adjNode, visited, node, path)) {
                return true;
            }
        } else if (adjNode != parent) {
            path.push(adjNode);
            return true;
        }
    }

    path.pop();
    return false;
}

function isCyclic(graph, startNode) {
    const visited = {};
    const path = [];

    for (let i = 1; i <= Object.keys(graph).length; i++) {
        visited[i] = false;
    }

    for (let i = 1; i <= Object.keys(graph).length; i++) {
        if (!visited[i]) {
            if (isCyclicUtil(i, visited, -1, path)) {
                return path;
            }
        }
    }

    return null;
}

function triggerCycleDetection() {
    formatSVG();


    const cyclePath = isCyclic(graph, 1);
    let n = vertices.length;
    if (cyclePath) {
        while (cyclePath[0] != cyclePath[cyclePath.length-1]) {
            // let index = array.indexOf(elementToRemove);

            // If the element is found, remove it using splice
           cyclePath.shift();
            n--;
        }
        console.log("Graph contains cycle");
        console.log(cyclePath);
        // Add code here to visually represent the cycle using cyclePath
        highlightCycle(cyclePath); // Add this line to highlight the cycle

    } else {
        console.log("Graph doesn't contain cycle");
    }
}

function highlightCycle(cyclePath) {
    let delay = 0;
    for (let i = 0; i < cyclePath.length; i++) {
        setTimeout(() => highlightNode(cyclePath[i]), delay);
        if (i < cyclePath.length - 1) {
            setTimeout(() => highlightEdge(cyclePath[i], cyclePath[i + 1]), delay);
        }
        delay += 500; // Increase delay for each node and edge
    }
    setTimeout(() => highlightEdge(cyclePath[cyclePath.length - 1], cyclePath[0]), delay);
}


function highlightEdge(node1, node2) {
    // Find the edge object
    const edge = edges.find(e => (e.start.id === node1 && e.end.id === node2) || (e.start.id === node2 && e.end.id === node1));

    if (edge) {
        // Change the stroke color of the path element
        edge.pathElement.setAttribute('stroke', 'red');
    } else {
        console.log(`No edge found between node ${node1} and node ${node2}`);
    }
}

function highlightNode(node) {
    const nodeElement = document.getElementById(`circle-${node}`);
    if (nodeElement) {
        nodeElement.setAttribute('fill', 'red');
    } else {
        console.log(`No node found with id ${node}`);
    }
}


