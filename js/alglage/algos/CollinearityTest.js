importScripts('../core/Core.js');
importScripts('./Utilities.js');

CollinerarityTest_SPATIAL_TOLERANCE = 0.1;

self.onmessage = function(event) {
    var points = Point.cast(event.data.points);
    var name = event.data.name;
    calculate(points, name);
};

function calculate(points,name){
    var sets = new Subsets(points,3);
    var collintriple = [];
    for(var triple in sets){
        var edge = new Edge(triple[0],triple[1]);
	if(edge.distanceToLine(triple[2]) < CollinerarityTest_SPATIAL_TOLERANCE) collintriple.push(edge); 
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
