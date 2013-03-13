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
    var points = [];
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
    
    function getPoints() {
        return points;
    }
    
    function drawPoints(pnts) {
        points = pnts;
        
        for(var i = 0; i < pnts.length; i++) {
            var pnt = pnts[i];
            var p = board.create('point', [pnt.x, pnt.y], {
                withLabel: false
            });
            
            p.alcIndex = i;
            
            p.on('mouseup', function(){
                var index = this.alcIndex;
                points[index] = new Point(this.X(), this.Y());
                $.publish('points-change');
            });
            
            p.on('drag', function(){
                if(this.X() < 0) this.moveTo([0, this.Y()]);
                if(this.X() > settings.maxX) this.moveTo([settings.maxX, this.Y()]);
                if(this.Y() < 0) this.moveTo([this.X(), 0]);
                if(this.Y() > settings.maxY) this.moveTo([this.X(), settings.maxY]);
            });
            
        }
        
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
        drawPoints : drawPoints,
        getPoints : getPoints,
        initAlgoBox : initAlgoBox,
        refreshAlgoBox : refreshAlgoBox
    }
}