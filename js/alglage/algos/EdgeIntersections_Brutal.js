importScripts('../core/Core.js');

self.onmessage = function(event) {
    var edges = Edge.cast(event.data.graph.edges);
    var name = event.data.name;
    calculate(edges, name);
};

function calculate(edges, name) {
    var info = "Hallo Algo"
    var res = shortestDistIntersectEdge(calculateIntersections(edges),edges);


    self.postMessage({
        score       : res !== null,
        annotations : { lineSegments: res },
        name        : name,
	info  : info
    });
}

function shortestDistIntersectEdge(intersections,edges){
    var shortestEdge = null;
    var projection   = null;
    for(var i=0; i<intersections.length-1; ++i){
	for(var j=0; j<edges.length-1; ++j){
	    projection = edges[j].projectionToEdge(intersections[i]);
	    if(projection !== null && 
	       (shortestEdge === null || projection.distance(intersections[i]) < shortestEdge.length)){
		shortestEdge = new Edge(projection,intersections[i]);
	    }
	}
    }
    return shortestEdge;
}

function calculateIntersections(edges) {
    var res = [];
    var tmp = null;
    for (var i = 0; i<edges.length-2; ++i) {
        for (var j = i+1; j<edges.length-1; ++j) {
            tmp = edge[i].edgeIntersection(edge[j]);
            if (tmp !== null && tmp !=="parallel_lines" && tmp !== "identical_lines" ){ 
		res.push(new Intersection(tmp,edge[i],edge[j]));
	    }
        }
    }
    return res;
}

function Intersection(pt, edge1, edge2){
    this.edge1 = edge1;
    this.edge2 = edge2;
    this.pt = pt;
}
