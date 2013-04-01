/*
 * Main-Aufruf
 * Hier wird alles initialisiert
 */

var gui = new GUI({
    containerId : 'jxgbox',       // Id des Containers
    levelDummy : '.dropdown-menu .dummy',
    pageHeader : '.page-header h2',
    dummyContainer : 'dummyBox', // Id von Dummy-Box
    highscoreDummy : '.highscore .dummy',
    maxX : 20,              // maximale X-Koordinate für Punkte
    maxY : 10               // maximale Y-Koordinate für Punkte
});

var alc;

// Für JSONP
function getResults(json) {
    var njs = JSON.parse(json);
    alc.setHighscore(njs);
}

alc = new AlgLageController(gui);

alc.addLevel('Test', graph_t);
alc.addLevel('Haus vom Nikolaus', graph_hvn);

alc.addAlgo('XCoord', 'js/alglage/algos/XCoordinates.js');
alc.addAlgo('CircleCheck', 'js/alglage/algos/CircleCheck.js');
alc.addAlgo('CollinearityTest', 'js/alglage/algos/CollinearityTest.js');
alc.addAlgo('ShortestDistance_BF', 'js/alglage/algos/ShortestDistance_BF.js');
alc.addAlgo('EdgeIntersections_BF', 'js/alglage/algos/EdgeIntersections_Brutal.js');
alc.addAlgo('EdgeIntersections_Sweep', 'js/alglage/algos/EdgeIntersections_Sweep.js');
alc.addAlgo('SmallestAngle_BF', 'js/alglage/algos/SmallestAngle_BF.js');

alc.loadLevel('Test');

// Nur zum testen!!
$('ul.nav > li > a:last').click(function() {
    alc.postHighscore();
    return false;
});
