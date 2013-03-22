importScripts('../core/Core.js');

self.onmessage = function(event) {
    var edges = Edge.cast(event.data.graph.edges);
    var name = event.data.name;
    calculate(edges, name);
};

function calculate(edges, name) {
    var info = edges.map(function(ed){return "pt1: "+ed.pt1+"pt2: "+ed.pt2+" ";});
    var res = [];
    var tmp = null;

    for (var i = 0; i<edges.length-1; ++i) {
        for (var j = i+1; j<edges.length; ++j) {
            tmp = edges[i].edgeIntersection(edges[j]);
            if (tmp !== null && tmp !=="parallel_lines" && tmp !== "identical_lines") {
                if(!tmp.equals(edges[i].pt1) && 
                   !tmp.equals(edges[i].pt2) && 
                   !tmp.equals(edges[j].pt1) && 
                   !tmp.equals(edges[j].pt2)) { 
                    res.push(tmp);
                }
            } 
        }
    }

    self.postMessage({
        score       : res !== [],
        annotations : { lines: res.map(function(e){return new Edge(e,e.add(new Vector(0,1)));})},
        name        : name,
        info  : info
    });
}
