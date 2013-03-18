importScripts('../core/Core.js');
//importScripts('./Utilities.js');

CollinearityTest_SPATIAL_TOLERANCE = 0.1;

self.onmessage = function(event) {
    var points = Point.cast(event.data.points);
    var name = event.data.name;
    calculate(points, name);
};

function calculate(points, name) {
    var res = [];
    var info = "";
    for (var i = 0; i < points.length-2; ++i) {
        for (var j = i+1; j < points.length-1; ++j) {
            for (var k = j+1; k < points.length; ++k) {
                var edge = new Edge(points[i], points[j]);
                var dist = edge.distanceToLine(points[k]);
                if (dist < CollinerarityTest_SPATIAL_TOLERANCE) {
                    res.push(edge);
                    info = info + dist + ", ";
                }
            }
        }
    }

    self.postMessage({
        score       : res.length,
        annotations : { lines : res },
        name        : name,
	info  : info
    });
}

/*
 * mit Iteratoren
function calculate(points,name){
    var sets = new Subsets(points,3);
    var collintriple = [];
    for(var triple in sets){
        var edge = new Edge(triple[0],triple[1]);
	if(edge.distanceToLine(triple[2]) < CollinearityTest_SPATIAL_TOLERANCE) collintriple.push(edge); 
	//später evtl alle Kanten/Punkt-kombos checken
    }
    self.postMessage({
        score :  collintriple.length,
        annotations  : { 
            lines : collintriple 
        },
        name  :  name,
	info  : ''
    });
}
*/
