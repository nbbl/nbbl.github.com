importScripts('../core/Core.js');
//importScripts('./Utilities.js');

CollinearityTest_SPATIAL_TOLERANCE = 0.1;

self.onmessage = function(event) {
    var points = Point.cast(event.data.graph.points);
    var name = event.data.name;
    calculate(points, name);
};

function calculate(points, name) {
    var res = [];
    var info = "";
    var edge = null;
    var dist, dist2 = null;
    var start, middle, end = null;
    var endPointCases = 1; //1:=(i,j); 2:=(i,k); 3:=(j,k) Paare entspr. Endpunktindizes

    for (var i = 0; i < points.length-2; ++i) {
        for (var j = i+1; j < points.length-1; ++j) {
            for (var k = j+1; k < points.length; ++k) {
                //finde die aeusseren Punkte
                dist = points[i].distance(points[j]);
                dist2 = points[i].distance(points[k]);
                if (dist < dist2) { //default ist endPointcases = 1;
                    endPointCases = 2;
                    dist = dist2;
                }
                if (dist < points[j].distance(points[k])) endPointCases = 3;
                switch (endPointCases) {
                    case 1: 
                        start  = points[i];
                        end    = points[j];
                        middle = points[k];
                        break;
                    case 2:
                        start  = points[i];
                        end    = points[k];
                        middle = points[j];
                        break;
                    case 3:
                        start  = points[j];
                        end    = points[k];
                        middle = points[i];
                        break;
                    default:
                        start = middle = end = null;
                }
                //teste ob die drei Punkt auf einer Geraden liegen
                edge = new Edge(start, end);
                dist = edge.distanceToLine(middle);
                if (dist < CollinearityTest_SPATIAL_TOLERANCE) {
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
