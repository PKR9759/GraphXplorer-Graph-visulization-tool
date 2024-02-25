const bipartiteBtn = document.getElementById("bipartiteBtn");
// let stepDuration2;

bipartiteBtn.onclick = async function () {
    const isBipartite = await checkBipartite(1);//beacuse start node is 1
    if (isBipartite) {
        console.log("The graph is bipartite!");
        displayTypedMessage("The graph is bipartite!");
    } else {
        console.log("The graph is not bipartite!");
        displayTypedMessage("The graph is not bipartite!");
    }
};


// Initialize colors for all vertices
let vertexColors = {};
for (let vertex of vertices) {
    vertexColors[vertex.id] = null;
}


async function checkBipartite(startNode) {
    formatSVG();

    const queue = [startNode];
    const visited = {};
    const vertexColors = {};

    // Initialize colors for all vertices
    for (let vertex of vertices) {
        visited[vertex.id] = false;
        vertexColors[vertex.id] = null;
    }

    visited[startNode] = true;
    vertexColors[startNode] = 'red';
    changeVertexColor(startNode, 'red');

    while (queue.length > 0) {
        const currentNode = queue.shift();

        // Change the color of the visited vertex
        // changeVertexColor(currentNode, 'green');

        for (const adjNode of graph[currentNode]) {
            if (!vertexColors[adjNode]) {
                visited[currentNode] = true;

                // Trigger animation for visiting an edge

                showEdgeAnimation(currentNode, adjNode);
                await new Promise(resolve => {
                    setTimeout(resolve, 4580);
                });
                // Change the color of the adjacent vertex
                changeVertexColor(adjNode, vertexColors[currentNode] === 'red' ? 'blue' : 'red');

                queue.push(adjNode);
                // Assign a different color to adjacent nodes
                vertexColors[adjNode] = vertexColors[currentNode] === 'red' ? 'blue' : 'red';

                // Sleep to simulate asynchronous behavior
                // Adjust the delay as needed


            } else if (vertexColors[adjNode] === vertexColors[currentNode]) {
                // If adjacent nodes have the same color, the graph is not bipartite

                return false;
            }
        }
    }


    return true;
}


function changeVertexColor(vertexId, color) {
    const vertexElement = document.getElementById(`circle-${vertexId}`);
    if (vertexElement) {
        vertexElement.setAttribute('fill', color);
    }
}



function displayTypedMessage(message) {

    const styledMessage = document.getElementById('typed-message');
    styledMessage.style.display = 'block';

    // Create a new Typed instance
    const typed = new Typed('#typed-message', {
        strings: [message],
        typeSpeed: 50,
        backSpeed: 25,
        showCursor: true,
        cursorChar: '|',
        onComplete: function () {
            setTimeout(() => {
                styledMessage.style.display = 'none';
                typed.destroy();
            }, 1500);
            // Remove the typed instance after completion



        }
    });
}



function showEdgeAnimation(currentNode, adjNode) {
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

        return new Promise(resolve => {
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
                    stepDuration2= stepDuration;
                } else {
                    edgeElement.setAttribute('stroke', 'green');
                    if (arrow)
                        arrow.setAttribute('fill', 'green');
                    // edgeElement.setAttribute('stroke-width', '5');
                    graphSvg.removeChild(overlayLine);
                    let adjNodeElement = document.getElementById(`circle-${adjNode}`)
                    adjNodeElement.setAttribute('fill', 'green');
                    resolve(); // Resolve the promise when the animation is complete
                }
            
            }
            // Start the animation
            animateOverlayLine();
        });
    }
}




