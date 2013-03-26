importScripts("Utilities.js");
importScripts("../core/Core.js");


self.onmessage = function(event) {
    var edges = Edge.cast(event.data.graph.edges);
    var name = event.data.name;
    sweep(edges,name);
};

function sweep(edges,name) {
    var sls = [];
    var evq = [];
    var result = [];
    var info = "";

    for(var i=0; i<edges.length; ++i){
        evq.push(new Event("start",edges[i]));
        evq.push(new Event("end",edges[i]));
    }

    evq.sort(function(x,y){
        return x.key - y.key;
    });

    var currev = null;
    while(evq.length !== 0){
        currev = evq.shift();
        switch (currev.type) {
            case "start":
                sls.push(currev.edge1);
                sort_sls();
                insertNeighbourIntersections(sls.indexOf(currev.edge1));
                break;
            case "intersection":
	        swap_sls(sls.indexOf(currev.edge1),sls.indexOf(currev.edge2));
                result.push(currev.key);
	        break;
            case "end":
	        remove_edge(sls.indexOf(currev.edge1));
                break;
        }
    }
    self.postMessage({
        score       : result.length,
        annotations : { lines: result.map(function(x){return new Edge(new Point(x,0),new Point(x,1));})},
        name        : name,
        info  : info
    });
    
    function sort_sls(){
        var commonOrdinate = false;
        var iteration      = 0;
        var DELTA          = 1E-5;

        do {
            commonOrdinate = false;
            sls.sort(function(x,y){
                var res = null;
                if ((res = x.getY(currev.key+iteration*DELTA) - y.getY(currev.key+iteration*DELTA)) === 0) {
                    commonOrdinate = true;
                }
                return res;
            });
            iteration++;
        } while(commonOrdinate);
    };

    function swap_sls(id1,id2){
	if(id1>id2) {
	    var bigger = id1;
	    var smaller = id2;
	}
	else {
	    var bigger = id2;
	    var smaller = id1;
	}
	var temp = sls[bigger];
	sls[bigger] = sls[smaller];
	sls[smaller] = temp;
	
	var intersection1, intersection2 = null;
	var inserted = false;
	
	if (i > 0 &&
            (intersection1 = sls[smaller].edgeIntersection(sls[smaller-1])) !== null &&
            !intersection1.equals(sls[smaller].pt1)   && 
            !intersection1.equals(sls[smaller].pt2)   && 
            !intersection1.equals(sls[smaller-1].pt1) && 
            !intersection1.equals(sls[smaller-1].pt2) ) {
	        info += sls[smaller-1];
                evq.push(new Event("intersection",sls[smaller-1],sls[smaller],intersection1));
                inserted = true;
        }
	
        if (bigger < sls.length-1 &&
            (intersection2 = sls[bigger].edgeIntersection(sls[bigger+1])) !== null &&
            !intersection2.equals(sls[bigger].pt1)   && 
            !intersection2.equals(sls[bigger].pt2)   && 
            !intersection2.equals(sls[bigger+1].pt1) && 
            !intersection2.equals(sls[bigger+1].pt2) ) {
	        info += sls[bigger+1];
                evq.push(new Event("intersection",sls[bigger],sls[bigger+1],intersection2));
                inserted = true;
        }
	if (inserted) evq.sort(function(x,y){return x.key-y.key;});
	
    };
    
    function insertNeighbourIntersections(index) {
        var intersection1, intersection2 = null;
        var inserted = false;
        if (index<0) {
            alert("EdgeInterseciton_Sweep: some edge was not inserted into sls!!");
        } else {
            if (index > 0 &&
                (intersection1 = sls[index].edgeIntersection(sls[index-1])) !== null &&
                !intersection1.equals(sls[index].pt1)   && 
                !intersection1.equals(sls[index].pt2)   && 
                !intersection1.equals(sls[index-1].pt1) && 
                !intersection1.equals(sls[index-1].pt2) ) {
		    info += sls[index-1];
                    evq.push(new Event("intersection",sls[index-1],sls[index],intersection1));
                    inserted = true;
            }
            if (index < sls.length-1 &&
                (intersection2 = sls[index].edgeIntersection(sls[index+1])) !== null &&
                !intersection2.equals(sls[index].pt1)   && 
                !intersection2.equals(sls[index].pt2)   && 
                !intersection2.equals(sls[index+1].pt1) && 
                !intersection2.equals(sls[index+1].pt2) ) {
                    info += sls[index+1];
		    evq.push(new Event("intersection",sls[index],sls[index+1],intersection2));
                    inserted = true;
            }
            if (inserted) evq.sort(function(x,y){return x.key-y.key;});
        }
    };
    
    function remove_edge(index) {
	var intersection1 = null;
	var inserted = false;
	if (index<0) {
            alert("EdgeInterseciton_Sweep: some edge was not inserted into sls!!");
        } else {
	    if(index > 0 && index < sls.length-1 &&
	       (intersection1 = sls[index-1].edgeIntersection(sls[index+1])) !== null &&
               !intersection1.equals(sls[index+1].pt1)   && 
               !intersection1.equals(sls[index+1].pt2)   && 
               !intersection1.equals(sls[index-1].pt1)   && 
               !intersection1.equals(sls[index-1].pt2) ) {
		   info += sls[index+1];
		   evq.push(new Event("intersection",sls[index-1],sls[index],intersection1));
                   inserted = true;
	    }
	    if (inserted) evq.sort(function(x,y){return x.key-y.key;});
	}
	sls.remove(index);
    };
}

function Event(type,edge) {
    //"start", "intersection" oder "end"
    this.type = type;

    //this.key ist die X-Koordinate des Eventpoints
    switch (type) {
        case "start": 
            this.key = edge.getLeft().x;
            break;
        case "intersection":
            this.key = arguments[3].x;
            this.edge2 = arguments[2];
            break;
        case "end":
            this.key = edge.getRight().x;
            break;
    }

    this.edge1 = edge;
}
