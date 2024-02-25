// Get the necessary elements
const vertexBtn = document.getElementById('vertexBtn');
const edgeBtn = document.getElementById('edgeBtn');
const bfsBtn = document.getElementById('bfsBtn');
const graphSvg = document.getElementById('graphSvg');
const dfsBtn = document.getElementById('dfsBtn');


// Array to store vertices with their coordinates
let vertices = [];
let isBFS = false;
let edges = [];
let isAddingVertex = false;
let isAddingEdge = false;
let isPerformingBFS = false;
let selectedVertex = null;
let graph = {};
let dwg = false;
let dug = false;
let uwg = false;
let uug = true;
const locationOfVerticies = {}

// Function to handle click event for adding a vertex
function addVertex(event) {
    if (!isAddingVertex) return;

    const svgRect = graphSvg.getBoundingClientRect();
    console.log(svgRect);
    const xPos = event.clientX - svgRect.left;
    const yPos = event.clientY - svgRect.top;

    // Create vertex object
    const vertex = {
        x: xPos,
        y: yPos,
        id: vertices.length + 1 // Incrementing vertex ID
    };
    locationOfVerticies[vertices.length + 1] = []
    locationOfVerticies[vertices.length + 1].push(xPos)
    locationOfVerticies[vertices.length + 1].push(yPos)

    graph[vertices.length + 1] = [];



    // Push vertex object into the vertices array
    vertices.push(vertex);

    // Create text element for vertex label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', xPos);
    text.setAttribute('y', yPos);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute('fill', 'white');
    text.setAttribute('font-size', '16');
    text.textContent = vertices.length;

    // Create circle element for vertex
    const vertexCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    vertexCircle.setAttribute('cx', xPos);
    vertexCircle.setAttribute('cy', yPos);
    vertexCircle.setAttribute('r', '20');
    vertexCircle.setAttribute('fill', '#3B3B98');
    vertexCircle.setAttribute('stroke', '#3B3B98');
    // vertexCircle.setAttribute('stroke-width', '2');
    vertexCircle.setAttribute('id', `circle-${vertex.id}`);

    // Append elements to SVG
    graphSvg.appendChild(vertexCircle);
    graphSvg.appendChild(text);
}



function addWeight(midX, midY) {
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", `${midX - 10}`);
    rect.setAttribute("y", `${midY - 10}`);
    rect.setAttribute("width", 20);
    rect.setAttribute("height", 20);
    rect.setAttribute("fill", "lightblue");

    // Create text element
    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", midX); // Adjusted to center the text horizontally
    text.setAttribute("y", midY); // Adjusted to center the text vertically
    text.setAttribute("text-anchor", "middle");
    text.setAttribute('dominant-baseline', 'central');
    text.setAttribute("fill", "black");
    text.setAttribute('id',`text-${edges.length}`);
    text.textContent = 1;
    graphSvg.appendChild(rect);
    graphSvg.appendChild(text);
    // let's show pop up for the edge weith
    document.getElementById("edgeWeightModal").style.display = "block";
    let edgeWeight = 1;
    document.getElementById("edgeWeightSubmit").addEventListener("click", function () {
        edgeWeight = document.getElementById("edgeWeightInput").value;
        if (edgeWeight) {
            console.log("Edge weight entered:", edgeWeight);
            // Add your code here to handle the edge weight
            // For example, you can close the modal after processing the weight
            document.getElementById("edgeWeightModal").style.display = "none";
            // text.textContent = edgeWeight;
            let textElement = document.getElementById(`text-${edges.length}`);
            textElement.textContent = `${edgeWeight}`;
        }
    });
    // text.textContent = edgeWeight;

    // Append rectangle and text elements to SVG
   
}
// Function to handle click event for adding an edge
function addEdge(event) {
    if (!isAddingEdge) return;

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

    // If a vertex is found and it's not the same as the selected vertex, create an edge
    if (closestVertex) {
        if (!selectedVertex) {
            selectedVertex = closestVertex;
        } else if (selectedVertex !== closestVertex) {

            const edge = {
                start: selectedVertex,
                end: closestVertex,
                id: edges.length + 1
            };

            graph[selectedVertex.id].push(closestVertex.id);
            graph[closestVertex.id].push(selectedVertex.id);

            edges.push(edge);
            console.log(edges);
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${selectedVertex.x},${selectedVertex.y} L${closestVertex.x},${closestVertex.y}`);

            path.setAttribute('stroke', '#2C3A47');
            path.setAttribute('stroke-width', '1.5');
            path.setAttribute('id', `edge-${edges.length}`);
            path.setAttribute('stroke-miterlimit', '10');
            path.setAttribute('fill', 'none');
            // Append the edge path before vertices to ensure it appears below them
            graphSvg.insertBefore(path, graphSvg.firstChild);

            if (uwg) {
                let midX = (selectedVertex.x + closestVertex.x) / 2;
                let midY = (selectedVertex.y + closestVertex.y) / 2;

                addWeight(midX, midY);
            }

            if (uwg) {
                let midX = (selectedVertex.x + closestVertex.x) / 2;
                let midY = (selectedVertex.y + closestVertex.y) / 2;

                addWeight(midX, midY);
            }

            selectedVertex = null;
        }
    }
}

// Function to handle click event for adding an edge
function addDirectedEdge(event) {
    if (!isAddingEdge) return;

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

    // If a vertex is found and it's not the same as the selected vertex, create an edge
    if (closestVertex) {
        if (!selectedVertex) {
            selectedVertex = closestVertex;
        } else if (selectedVertex !== closestVertex) {

            // Check if the edge already exists
            if (!graph[selectedVertex.id].includes(closestVertex.id)) {
                const edge = {
                    start: selectedVertex,
                    end: closestVertex,
                    id: edges.length + 1
                };

                // Push the end vertex to the adjacency list of the start vertex
                graph[selectedVertex.id].push(closestVertex.id);

                edges.push(edge);
                console.log(edges);

                // Calculate the position of arrowhead along the edge
                const dx = closestVertex.x - selectedVertex.x;
                const dy = closestVertex.y - selectedVertex.y;
                const length = Math.sqrt(dx * dx + dy * dy);
                const edgeRatio = (length - 20) / length; // Subtracting vertex radius
                const arrowX = selectedVertex.x + dx * edgeRatio;
                const arrowY = selectedVertex.y + dy * edgeRatio;


                // Adding arrow

                // Create <defs> element
                var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

                // Create <marker> element
                var marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
                marker.setAttribute("id", `arrow-${edges.length}`);
                marker.setAttribute("markerWidth", "10");
                marker.setAttribute("markerHeight", "7");
                marker.setAttribute("refX", "0");
                marker.setAttribute("refY", "3.5");
                marker.setAttribute("orient", "auto");

                // Create <polygon> element
                var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
                polygon.setAttribute("points", "0 0, 10 3.5, 0 7");
                polygon.setAttribute("fill", "black");

                // Append <polygon> to <marker>
                marker.appendChild(polygon);

                // Append <marker> to <defs>
                defs.appendChild(marker);

                // Append <defs> to the SVG container
                // Replace 'svg-container' with the ID of your SVG container
                graphSvg.appendChild(defs);

                // Draw the directed edge with arrowhead
                const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                let direction = `M${selectedVertex.x},${selectedVertex.y} L${closestVertex.x},${closestVertex.y}`;
                path.setAttribute('d', direction);
                path.setAttribute('stroke', '#2C3A47');
                path.setAttribute('stroke-width', '1.5');
                path.setAttribute('marker-end', `url(#arrow-${edges.length})`); // Add marker to indicate direction
                path.setAttribute('id', `edge-${edges.length}`);
                path.setAttribute('fill', 'none');

                let len = path.getTotalLength();

                let point = path.getPointAtLength(len - 33);
                direction = `M${selectedVertex.x},${selectedVertex.y} L${point.x},${point.y}`;
                path.setAttribute('d', direction);
                graphSvg.insertBefore(path, graphSvg.firstChild);



                if (dwg) {
                    let midX = (selectedVertex.x + point.x) / 2;
                    let midY = (selectedVertex.y + point.y) / 2;
                    addWeight(midX, midY);
                }



            }

            selectedVertex = null;
        }
    }
}


