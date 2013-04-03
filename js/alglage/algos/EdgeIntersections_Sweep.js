importScripts("Utilities.js");
importScripts("../core/Core.js");


self.onmessage = function(event) {
    var edges = Edge.cast(event.data.graph.edges);
    var points = Point.cast(event.data.graph.points);
    var name = event.data.name;
    sweep(edges,name,points);
};

function sweep(edges,name,points) {
    var start = new Date();
    var sls = [];
    var evq = [];
    var result = [];
    var intersections = [];

    //Eventqueue mit den Kantenendpunkten initialisieren
    for(var i=0; i<edges.length; ++i){
        evq.push(new Event(0,edges[i]));
        evq.push(new Event(1,edges[i]));
    }

    evq.sort(function(a,b){return a.key - b.key;});

    var currev = null;
    var tmp    = null;
    while((currev = evq.shift()) !== undefined) {
	if(currev.type) { //Endpunkt
	    sls.remove(sls.indexOf(currev.edge));
	}
	else {
	    for(var i=0; i<sls.length; ++i){
		tmp = sls[i].edgeIntersection(currev.edge);
		if (tmp !== null && tmp !=="parallel_lines" && tmp !== "identical_lines") {
                    if(!tmp.equals(currev.edge.pt1) && 
                       !tmp.equals(currev.edge.pt2) && 
                       !tmp.equals(sls[i].pt1) && 
                       !tmp.equals(sls[i].pt2)) { 
			
			intersections.push({pt: tmp,
		    			    ed1: currev.edge,
		    			    ed2: sls[i]});
                    }
		}	    
	    }
	    sls.push(currev.edge);
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


};


function Event(type,edge) {
    //"start", "intersection" oder "end"
    this.type = type;
    this.edge = edge;

    //this.key ist die X-Koordinate des Eventpoints
    switch (type) {
        case 0: 
            this.key = edge.getLeft().x;
            break;
        case 1:
            this.key = edge.getRight().x;
            break;
    }
};
