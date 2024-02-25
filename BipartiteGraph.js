const bipartiteBtn = document.getElementById("bipartiteBtn");


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
                
                showAnimation(currentNode, adjNode);
                
                
                await new Promise(resolve => setTimeout(resolve, 4580));
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
        onComplete: function() {
            setTimeout(() => {
                styledMessage.style.display = 'none';
                typed.destroy();
            }, 1200);
            // Remove the typed instance after completion
            
            
            
        }
    });
}