/*
 * Hier wird sich um das Zeichnen und darstellen der Daten gekümmert.
 */

/*
Settings
--------
{
    containerId : '',       // Id des Containers
    maxX : 10,              // maximale X-Koordinate für Punkte
    maxY : 10               // maximale Y-Koordinate für Punkte
}

*/
var GUI = function(settings) {
        
    // Private Variablen
    var points = [];
    
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
    
    // Öffentliches Interface
    return {
        drawPoints : drawPoints,
        getPoints : getPoints
    }
}