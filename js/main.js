/*
 * Main-Aufruf
 * Hier wird alles initialisiert
 */

var gui = new GUI({
    containerId : 'jxgbox',       // Id des Containers
    dummyContainer : 'dummyBox', // Id von Dummy-Box
    maxX : 20,              // maximale X-Koordinate für Punkte
    maxY : 10               // maximale Y-Koordinate für Punkte
});

var alc = new AlgLageController(gui);

var points = [
    new Point(4, 6),
    new Point(12, 4),
    new Point(3, 7),
    new Point(6, 5),
    new Point(6, 7),
    new Point(7, 2),
    new Point(14, 5),
    new Point(4, 1) ];

var edges = [
    new Edge(points[0], points[1]),
    new Edge(points[1], points[2]),
    new Edge(points[2], points[4]),
    new Edge(points[7], points[1]),
    new Edge(points[7], points[6]),
    new Edge(points[2], points[6]),
    new Edge(points[3], points[6]),
    new Edge(points[4], points[6]),
    new Edge(points[7], points[5]) ];

var graph = new Graph(points, edges);
alc.setGraph(graph);

alc.addAlgo('circleCheck', 'js/alglage/algos/CircleCheck.js');
alc.addAlgo('CollinearityTest', 'js/alglage/algos/CollinearityTest.js');
alc.addAlgo('ShortestDistance_BF', 'js/alglage/algos/ShortestDistance_BF');

alc.calculateAlgos();
