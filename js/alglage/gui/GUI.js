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
    var annotations = []; // Graphische Hinweisobjekte

    var $dummyBox = $('#' + settings.dummyContainer);
    var algoBoxes = {};
    
    // JSXGraph-Board initialisieren
    var board = JXG.JSXGraph.initBoard(settings.containerId, {
        boundingbox: [0, settings.maxY, settings.maxX, 0],
        axis : true,
        showCopyright : false,
        /* zoom : {
            wheel: true,
            needShift: false
        },
        pan : {
            needShift: false,
            enabled: true
        } */
    });
    
    function initGraph(graph) {
        points = graph.getPoints();
        edges = graph.getEdges();
        _drawGraph();
    }

    function getPoints() {
        return points;
    }

    function _drawGraph() {
        if(points !== undefined) {
            // alle Punkte neuzeichnen
            for(var i = 0; i < boardPoints.length; i++) {
                board.removeObject(boardPoints[i]);
            }
            boardPoints = [];

            for (var i = 0; i < points.length; i++) {
                var p = board.create('point', [ points[i].x, points[i].y ], {withLabel:false});
                //var src = points[i];
                //p.srcPoint = src;
                p.srcPoint = points[i];
                boardPoints.push(p);

                p.on('mouseup', function(){
                    this.srcPoint.x = this.X();
                    this.srcPoint.y = this.Y();
                    $.publish('points-change');
                });

                // Bereich zum Verschieben der Punkte einschränken
                p.on('drag', function(){
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
                var line = board.create('line', [ pt1, pt2 ], {strokeWidth:5, strokeColor:'#ff0000', straightFirst:false, straightLast:false});
                boardEdges.push(line);

                line.on('mouseup', function(){
                    $.publish('points-change');
                });
                line.on('drag', function() {
                    // TODO implementieren, dass auch Linien nicht aus dem Feld herausgeschoben werden können
                });
            }
        }
    }

    function overdraw(obj) {
        _eraseAnnotations();
        draw(obj);
    }

    // mit draw() kann unabhängig vom Graphen gezeichnet werden
    function draw(obj) {
        // TODO Annotations undraggable machen
        if(obj.lines !== undefined) {
            for(var i = 0; i < obj.lines.length; i++) {
                var line = board.create('line', [
                                    [obj.lines[i].pt1.x, obj.lines[i].pt1.y],
                                    [obj.lines[i].pt2.x, obj.lines[i].pt2.y] ] );
                annotations.push(line);
            }
        }
        if(obj.lineSegment !== undefined) {
            for(var i = 0; i < obj.lineSegment.length; i++) {
                var pt1 = obj.lineSegment[i].pt1;
                var pt2 = obj.lineSegment[i].pt2;
                var line = board.create('line', [
                                    [pt1.x, pt1.y],
                                    [pt2.x, pt2.y] ],
                                    {straightFirst:false,
                                     straightLast:false});
                annotations.push(line);
            }
        }
        if(obj.circles !== undefined) {
            for(var i = 0; i < obj.circles.length; i++) {
                var p = obj.circles[i].point;
                var r = obj.circles[i].radius;
                var circle = board.createElement('point',[p.x, p.y], {
                    withLabel: false, 
                    face: 'circle', 
                    size: r,
                });
                annotations.push(circle);
            }
        }
        if(obj.areas !== undefined) {
            console.log("drawing areas not yet implemented");
        }
    }   

    // löscht alle gezeichneten Markierungen
    function _eraseAnnotations() {
        for(var i = 0; i < annotations.length; i++) {
            board.removeObject(annotations[i]);
        }
        annotations = [];
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
        overdraw : overdraw,
        draw : draw,
        getPoints : getPoints,
        initAlgoBox : initAlgoBox,
        refreshAlgoBox : refreshAlgoBox
    }
}
