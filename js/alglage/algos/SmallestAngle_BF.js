importScripts('../core/Core.js');

self.onmessage = function(event) {
    var graph = event.data.graph;

    // zurückcasten
    graph.points = Vector.cast(graph.points);
    graph.edges = Edge.cast(graph.edges);

    // Punkte, die nicht in wenigstens einer Kante enhalten sind, werden nicht berücksichtigt
    calculate(graph, event.data.name);
};

// dieser Algorithmus berechnet brute-force die kürzeste Distanz aller
// übergebenen Punkte in *points*, und gibt den Betrag der kürzesten
// Distanz und eine Liste von Edge-Objekten aller kürzesten Paare von
// Punkten zurück
function calculate(graph, name) {
    var anglePoints = [];
    var angles = [];
    var annots = [];

    // Punkte suchen, die mehr als eine ausgehende Kante haben
    // und daraus Winkelobjekte basteln
    for(var i = 0; i < graph.points.length; i++) {
        // wenn von einem Punkt wenigstens 2 Kanten ausgehen, dann hinzufügen
        if(graph.points[i].incidentEdges.length > 1) {
            anglePoints.push(graph.points[i]);
        }
    }

    for(var i = 0; i < anglePoints.length; i++) {
        var incEdges = anglePoints[i].incidentEdges;
        // Kanten sortieren
        incEdges.sort(function(x, y) {
                          // Vektoren aus den zwei zu vergleichenden Edges erstellen
                          var v1 = new Vector(anglePoints[i], x.getAdjacent(anglePoints[i]));
                          var v2 = new Vector(anglePoints[i], y.getAdjacent(anglePoints[i]));
                          return v1.degreesTo(v2);
                          }); // winkel vergleichen!
    }

    // Angles hinzufügen
    for(var i = 0; i < anglePoints.length; i++) {
        // annots.push(new Angle(...));
    }

    // über die Liste iterieren, Minimum/Maximum finden

    self.postMessage({
        score : 'kein score',
        annotations : { angles : [] },
        name : name,
        info : 'blarb'
    });
};
