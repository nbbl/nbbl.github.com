function sweep(edges) {
    var sls = [];
    var evq = [];
    
    for(var i=0; i<edges.length; ++i){
	evq.push(new Event("start",edges[i]));
	evq.push(new Event("end",edges[i]));
    }

    evq.sort(function(x,y){
	return x.key - y.key;
    });
    
    var currev, prevev = null;
    var commonOrdinate = false;
    while(evq.length !== 0){
	prevev = currev;
	currev = evq.shift();
	switch currev.type {
	case "start":
	    sls.push(currev.edge1);
	    sls.sort(compareOrdinate); //<------------------
	    break;
	case "intersection":
	    sls.push();
	    break;
	case "end":
	    break;
	}
    }

    function compareOrdinate(x,y,key){ //<-------------------
	var comp = null;
	if ((comp = x.getY(key) -y.getY(key)) === 0){
	    commonOrdinate = true;
	}
	return comp; 
    };
}


function Event(type,edge) {
    //"start", "intersection" oder "end"
    this.type = type;

    //this.key ist die X-Koordinate des Eventpoints
    switch type {
    case "start": 
	this.key = edge.getLeft().x;
	break;
    case "intersection":
	this.key = args[3];
	this.edge2 = args[2];
	break;
    case "end":
	this.key = edge.getRight().x;
	break;
    }
    
    this.edge1 = edge;
}
