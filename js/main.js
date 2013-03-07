/*
 * Main-Aufruf
 * Hier wird alles initialisiert
 */

var gui = new GUI({
    containerId : 'jxgbox',       // Id des Containers
    maxX : 15,              // maximale X-Koordinate für Punkte
    maxY : 10               // maximale Y-Koordinate für Punkte
});

var alc = new AlgLageController(gui);

var p1 = new Point(12, 4);
var p2 = new Point(3, 7);

alc.addPoint(p1);
alc.addPoint(p2);

alc.refresh();

alc.addAlgo('algo1', 'js/alglage/algos/Algo1.js');
alc.addAlgo('algo2', 'js/alglage/algos/Algo2.js');

alc.calculateAlgos();