var graphTypeSelect = document.getElementById("graph-type");

// Add event listener for change event
graphTypeSelect.addEventListener("change", function (event) {
    // Get the selected value
    var selectedValue = graphTypeSelect.value;

    // Perform tasks based on the selected value
    switch (selectedValue) {
        case "DWG":

            // Directed Weighted Graph
            dwg = true;
            dug = false;
            uwg = false;
            uug = false;
            console.log("Directed Weighted Graph selected");
            // Add your code here for Directed Weighted Graph
            break;
        case "DUG":
            dwg = false;
            dug = true;
            uwg = false;
            uug = false;
            // Directed Unweighted Graph
            console.log("Directed Unweighted Graph selected");
            // Add your code here for Directed Unweighted Graph
            break;
        case "UWG":
            // Undirected Weighted Graph
            dwg = false;
            dug = false;
            uwg = true;
            uug = false;
            console.log("Undirected Weighted Graph selected");
            // Add your code here for Undirected Weighted Graph
            break;
        case "UUG":
            // Undirected Unweighted Graph
            dwg = false;
            dug = false;
            uwg = false;
            uug = true;
            console.log("Undirected Unweighted Graph selected");
            // Add your code here for Undirected Unweighted Graph
            break;
        default:
            console.log("Unknown graph type selected");
    }
});



vertexBtn.addEventListener('click', () => {
    isAddingVertex = true;
    isAddingEdge = false;
    isPerformingBFS = false;
    graphSvg.removeEventListener('click', addDirectedEdge);
    graphSvg.addEventListener('click', addVertex);
});

// Event listener to add edge on click
edgeBtn.addEventListener('click', () => {
    isAddingEdge = true;
    isAddingVertex = false;
    isPerformingBFS = false;
    graphSvg.removeEventListener('click', addVertex);
    if (uug) {
        graphSvg.addEventListener('click', addEdge);
    }
    else if (dug) {
        graphSvg.addEventListener('click', addDirectedEdge);
    } else if (uwg) {
        graphSvg.addEventListener('click', addEdge);
    } else {
        graphSvg.addEventListener('click', addDirectedEdge);

    }
});

// Event listener to perform BFS on click
bfsBtn.addEventListener('click', () => {
    isPerformingBFS = true;
    isAddingVertex = false;
    isAddingEdge = false;
    graphSvg.removeEventListener('click', addVertex);
    graphSvg.removeEventListener('click', addDirectedEdge);
    graphSvg.removeEventListener('click',addEdge);

    // const startingNode = vertices[0].id; // Or use the ID to access by vertex ID

    // bfs(graph, startingNode);
    // isBFS = true;
    graphSvg.addEventListener('click',triggerBfs);
    // graphSvg.removeEventListener('click',triggerBfs);

});

dfsBtn.addEventListener('click',()=>{
    graphSvg.addEventListener('click',triggerDfs);
})
