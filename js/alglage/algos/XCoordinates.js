importScripts('../core/Core.js');

self.onmessage = function(event){
    var points = Point.cast(event.data.graph.points);
    var name = event.data.name;

    calculate(points, name);
};

function calculate(points, name) {
    
    var res = []; // Array of Edges

    var sPoints = points.sort(pointSort);

    for(var i = 0; i < sPoints.length - 1; i++) {
        if(sPoints[i+1].x - sPoints[i].x < 0.1) {
            res.push(new Edge(sPoints[i+1], sPoints[i]));
        }
    }

    var infoText;
    if(res.length == 0) {
        infoText = 'Es befinden sich keine 2 Punkte auf der selben x-Koordinate und somit ist nach diesem '
            + 'Kriterium die allgemeine Lage gegeben.<br>'
            + 'Der Score berechnet sich aus den Abständen aller Punkte, die annähernd auf einem '
            + 'Kreis liegen.'
    }
    else {
        infoText = 'Es befinden sich ' + res.length + ' mal 2 Punkte auf der selben x-Koordinate und somit ist '
            + 'nach diesem Kriterium die allgemeine Lage <strong>nicht</strong> gegeben.<br>'
            + 'Der Score berechnet sich aus den Abständen aller Punkte, die annähernd auf einem '
            + 'Kreis liegen.'
    }

    // Daten zurückgeben
    self.postMessage({
        score : res.length,
        annotations : {
            'lines' : res
        },
        name : name,
        info : infoText
    });
}

function pointSort(p1, p2) {
    return p1.x - p2.x;
}
