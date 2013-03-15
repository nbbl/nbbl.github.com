/*
 * Hier wird sich um das Zeichnen und darstellen der Daten gekümmert.
 */

/*
Settings
--------
{
    containerId : '',       // Id des Containers
    dummyContainer : '',    // Id von Dummy-Box
    maxX : 10,              // maximale X-Koordinate für Punkte
    maxY : 10               // maximale Y-Koordinate für Punkte
}

*/
var GUI = function(settings) {
        
    // Private Variablen
    var points = []; // Punkte des Graphen
    var edges = []; // Kanten des Graphen
    var boardPoints = []; // Darstellung von points
    var boardEdges = []; // Darstellung von edges (vmtl. nicht nötig)

    var $dummyBox = $('#' + settings.dummyContainer);
    var algoBoxes = {};
    
    // JSXGraph-Board initialisieren
    var board = JXG.JSXGraph.initBoard(settings.containerId, {
        boundingbox: [0, settings.maxY, settings.maxX, 0],
        axis : true,
        showCopyright : false,
        zoom : {
            wheel: true,
            needShift: false
        },
        pan : {
            needShift: false,
            enabled: true
        }
    });
    
    function initGraph(pnts, egs) {
        points = pnts;
        edges = egs;
        drawGraph();
    }

    // Diese Methode wird von AlgLageController genutzt, um nach einer
    // Benachrichtigung durch ein 'points-change' die neue Lage der
    // Punkte abfragen zu können
    function getPoints() {
        return points;
    }
    
    // Der Inhalt der privaten points & edges Variablen wird gezeichnet
    // Wird einmal zum initialisieren des Graphs aufgerufen
    function drawGraph() {
        if(points !== undefined) {
            // alle Punkte neuzeichnen
            for(var i = 0; i < boardPoints.length; i++) {
                p = board.removeObject(boardPoints[i]);
            }

            for (var i = 0; i < points.length; i++) {
                // für jedes Punkt-Objekt in points wird ein graphischer Punkt
                // auf dem board erstellt. Die Übersetzung zwischen den zwei
                // unterschiedlichen Arten von Punkten funktioniert über den
                // Index. D.h. points[i] entspricht boardPoints[i]
                boardPoints.push(board.create('point', [ points[i].x, points[i].y ], {withLabel:false}));

                // nach einem Verziehen eines Punktes dessen zugrundeliegenden Punkt
                // in points updaten, und event publishen
                boardPoints[i].on('mouseup', function(){
                    points[i].x = this.X();
                    points[i].y = this.Y();
                    $.publish('points-change');
                });

                // Bereich zum Verschieben der Punkte einschränken
                boardPoints[i].on('drag', function(){
                    if(this.X() < 0) this.moveTo([0, this.Y()]);
                    if(this.X() > settings.maxX) this.moveTo([settings.maxX, this.Y()]);
                    if(this.Y() < 0) this.moveTo([this.X(), 0]);
                    if(this.Y() > settings.maxY) this.moveTo([this.X(), settings.maxY]);
                });
            }
        }

        if(edges !== undefined) {
            // alle Kanten neuzeichnen
            for(var i = 0; i < boardEdges.length; i++) {
                p = board.removeObject(boardEdges[i]);
            }

            for (var i = 0; i < edges.length; i++) {
                var pt1 = boardPoints[points.indexOf(edges[i].pt1)];
                var pt2 = boardPoints[points.indexOf(edges[i].pt2)];
                boardEdges.push(board.create('line', [ pt1, pt2 ], {straightFirst:false, straightLast:false}));
            }
        }
    }

    function draw(obj) {
        // TODO
    }   
    function initAlgoBox(algoName) {
        var $ele = $dummyBox.clone().attr('id', algoName);
        $dummyBox.before($ele);
        algoBoxes[algoName] = $ele;
    }
    
    function refreshAlgoBox(algoName, score, info) {
        if(algoBoxes[algoName] === undefined) return false;
        
        var $ele = algoBoxes[algoName];
        $ele.find('h2').html(score);
        $ele.find('p:first').html(info);
    }
    
    // Öffentliches Interface
    return {
        initGraph : initGraph,
        draw : draw,
        getPoints : getPoints,
        initAlgoBox : initAlgoBox,
        refreshAlgoBox : refreshAlgoBox
    }
}
