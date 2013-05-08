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
    maxX : 15,              // maximale X-Koordinate für Punkte
    maxY : 10,               // maximale Y-Koordinate für Punkte
    scoringAlgoName : 'ShortestDistPoint-Edge',   // Name des Algos der als Score genommen wird
    refreshTime : 50       // Zeit in der die Algorithmen neu ausgeführt werden
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
alc.addLevel('Random', randomGraph(10,20,15,10));
alc.addLevel('Sieben', graph_complete_7);
alc.addLevel('Elf', graph_complete_11);
alc.addLevel('Zweiundzwanzig', graph_complete_22);
alc.addLevel('Petersen', petersen1);

alc.addAlgo('ShortestDistPoint-Edge', 'js/alglage/algos/EdgeIntersections_Brutal.js');
alc.addAlgo('XCoord', 'js/alglage/algos/XCoordinates.js');
alc.addAlgo('CircleCheck', 'js/alglage/algos/CircleCheck.js');
alc.addAlgo('CollinearityTest', 'js/alglage/algos/CollinearityTest.js');
alc.addAlgo('ShortestDistPoint-Point', 'js/alglage/algos/ShortestDistance_BF.js');
//alc.addAlgo('SmallestAngle_BF', 'js/alglage/algos/SmallestAngle_BF.js'); //TO DO ?

if(window.location.hash.indexOf('Custom') !== -1) { window.location.href = window.location.href.split('#')[0]; } // remove hash if custom level not existent
var levn = window.location.hash.substring(1) || 'Test';
alc.loadLevel(levn);
