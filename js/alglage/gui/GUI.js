/*
 * Hier wird sich um das Zeichnen und darstellen der Daten gekümmert.
 */

var GUI = function(containerId, w, h) {
        
    // Private Variablen
    var points = [];
    
    // Canvas initialisieren
    var stage = new Kinetic.Stage({
        container: containerId,
        width: w,
        height: h
    });
    
    function getPoints() {
        return points;
    }
    
    function drawPoints(pnts) {
        points = pnts;
        
        var layer = new Kinetic.Layer();
        for(var i = 0; i < pnts.length; i++) {
            var pnt = pnts[i];
            var c = new Kinetic.Circle({
                x: pnt.x,
                y: pnt.y,
                radius: 10,
                fill: 'red',
                stroke: 'black',
                strokeWidth: 1,
                draggable: true
            });
            
            c.alcIndex = i;
            
            c.on('dragend', function(evt) {
                var index = this.alcIndex;
                points[index] = new Point(this.getX(), this.getY());
                $.publish('points-change');
            });
            
            layer.add(c);
        }
        stage.add(layer);
    }
    
    // Öffentliches Interface
    return {
        drawPoints : drawPoints,
        getPoints : getPoints
    }
}