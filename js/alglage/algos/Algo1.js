importScripts('../core/Core.js');

self.onmessage = function(event){
    var points = Point.cast(event.data.points);
    var name = event.data.name;

    calculate(points, name);
};

function calculate(points, name) {
    
    var res = []; // Array of Edges

    var sPoints = points.sort(pointSort);

    for(var i = 0; i < sPoints.length - 1; i++) {
        if(sPoints[i+1].x - sPoints[i].x < SPATIAL_TOLERANCE + 1) {
            res.push(new Edge(sPoints[i+1], sPoints[i]));
        }
    }

    // Daten zurückgeben
    self.postMessage({
        score : 111,
        more : res,
        name : name
    });
}

function pointSort(p1, p2) {
    return p1.x - p2.x;
}
