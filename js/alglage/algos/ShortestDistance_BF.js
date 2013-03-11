importScripts('../core/Core.js');

self.onmessage = function(event) {
    var points = event.data.points;
    var name = event.data.name;

    calculate(points, name);
};

// dieser Algorithmus berechnet brute-force die kürzeste Distanz aller
// übergebenen Punkte in *points* aus, und gibt den Betrag der kürzesten
// Distanz und eine Liste von Edge-Objekten aller kürzesten Paare von
// Punkten zurück
function calculate(points, name) {
    var shortestDistance = Infinity;
    var edges;

    for (p in points) {
        for (q in points) {
            if (p !== q && p.distance(q) <= shortestDistance) {
                shortestDistance = p.distance(q);
                edges.push(new Edge(p, q));
            }
        }
    }

    // zu viele Edges hinzugefügt, nur die beibehalten, die auch wirklich
    // die kürzeste Länge haben
    for (e in edges) {
        if (! e.length() > shortestDistance)
            edges = edges.splice(edges.indexOf(e), 1);
    }

    self.postMessage({
        score : shortestDistance,
        more : edges,
        name : name
    });
};
