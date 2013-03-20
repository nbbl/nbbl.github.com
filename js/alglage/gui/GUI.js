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
    var graph = new Graph([], []);
    var boardPoints = []; // Darstellung von graph.points
    var boardEdges = []; // Darstellung von graph.edges

    var $dummyBox = $('#' + settings.dummyContainer);
    var algoData = {}; // Alle Daten zu den Algos

    var activeAlgoBox = ''; // Name der activen algoBox
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
    
    function initGraph(gr) {
        graph = gr;
        _drawGraph();
    }

    function getPoints() {
        return graph.points;
    }

    function _drawGraph() {
        if(graph.points !== undefined) {
            // alle Punkte neuzeichnen
            for(var i = 0; i < boardPoints.length; i++) {
                board.removeObject(boardPoints[i]);
            }
            boardPoints = [];

            for (var i = 0; i < graph.points.length; i++) {
                var p = board.create('point', [ graph.points[i].x, graph.points[i].y ], {withLabel:false});
                p.srcPoint = graph.points[i];
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

        if(graph.edges !== undefined) {
            // alle Kanten neuzeichnen
            for(var i = 0; i < boardEdges.length; i++) {
                p = board.removeObject(boardEdges[i]);
            }

            for (var i = 0; i < graph.edges.length; i++) {
                var pt1 = boardPoints[graph.points.indexOf(graph.edges[i].pt1)];
                var pt2 = boardPoints[graph.points.indexOf(graph.edges[i].pt2)];
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

    function overdraw(obj, algoName) {
        eraseAnnotations();
        draw(obj, algoName);
    }

    // mit draw() können unabhängig vom Graphen Annotations gezeichnet werden
    // durch die Angabe von algoName werden die in obj übergebenen Annotations
    // eine eigene Lage gezeichnet
    function draw(obj, algoName) {
        // TODO Annotations undraggable machen
        if(obj.points !== undefined) {
            for(var i = 0; i < obj.points.length; i++) {
                var point = board.create('point', [obj.points[i].x, obj.points[i].y] , {withLabel:false});
                algoData[algoName].jsxObjects.push(point);
            }
        }
        if(obj.lines !== undefined) {
            for(var i = 0; i < obj.lines.length; i++) {
                var line = board.create('line', [
                                    [obj.lines[i].pt1.x, obj.lines[i].pt1.y],
                                    [obj.lines[i].pt2.x, obj.lines[i].pt2.y] ] );
                algoData[algoName].jsxObjects.push(line);
            }
        }
        if(obj.lineSegments !== undefined) {
            for(var i = 0; i < obj.lineSegments.length; i++) {
                var pt1 = obj.lineSegments[i].pt1;
                var pt2 = obj.lineSegments[i].pt2;
                var line = board.create('line', [
                                    [pt1.x, pt1.y],
                                    [pt2.x, pt2.y] ],
                                    {straightFirst:false,
                                     straightLast:false});
                algoData[algoName].jsxObjects.push(line);
            }
        }
        if(obj.circles !== undefined) {
            for(var i = 0; i < obj.circles.length; i++) {
                var p = obj.circles[i].point;
                var r = obj.circles[i].radius;
                var circle = board.create('circle', [[p.x, p.y],[p.x, p.y + r]], {strokeWidth:2, highlightStrokeColor : 'blue',});
                algoData[algoName].jsxObjects.push(circle);
            }
        }
        if(obj.areas !== undefined) {
            console.log("drawing areas not yet implemented");
        }
    }   

    // löscht alle gezeichneten Markierungen
    function eraseAllAnnotations() {
        for(var k in algoData) {
            var jsxo = algoData[k].jsxObjects;
            if(jsxo !== undefined) {
                board.removeObject(jsxo);
                algoData[k].jsxObjects = [];
            }
        }
    }

    // löscht gezeichnete Markierung von einem Algo
    function eraseAnnotations(algoName) {
        var jsxo = algoData[algoName].jsxObjects;
        if(jsxo !== undefined) {
            board.removeObject(jsxo);
            algoData[algoName].jsxObjects = [];
        }
    }

    function initAlgoBox(algoName) {
        var $ele = $dummyBox.clone().attr('id', algoName);
        
        var $btn = $ele.find('a.btn');
        $btn.click(function() {
            var annots = algoData[algoName].annotations;
            if(!algoData[algoName].isActive) {
                draw(annots, algoName);
                $btn.addClass('btn-success');
                algoData[algoName].isActive = true;
            }
            else {
                eraseAnnotations(algoName);
                $btn.removeClass('btn-success');
                algoData[algoName].isActive = false;
            }
            return false;
        });
        
        algoData[algoName] = {};
        algoData[algoName].jsxObjects = [];
        algoData[algoName].algoBox = $ele;
        $dummyBox.before($ele);
    }
    
    function setAlgoBoxLoading(algoName) {
        if(algoData[algoName] === undefined) return false;
        
        var $ele = algoData[algoName].algoBox;
        $ele.addClass('loading');
    }
    
    function refreshAlgoBox(algoName, score, info, annots) {
        if(algoData[algoName] === undefined) return false;
        
        if(algoData[algoName].isActive) {
            draw(annots, algoName);
        }

        algoData[algoName].annotations = annots;

        var $ele = algoData[algoName].algoBox;
        $ele.removeClass('loading');
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
        refreshAlgoBox : refreshAlgoBox,
        eraseAllAnnotations : eraseAllAnnotations,
        setAlgoBoxLoading : setAlgoBoxLoading
    }
}
