/*
 * Main-Aufruf
 * Hier wird alles initialisiert
 */

var $cont = $('#container');
var width = $cont.width();
var height = $cont.height();

var gui = new GUI('container', width, height);

var alc = new AlgLageController(gui);

var p1 = new Point(100, 150);
var p2 = new Point(200, 250);

alc.addPoint(p1);
alc.addPoint(p2);

alc.refresh();

alc.addAlgo('algo1', 'js/alglage/algos/Algo1.js');
alc.addAlgo('algo2', 'js/alglage/algos/Algo2.js');

alc.calculateAlgos();