/*
 * Main-Aufruf
 * Hier wird alles initialisiert
 */

var gui = new GUI({
    containerId : 'jxgbox',       // Id des Containers
    dummyContainer : 'dummyBox', // Id von Dummy-Box
    maxX : 15,              // maximale X-Koordinate für Punkte
    maxY : 10               // maximale Y-Koordinate für Punkte
});

var alc = new AlgLageController(gui);

var p1 = new Point(12, 4);
var p2 = new Point(3, 7);
var p3 = new Point(6, 5);

alc.addPoint(p1);
alc.addPoint(p2);
alc.addPoint(p3);
// alc.fillRandomly(10, 5, 5);

// alc.addAlgo('algo1', 'js/alglage/algos/Algo1.js');
// alc.addAlgo('algo2', 'js/alglage/algos/Algo2.js');

alc.addAlgo('ShortestDistance_BF', 'js/alglage/algos/ShortestDistance_BF.js');

alc.calculateAlgos();
