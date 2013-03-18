importScripts('../core/Core.js');

self.onmessage = function(event) {
    var points = event.data.points;

    // durch die Serialisierung in eine Nachricht haben die Punkte ihre
    // Methoden verloren. Daher zurückcasten!
    points = Vector.cast(points);

    calculate(points);
};

// dieser Algorithmus berechnet brute-force die kürzeste Distanz aller
// übergebenen Punkte in *points* aus, und gibt den Betrag der kürzesten
// Distanz und eine Liste von Edge-Objekten aller kürzesten Paare von
// Punkten zurück
function calculate(points) {
    var shortestDistance = Infinity;
    var edges = [];

    for(var i = 0; i < points.length; i++) {
        for(var j = i+1; j < points.length; j++) {

            var dist = Vector.distance(points[i], points[j]);
            if(dist <= shortestDistance) {
                shortestDistance = dist;
                edges.push(new Edge(points[i], points[j]));
            }
        }
    }

    // zu viele Edges hinzugefügt, nur die beibehalten, die auch wirklich
    // die kürzeste Länge haben
    var result = [];
    for(var i = 0; i < edges.length; i++) {
        if (edges[i].length() <= shortestDistance) {
            result.push(edges[i]); 
        }
    }

    self.postMessage({
        score : shortestDistance,
        annotations : { lineSegments : result },
        name : 'ShortestDistance_BF',
        info : 'plz put some information here'
    });
};
