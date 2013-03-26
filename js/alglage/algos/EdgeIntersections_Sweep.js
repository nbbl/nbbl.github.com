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

    var currev = null;
    while(evq.length !== 0){
        currev = evq.shift();
        switch currev.type {
            case "start":
                sls.push(currev.edge1);
                sort_sls();
                insertNeighbourIntersections(sls.indexOf(currev.edge1));
                break;
            case "intersection":

                break;
            case "end":
                break;
        }
    }

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
                    evq.push(new Event("intersection",sls[index-1],sls[index],intersection1));
                    inserted = true;
            }
            if (index < sls.length-1 &&
                (intersection2 = sls[index].edgeIntersection(sls[index+1])) !== null &&
                !intersection2.equals(sls[index].pt1)   && 
                !intersection2.equals(sls[index].pt2)   && 
                !intersection2.equals(sls[index+1].pt1) && 
                !intersection2.equals(sls[index+1].pt2) ) {
                    evq.push(new Event("intersection",sls[index],sls[index+1],intersection2));
                    inserted = true;
            }
            if (inserted) evq.sort(function(x,y){return x.key-y.key;});
        }
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
            this.key = args[3].x;
            this.edge2 = args[2];
            break;
        case "end":
            this.key = edge.getRight().x;
            break;
    }

    this.edge1 = edge;
}
