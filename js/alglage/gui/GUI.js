/*
 * Hier wird sich um das Zeichnen und darstellen der Daten gek�mmert.
 */

/* Settings
--------
{
    containerId : '',       // Id des Containers
    dummyContainer : '',    // Id von Dummy-Box
    levelDummy : '',        // Selector von Dummy-Levelmenü
    pageHeader : '',        // Selector vom Page-Header
    highscoreDummy : '',    // Selector zum Highscore-Dummy
    maxX : 10,              // maximale X-Koordinate für Punkte
    maxY : 10,              // maximale Y-Koordinate für Punkte
    scoringAlgoName : '',   // Name des Algos der als Score genommen wird
    refreshTime : 50       // Zeit in der die Algorithmen neu ausgeführt werden
}

*/
var GUI = function(settings) {

    // Private Variablen
    var graph = new Graph([]); // Referenz auf den Graphen des AlgLageControllers
    var boardPoints = []; // Darstellung von graph.points
    var boardEdges = []; // Darstellung von graph.edges

    var $dummyBox = $('#' + settings.dummyContainer);
    var algoData = {}; // Alle Daten zu den Algos
    
    var $levDummy = $(settings.levelDummy);
    var $pageHeader = $(settings.pageHeader);
    var $hsDummy = $(settings.highscoreDummy);
    
    // aktuell besten Wert merken
    var bestVal = 0;
    var bestPoints;
    
    var timer;
    var isChecked;
    
    var activeAlgoBox = ''; // Name der activen algoBox
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
    
    // Highscore
    var $button = $('#scoreButton');
    $button.click(function() {
        if($(this).hasClass('disabled')) return false;
        
        $.publish('post-highscore');
    });
    
    var $scText = $('#scoreText');
    $scText.keyup(function() {
        var text = $(this).val();
        if(text != '' && $button.hasClass('disabled')) {
            $button.removeClass('disabled');
        }
        else if(text == ''){
            $button.addClass('disabled');
        }
    });
    
    if($scText.val() != '') {
        $button.removeClass('disabled');
    }
    
    // Checkbox für Berechnung
    var $checkbox = $('.alwCalc');
    isChecked = $checkbox.is(':checked');
    $checkbox.change(function(){
        isChecked = $checkbox.is(':checked');
    }); 
    
    // Rechteck für den Handlungsbereich
    var frameOpts = {
        straightFirst:false,
        straightLast:false,
        strokeColor:'#000',
        highlightStrokeColor : '#000',
        fixed : true
    };
    board.create('line',[[0, 0], [0, settings.maxY]], frameOpts);
    board.create('line',[[0, 0], [settings.maxX, 0]], frameOpts);
    board.create('line',[[settings.maxX, settings.maxY], [0, settings.maxY]], frameOpts);
    board.create('line',[[settings.maxX, settings.maxY], [settings.maxX, 0]], frameOpts);

    $("#btn_ShowGraph").click(function() { showGraph(); return false; }); // return false -> Sprung zum Seitenstart vermeiden
    $("#btn_GetGraph").click(function() {  getGraph(); return false; });
    $("#btn_showBest").click(function() {
        setPoints(bestPoints);
        return false;
    });
    
    function initGraph(gr) {
        graph = gr;
        
        // init aktuellen Bestwert
        bestVal = 0;
        bestPoints = JSON.parse(gr.toString()).points;
        
        _drawGraph();
    }

    function getPoints() {
        return graph.points;
    }

    function setPoints(points) {
        if(boardPoints.length != points.length) return false;
        for(var i = 0; i < points.length; i++) {
            var x = points[i][0];
            var y = points[i][1];i
            boardPoints[i].moveTo([x, y]);
            
            boardPoints[i].srcPoint.x = boardPoints[i].X();
            boardPoints[i].srcPoint.y = boardPoints[i].Y();
        }
        for(var i = 0; i < boardEdges.length; i++) {
            boardEdges[i].srcEdge.reload();
        }
        
        $.publish('points-change');
    }

    function _drawGraph() {
        // alle Punkte neuzeichnen
        for(var i = 0; i < boardPoints.length; i++) {
            board.removeObject(boardPoints[i]);
        }
        boardPoints = [];       
        for(var i = 0; i < boardEdges.length; i++) {
           p = board.removeObject(boardEdges[i]);
        }
        boardEdges = [];

        if(graph.points !== undefined) {


            for (var i = 0; i < graph.points.length; i++) {
                var p = board.create('point', [ graph.points[i].x, graph.points[i].y ], {withLabel:false});
                p.srcPoint = graph.points[i]; // Referenz auf zugrundeliegenden Punkt setzen
                boardPoints.push(p);
                
                p.on('mousedown', function() {
                    
                    var self = this;
                    
                    if(isChecked) {
                        clearInterval(timer);
                        timer = setInterval(function() {
                            self.srcPoint.x = self.X();
                            self.srcPoint.y = self.Y();
                            for(var i = 0; i < self.srcPoint.incidentEdges.length; i++) {
                                self.srcPoint.incidentEdges[i].reload();
                            }
                            
                            $.publish('points-change');
                        }, settings.refreshTime);
                    }
                    
                });
                
                p.on('mouseup', function() {
                    
                    if(isChecked) {
                        clearInterval(timer);
                    }
                    else {
                        this.srcPoint.x = this.X();
                        this.srcPoint.y = this.Y();
                        for(var i = 0; i < this.srcPoint.incidentEdges.length; i++) {
                            this.srcPoint.incidentEdges[i].reload();
                        }
                        
                        $.publish('points-change');
                    }
                    
                });

                // Bereich zum Verschieben der Punkte einschr�nken
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


            for (var i = 0; i < graph.edges.length; i++) {
                var pt1 = boardPoints[graph.points.indexOf(graph.edges[i].pt1)];
                var pt2 = boardPoints[graph.points.indexOf(graph.edges[i].pt2)];
                var line = board.create('line', [ pt1, pt2 ], {strokeWidth:5, strokeColor:'#ff0000', straightFirst:false, straightLast:false});
                line.srcEdge = graph.edges[i]; // Referenz auf zugrundeliegende Kante setzen
                boardEdges.push(line);

                line.on('mousedown', function(){
                    
                    var self = this;
                    
                    if(isChecked) {
                        clearInterval(timer);
                        timer = setInterval(function() {
                            self.point1.srcPoint.moveTo(self.point1.X(), self.point1.Y());
                            self.point2.srcPoint.moveTo(self.point2.X(), self.point2.Y());
        
                            // alle inzidenten Kanten updaten (die gemeinsame Kante beider Punkte wird doppelt geupdatet)
                            var inc1 = self.srcEdge.pt1.incidentEdges;
                            var inc2 = self.srcEdge.pt2.incidentEdges;
        
                            for(var i = 0; i < inc1.length; i++) {
                                inc1[i].reload();
                            }
                            for(var i = 0; i < inc2.length; i++) {
                                inc2[i].reload();
                            }
                            
                            $.publish('points-change');
                        }, settings.refreshTime);
                    }
                });
                
                line.on('mouseup', function() {
                    
                    if(isChecked) {
                        clearInterval(timer);
                    }
                    else {
                        this.point1.srcPoint.moveTo(this.point1.X(), this.point1.Y());
                        this.point2.srcPoint.moveTo(this.point2.X(), this.point2.Y());
    
                        // alle inzidenten Kanten updaten (die gemeinsame Kante beider Punkte wird doppelt geupdatet)
                        var inc1 = this.srcEdge.pt1.incidentEdges;
                        var inc2 = this.srcEdge.pt2.incidentEdges;
    
                        for(var i = 0; i < inc1.length; i++) {
                            inc1[i].reload();
                        }
                        for(var i = 0; i < inc2.length; i++) {
                            inc2[i].reload();
                        }
                        
                        $.publish('points-change');
                    }
                });
                
                // Kanten bleiben steif, wenn sie den Rand beruehren
                line.on('drag', function() {
                    var tmp = 0;
                    if((tmp = this.point1.X())< 0) { 
                        this.point1.moveTo([0,this.point1.Y()]);
                        this.point2.moveTo([this.point2.X()-tmp, this.point2.Y()])
                    }
                    if((tmp = this.point2.X())< 0) { 
                        this.point2.moveTo([0,this.point2.Y()]);
                        this.point1.moveTo([this.point1.X()-tmp, this.point1.Y()])
                    }
                    if((tmp = this.point1.Y())< 0) { 
                        this.point1.moveTo([this.point1.X(),0]);
                        this.point2.moveTo([this.point2.X(), this.point2.Y()-tmp])
                    }
                    if((tmp = this.point2.Y())< 0) { 
                        this.point2.moveTo([this.point2.X(),0]);
                        this.point1.moveTo([this.point1.X(), this.point1.Y()-tmp])
                    }
                    if((tmp = this.point1.X()-settings.maxX) > 0) {
                        this.point1.moveTo([settings.maxX,this.point1.Y()]);
                        this.point2.moveTo([this.point2.X()-tmp,this.point1.Y()]);
                    }
                    if((tmp = this.point2.X()-settings.maxX) > 0) {
                        this.point2.moveTo([settings.maxX,this.point2.Y()]);
                        this.point1.moveTo([this.point1.X()-tmp,this.point1.Y()]);
                    }
                    if((tmp = this.point1.Y()-settings.maxY) > 0) {
                        this.point1.moveTo([this.point1.X(),settings.maxY]);
                        this.point2.moveTo([this.point2.X(),this.point2.Y()-tmp]);
                    }
                    if((tmp = this.point2.Y()-settings.maxY) > 0) {
                        this.point2.moveTo([this.point2.X(),settings.maxY]);
                        this.point1.moveTo([this.point1.X(),this.point1.Y()-tmp]);
                    }
                });
            }
        }
    }

    function overdraw(obj, algoName, color) {
        eraseAnnotations(algoName);
        draw(obj, algoName, color);
    }


    // mit draw() können unabhängig vom Graphen Annotations gezeichnet werden
    // durch die Angabe von algoName werden die in obj übergebenen Annotations
    // eine eigene Lage gezeichnet
    function draw(obj, algoName, color) {
        if(obj === undefined) return false;
        
        if(obj.points !== undefined) {
            for(var i = 0; i < obj.points.length; i++) {
                var point = board.create('point', [obj.points[i].x, obj.points[i].y] , {
                                        withLabel:false,
                                        strokeColor:color,
                                        fillColor:color,
                                        fixed:true,
                                        highlightStrokeColor : color});
                algoData[algoName].jsxObjects.push(point);
            }
        }
        if(obj.lines !== undefined) {
            for(var i = 0; i < obj.lines.length; i++) {
                var line = board.create('line', [
                                    [obj.lines[i].pt1.x, obj.lines[i].pt1.y],
                                    [obj.lines[i].pt2.x, obj.lines[i].pt2.y] ], {
                                        fixed:true,
                                        strokeColor:color,
                                        highlightStrokeColor : color});
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
                                     straightLast:false,
                                     fixed:true,
                                     strokeColor:color,
                                     highlightStrokeColor : color});
                algoData[algoName].jsxObjects.push(line);
            }
        }
        if(obj.circles !== undefined) {
            for(var i = 0; i < obj.circles.length; i++) {
                var p = obj.circles[i].point;
                var r = obj.circles[i].radius;
                var circle = board.create('circle', [[p.x, p.y],[p.x, p.y + r]], {
                                    strokeWidth : 2,
                                    highlightStrokeColor : color,
                                    fixed : true,
                                    strokeColor:color});
                algoData[algoName].jsxObjects.push(circle);
            }
        }
        if(obj.angles !== undefined) {
            for(var i = 0; i < obj.angles.length; i++) {
                var A = board.create('point', [obj.angles[i].a.x, obj.angles[i].a.y], {visible:false});
                var B = board.create('point', [obj.angles[i].b.x, obj.angles[i].b.y], {visible:false});
                var C = board.create('point', [obj.angles[i].c.x, obj.angles[i].c.y], {visible:false});
                var angle = board.create('angle', [B, A, C], {
                                    type:'sector',
                                    orthoType:'sector',
                                    orthoSensitivity:1,
                                    radius:1,
                                    withLabel:false,
                                    strokeColor:color,
                                    highlightStrokeColor : color});
                algoData[algoName].jsxObjects.push(angle);
            }
        }
    }   

    // l�scht alle gezeichneten Markierungen
    function eraseAllAnnotations() {
        for(var k in algoData) {
            var jsxo = algoData[k].jsxObjects;
            if(jsxo !== undefined) {
                board.removeObject(jsxo);
                algoData[k].jsxObjects = [];
            }
        }
    }

    // l�scht gezeichnete Markierung von einem Algo
    function eraseAnnotations(algoName) {
        var jsxo = algoData[algoName].jsxObjects;
        if(jsxo !== undefined) {
            board.removeObject(jsxo);
            algoData[algoName].jsxObjects = [];
        }
    }

    function initAlgoBox(algoName, color) {
        var $ele = $dummyBox.clone().attr('id', algoName);
        
        if(algoName === settings.scoringAlgoName) {
            $ele.addClass('iamscoring');
        }
        
        var $btn = $ele.find('a.btn');
        $btn.click(function() {
            var annots = algoData[algoName].annotations;
            if(!algoData[algoName].isActive) {
                draw(annots, algoName, color);
                $btn.addClass('btn-success');
                algoData[algoName].isActive = true;
                $.publish('points-change');
            }
            else {
                eraseAnnotations(algoName);
                $btn.removeClass('btn-success');
                algoData[algoName].isActive = false;
                $ele.find('.score').html('-');
            }
            return false;
        });

        algoData[algoName] = {};
        algoData[algoName].jsxObjects = [];
        algoData[algoName].algoBox = $ele;
        $ele.find('.aname').html(algoName);
        $ele.find('.colorSpan').css('background', color);
        $dummyBox.before($ele);
    }
    
    function setAlgoBoxLoading(algoName) {
        if(algoData[algoName] === undefined) return false;
        
        var $ele = algoData[algoName].algoBox;
        $ele.addClass('loading');
    }
    
    function refreshAlgoBox(algoName, score, info, annots, color) {
        if(algoData[algoName] === undefined) return false;
        
        if(algoName === settings.scoringAlgoName) {
            checkTmpBestVal(score);
        }
        
        if(algoData[algoName].isActive) {
            eraseAnnotations(algoName);
            draw(annots, algoName, color);
        }

        algoData[algoName].annotations = annots;

        var $ele = algoData[algoName].algoBox;
        $ele.removeClass('loading');
        $ele.find('.aname').html(algoName);
        $ele.find('.score').html(score);
        //$ele.find('p:first').html(info);
    }
    
    function addLevelToNav(levelname) {
        var $ele = $levDummy.clone().removeClass('dummy');
        $ele.find('a').text(levelname).attr('href', '#'+levelname);
        $levDummy.before($ele);
    }
    
    function changePageHeader(text) {
        $pageHeader.text(text);
    }
    
    function showHighscore(data) {
        clearHighscore();
        
        for(var i = 0; i < data.length; i++) {
            var $d = $hsDummy.clone().removeClass('dummy');
            var $t = $d.find('td');
            $t.eq(0).text(i+1);
            $t.eq(1).text(data[i].name);
            $t.eq(2).text(data[i].score);
            $t.eq(3).find('a').data('points', data[i].points).click(function() {
                var pnts = JSON.parse($(this).data('points'));
                setPoints(pnts);
                return false;
            });
            
            $hsDummy.before($d);
        }
    }

    function clearHighscore() {
        $hsDummy.parent().find('tr').not('.dummy').remove();
    }

    // Macht die DOM-Elemente für den Highscore sichtbar / unsichtbar
    function setHighscoreVisibility(visible) {
        var $hs = $('table.highscore').parents('.row');
        var $sc = $('#scoreText').parents('.span4');

        if(visible === true) {
            $hs.show();
            $sc.show();
        }
        else {
            $hs.hide();
            $sc.hide();
        }
    }

    // der aktuell angezeigte Graph wird zu in der GraphTextArea genannten textarea serialisiert dargestellt
    function showGraph() {
        $('textarea#GraphTextArea').val(graph.toString());
    }
    
    function getGraph() {
    	this.counter = ++this.counter || 0;
    	
    	// Falls erster Custom-Graph geaddet wird
    	if(this.counter == 0) {
    	    $levDummy.before('<li class="divider"></li>');
    	}
    	
    	var name = 'Custom '+this.counter;
    	var gra = parseGraph($('textarea#GraphTextArea').val());
    	
    	if(gra === null || gra === undefined) return false;
    	
    	alc.addLevel(name, gra);
    	window.location.hash = name;
    }
    
    function isActive(algoName) {
        return algoData[algoName].isActive;
    }
    
    function checkTmpBestVal(val) {
        if(isNaN(val)) return false;
        
        if(val > bestVal) {
            $('#tmpBestVal').val(val);
            bestPoints = JSON.parse(graph.toString()).points;
            bestVal = val;
        }
    }
    
    // �ffentliches Interface
    return {
        initGraph : initGraph,
        overdraw : overdraw,
        draw : draw,
        getPoints : getPoints,
        initAlgoBox : initAlgoBox,
        refreshAlgoBox : refreshAlgoBox,
        eraseAllAnnotations : eraseAllAnnotations,
        setAlgoBoxLoading : setAlgoBoxLoading,
        addLevelToNav : addLevelToNav,
        changePageHeader : changePageHeader,
        showHighscore : showHighscore,
        clearHighscore : clearHighscore,
        isActive : isActive,
        setHighscoreVisibility : setHighscoreVisibility
    }
}
