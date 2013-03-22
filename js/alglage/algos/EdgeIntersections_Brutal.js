importScripts('../core/Core.js');

self.onmessage = function(event) {
    var edges = Edge.cast(event.data.graph.edges);
    var name = event.data.name;
    calculate(edges, name);
};

function calculate(edges, name) {
    var info = "";
    var res = shortestDistIntersectEdge(calculateIntersections(edges),edges);


    self.postMessage({
        score       : res !== null,
        annotations : { lineSegments: res },
        name        : name,
	info  : "Schnittpunkte: x1="+res.pt1.x +" y2="+res.pt1.y+"; x2=" +res.pt2.x +" y2="+res.pt2.y
    });
}

function shortestDistIntersectEdge(intersections,edges){
    var shortestEdge = null;
    var projection   = null;
    for(var i=0; i<intersections.length-1; ++i){
        for(var j=0; j<edges.length-1; ++j){
            if (edges[j]!=intersections[i].edge1 && edges[j]!=intersections[i].edge2 ) {
                projection = edges[j].projectionToEdge(intersections[i].pt);
                if(projection !== null && 
                  (shortestEdge === null || projection.distance(intersections[i]) < shortestEdge.length)){
                    shortestEdge = new Edge(projection,intersections[i].pt);
                }
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
            tmp = edges[i].edgeIntersection(edges[j]);
            if (tmp !== null && tmp !== "parallel_lines"  && tmp !== "identical_lines" ){ 
                res.push(new Intersection(tmp,edges[i],edges[j]));
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
