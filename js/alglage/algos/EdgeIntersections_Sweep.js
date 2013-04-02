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
    var info = "Debugging madness:";

    //Eventqueue mit den Kantenendpunkten initialisieren
    for(var i=0; i<edges.length; ++i){
        evq.push(new Event("start",edges[i]));
        evq.push(new Event("end",edges[i]));
    }

    evq.sort(function(x,y){
        return x.key - y.key;
    });
    info += evq.map(function(e){return (""+(e.type)+((e.type==="start")?e.edge1.getLeft():e.edge1.getRight())+"\n");});//<--remove me)

    //Sweep ueber die Flaeche
    var currev = null;
    while(evq.length !== 0){
        currev = evq.shift();
        info += "\n->currev:"+(currev.type)+(currev.edge1.getLeft())+"--"+(currev.edge1.getRight())+"\n"//<--remove me;
        switch (currev.type) {
            case "start":
                sls.push(currev.edge1);
                sort_sls();
//                info+=sls.map(function(e){return (e.getLeft()+"--"+e.getRight()+"\n");});//<--remove me
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
        var commonOrdinate = false; //falls mehrere Kanten an einem Punkt starten
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

//        info+="-->sw:\n"+
//              "one:"+sls[id1].getLeft()+"--"+sls[id1].getRight()+
//              "two:"+sls[id2].getLeft()+"--"+sls[id2].getRight(); //<--remove me

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

//        if (smaller>0) info+="pre:"+sls[smaller-1].getLeft()+"--"+sls[smaller-1].getRight()+
//            "sp:"+sls[smaller].edgeIntersection(sls[smaller-1])+"\n";//<--remove me
        if (smaller > 0 &&
                (intersection1 = sls[smaller].edgeIntersection(sls[smaller-1])) !== null &&
                !intersection1.equals(sls[smaller].pt1)   && 
                !intersection1.equals(sls[smaller].pt2)   && 
                !intersection1.equals(sls[smaller-1].pt1) && 
                !intersection1.equals(sls[smaller-1].pt2) ) {
                    evq.push(new Event("intersection",sls[smaller-1],sls[smaller],intersection1));
                    inserted = true;
                    info+="|ins:"+intersection1+", "+
                        sls[smaller-1].getLeft()+"--"+sls[smaller-1].getRight()+", "+
                        sls[smaller].getLeft()+"--"+sls[smaller].getRight()+ "|\n";//<--remove me
                }

//        if (bigger>0) info+="pos:"+sls[bigger+1].getLeft()+"--"+sls[bigger+1].getRight()+
//            "sp:"+sls[bigger].edgeIntersection(sls[bigger+1])+"\n";//<--remove me
        if (bigger < sls.length-1 &&
                (intersection2 = sls[bigger].edgeIntersection(sls[bigger+1])) !== null &&
                !intersection2.equals(sls[bigger].pt1)   && 
                !intersection2.equals(sls[bigger].pt2)   && 
                !intersection2.equals(sls[bigger+1].pt1) && 
                !intersection2.equals(sls[bigger+1].pt2) ) {
                    evq.push(new Event("intersection",sls[bigger],sls[bigger+1],intersection2));
                    inserted = true;
                    info+="|ins:"+intersection2+", "+
                        sls[bigger+1].getLeft()+"--"+sls[bigger+1].getRight()+", "+
                        sls[bigger].getLeft()+"--"+sls[bigger].getRight()+ "|\n";//<--remove me
                }
        if (inserted) evq.sort(function(x,y){return x.key-y.key;});

    };
    
    function insertNeighbourIntersections(index) {
        var intersection1, intersection2 = null;
        var inserted = false;
        if (index<0) {
            alert("EdgeIntersection_Sweep: some edge was not inserted into sls!!");
        } else {
//            info+="-->iNI:"+sls[index].getLeft()+"--"+sls[index].getRight()+"\n";//<--remove me
//            if (index>0) info+="pre:"+sls[index-1].getLeft()+"--"+sls[index-1].getRight()+
//                "sp:"+sls[index].edgeIntersection(sls[index-1])+"\n";//<--remove me
//            if (index<sls.length-1) info+="pos:"+sls[index+1].getLeft()+"--"+sls[index+1].getRight()+
//                "sp:"+sls[index].edgeIntersection(sls[index+1])+"\n";//<--remove me
            if (index > 0 &&
                    (intersection1 = sls[index].edgeIntersection(sls[index-1])) !== null &&
                    !intersection1.equals(sls[index].pt1)   && 
                    !intersection1.equals(sls[index].pt2)   && 
                    !intersection1.equals(sls[index-1].pt1) && 
                    !intersection1.equals(sls[index-1].pt2) ) {
                        evq.push(new Event("intersection",sls[index-1],sls[index],intersection1));
                        rted = true;
                        info+="|ins:"+intersection1+", "+
                            sls[index-1].getLeft()+"--"+sls[index-1].getRight()+", "+
                            sls[index].getLeft()+"--"+sls[index].getRight()+ "|\n";//<--remove me
                    }
            if (index < sls.length-1 &&
                    (intersection2 = sls[index].edgeIntersection(sls[index+1])) !== null &&
                    !intersection2.equals(sls[index].pt1)   && 
                    !intersection2.equals(sls[index].pt2)   && 
                    !intersection2.equals(sls[index+1].pt1) && 
                    !intersection2.equals(sls[index+1].pt2) ) {
                        evq.push(new Event("intersection",sls[index],sls[index+1],intersection2));
                        inserted = true;
                        info+="|ins:"+intersection2+", "+
                            sls[index].getLeft()+"--"+sls[index].getRight()+", "+
                            sls[index+1].getLeft()+"--"+sls[index+1].getRight()+ "|\n";//<--remove me
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
//            info+="-->re:"+sls[index].getLeft()+"--"+sls[index].getRight()+"\n";//<--remove me
//            if (index>0 && index<sls.length-1) {
//                info+="pre:"+sls[index-1].getLeft()+"--"+sls[index-1].getRight()+
//                    "pos:"+sls[index+1].getLeft()+"--"+sls[index+1].getRight()+
//                    "sp:"+sls[index-1].edgeIntersection(sls[index+1])+"\n";//<--remove me
//            }
            if(index > 0 && index < sls.length-1 &&
                    (intersection1 = sls[index-1].edgeIntersection(sls[index+1])) !== null &&
                    !intersection1.equals(sls[index+1].pt1)   && 
                    !intersection1.equals(sls[index+1].pt2)   && 
                    !intersection1.equals(sls[index-1].pt1)   && 
                    !intersection1.equals(sls[index-1].pt2) ) {
                        evq.push(new Event("intersection",sls[index-1],sls[index+1],intersection1));
                        inserted = true;
                        info+="|ins:"+intersection1+", "+
                            sls[index-1].getLeft()+"--"+sls[index-1].getRight()+", "+
                            sls[index+1].getLeft()+"--"+sls[index+1].getRight()+ "|\n";//<--remove me
                    }
            if (inserted) evq.sort(function(x,y){return x.key-y.key;});
        }
        sls.remove(index);
    };
}

function Event(type,edge) {
    //"start", "intersection" oder "end"
    this.type = type;
    this.edge1 = edge;

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
};
