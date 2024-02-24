function formatSVG() {
    for (edge of edges) {
        let id = edge.id;
        let e = document.getElementById(`edge-${id}`);
        let polygon = document.querySelector(`#arrow-${id} polygon`);
        if (e) {
            e.setAttribute('stroke', 'black');
            if (polygon)
                polygon.setAttribute('fill', 'black');
        }

    }

    for (vertex of vertices) {
        let id = vertex.id;
        let node = document.getElementById(`circle-${id}`);
        if (node) {
            node.setAttribute('fill', '#3B3B98');
        }
    }
}

function showBetterAnimation(currentNode, adjNode) {
    let edgeId;
    let currEdge = null;
    for (let edge of edges) {
        if ((edge.start.id == currentNode && edge.end.id == adjNode) || (edge.start.id == adjNode && edge.end.id == currentNode)) {
            edgeId = edge.id;
            currEdge = edge;
        }
    }

    const edgeElement = document.getElementById(`edge-${edgeId}`);
    const arrow = document.querySelector(`#arrow-${edgeId} polygon`);
    if (edgeElement) {

        const totalLength = edgeElement.getTotalLength();

        const overlayLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');


        overlayLine.setAttribute('stroke', 'green');
        overlayLine.setAttribute('stroke-width', '5');

        let flag = false;
        if (currEdge.start.id != currentNode) {
            flag = true;
            [currEdge.start, currEdge.end] = [currEdge.end, currEdge.start]
        }
        overlayLine.setAttribute('x1', currEdge.start.x);
        overlayLine.setAttribute('y1', currEdge.start.y);
        overlayLine.setAttribute('x2', currEdge.start.x); // Initialize x2 to match the original line's starting point
        overlayLine.setAttribute('y2', currEdge.start.y); // Initialize y2 to match the original line's starting point
        // Append the edge overlayLine before vertices to ensure it appears below them
        graphSvg.insertBefore(overlayLine, graphSvg.firstChild);

        // Animate the overlay line
        let currentLength = 0;
        const animationDuration = 4500; // Animation duration in milliseconds
        const animationSteps = 100; // Number of steps
        const stepLength = totalLength / animationSteps; // Length of each step
        const stepDuration = animationDuration / animationSteps; // Duration for each step

        function animateOverlayLine() {
            currentLength += stepLength;
            let point = edgeElement.getPointAtLength(currentLength);
            if (flag) {
                point = edgeElement.getPointAtLength(totalLength - currentLength);

            }
            overlayLine.setAttribute('x2', point.x);
            overlayLine.setAttribute('y2', point.y);



            // Set the stroke color based on the current length
            const percent = currentLength / totalLength;
            const red = 255 * percent;
            const green = 255 - (255 * percent);
            overlayLine.setAttribute('stroke', `rgb(${red}, ${green}, 0)`);

            if (currentLength < totalLength) {
                setTimeout(animateOverlayLine, stepDuration);
            } else {
                edgeElement.setAttribute('stroke', 'green');
                if (arrow)
                    arrow.setAttribute('fill', 'green');
                // edgeElement.setAttribute('stroke-width', '5');
                graphSvg.removeChild(overlayLine);
                let adjNodeElement = document.getElementById(`circle-${adjNode}`)
                adjNodeElement.setAttribute('fill', 'green');
            }
        }

        // Trigger the animation
        animateOverlayLine();
    }

}


async function bfs(graph, startNode) {

    formatSVG();

    let node = document.getElementById(`circle-${startNode}`);
    node.setAttribute('fill', '#006266');
    console.log(graph);
    // Use a queue to store nodes to be explored
    const queue = [startNode];
    // Keep track of visited nodes to avoid revisiting
    const visited = [];

    visited.push(startNode);
    while (queue.length > 0) {
        // Remove the first node from the queue
        const currentNode = queue.shift();
        console.log(currentNode);

        for (const adjNode of graph[currentNode]) {
            if (!visited.includes(adjNode)) {

                // showAnimation(currentNode, adjNode);
                showBetterAnimation(currentNode, adjNode);
                await new Promise(resolve => setTimeout(resolve, 5000));
                // Mark the edge as visited


                console.log(currentNode + "->" + adjNode + "->");
                queue.push(adjNode);
                visited.push(adjNode);
            }
        }


    }
}


function triggerBfs(event) {

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


    bfs(graph, closestVertex.id);

}