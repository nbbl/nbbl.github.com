importScripts('../core/Core.js');

self.onmessage = function(event) {
    var edges = Edge.cast(event.data.graph.edges);
    var points = Point.cast(event.data.graph.points);
    var name = event.data.name;
    calculate(edges, name, points);
};

function calculate(edges, name, points) {
    var start = new Date();
    var intersections = [];
    var tmp = null;
    
    //Berechne alle echten Schnittpunkte
    for (var i = 0; i<edges.length-1; ++i) {
        for (var j = i+1; j<edges.length; ++j) {
            tmp = edges[i].edgeIntersection(edges[j]);
            if (tmp !== null && tmp !=="parallel_lines" && tmp !== "identical_lines") {
                if(!tmp.equals(edges[i].pt1) && 
                   !tmp.equals(edges[i].pt2) && 
                   !tmp.equals(edges[j].pt1) && 
                   !tmp.equals(edges[j].pt2)) { 
                    
		    intersections.push({pt: tmp,
		    			ed1: edges[i],
		    			ed2: edges[j]});
                }
            } 
        }
    }
    
    //Berechne kürzeste Distanz (>0) von Schnittpunkten zu Kanten
    var currshortest = Infinity;
    var result = null;
    var temp = null;
    var projection = null;

    for(var i=0; i<intersections.length; ++i){
	for(var j=0; j<edges.length; ++j){
	    if(intersections[i].ed1!==edges[j] && intersections[i].ed2!==edges[j]){
		temp = edges[j].distanceToLine(intersections[i].pt);
		projection = edges[j].projectionToEdge(intersections[i].pt);
		
		if(temp < currshortest && projection !== null){
		    result = new Edge(intersections[i].pt,projection);
		    currshortest = temp;
		    
		}
	    }
	}
    }

    //Berechne kürzeste Distanz (>0) von Graphknoten zu Kanten
    for(var i=0; i<points.length; ++i) {
        for(var j=0; j<edges.length; ++j) {
            if(points[i]!==edges[j].pt1 && points[i]!==edges[j].pt2) {
		temp = edges[j].distanceToLine(points[i]);
		projection = edges[j].projectionToEdge(points[i]);
		
		if(temp < currshortest && projection !== null){
		    result = new Edge(points[i],projection);
		    currshortest = temp;
		    
		}		
	    }
        }
    }
    var end = new Date();

    self.postMessage({
        score       : currshortest,
        annotations : { lineSegments: [result],
			points: [result.pt1,result.pt2]
		      },
        name  : name,
        info  : (end.getTime() - start.getTime()) +
                "kleinster Abstand eines Schnittpunktes zu einer Kante, \n"+
	        "Anzahl der Schnittpunkte: "+intersections.length
    });
}
