importScripts('../core/Core.js');

self.onmessage = function(event) {
    var points = event.data.graph.points;

    // durch die Serialisierung in eine Nachricht haben die Punkte ihre
    // Methoden verloren. Daher zurückcasten!
    points = Vector.cast(points);

    calculate(points);
};

// Dieser Algorithmus guckt, ob mehr als drei Punkte auf einem Kreis
// liegen und gibt diese Kreise dann zurück
function calculate(points) {

    var retCircles = []; // Kreise die zurückgegeben werden

    var xMax = -1;
    var yMax = -1;
    
    for(var i = 0; i < points.length; i++) {
        var p = points[i];
        if(p.x > xMax) {
            xMax = p.x;
        }
        if(p.y > yMax) {
            yMax = p.y;
        }
    }

    var r = 0.5;
    
    var precision = 10;
    
    // Berechnete Wert
    
    var w = xMax * precision;
    var h = yMax * precision;

    // Ergebnisswerte
    var bestRad;
    var bestX;
    var bestY;
    
    var nPoints = [];
    for(var i = 0; i < points.length; i++) {
        var rx = points[i].x * precision;
        var ry = points[i].y * precision;
        
        nPoints.push({
            x : rx,
            y : ry
        });
    }
    
    // Radien durchprobieren
    for(var b = 0; b < 80; b++) {
        var nRadius = r * precision;
        
        // Array initialisieren
        var arr = {};
    
        // Alle Kreise hinzufügen
        for(var i = 0; i < nPoints.length; i++) {
            var p = nPoints[i];
            arr = addCircleToArray(arr, p.x, p.y, nRadius, w, h);
        }
        
        // Maximum suchen
        for(var k in arr) {
            if(arr[k] > 3) {
                bestRad = nRadius / precision;
                var splt = k.split("|");
                bestX = parseInt(splt[0]) / precision;
                bestY = parseInt(splt[1]) / precision;
                
                retCircles.push(new Circle(new Point(bestX, bestY), bestRad));
            }
        }
        
        r += 0.1;
    }
    
    var infoText;
    if(retCircles.length == 0) {
        infoText = 'Es befinden sich nicht mehr als 3 Punkte auf einem Kreis und somit ist nach diesem '
            + 'Kriterium die allgemeine Lage gegeben.<br>'
            + 'Der Score berechnet sich aus den Abständen aller Punkte, die annähernd auf einem '
            + 'Kreis liegen.'
    }
    else {
        infoText = 'Es befinden sich ' + retCircles.length + ' mal mehr als 3 Punkte auf einem Kreis und somit ist '
            + 'nach diesem Kriterium die allgemeine Lage <strong>nicht</strong> gegeben.<br>'
            + 'Der Score berechnet sich aus den Abständen aller Punkte, die annähernd auf einem '
            + 'Kreis liegen.'
    }
    
    self.postMessage({
        score : retCircles.length,
        annotations : {
            'circles' : retCircles
        },
        name : 'circleCheck',
        info : infoText
    });
};

// 'Zeichnet' ein Kreis ins Array bzw. addiert 1 zu jedem Punkt auf dem Kreis
function addCircleToArray(arr, x, y, r, width, height) {
    var check = {};
    var steps = 10 * r;
    
    for(var i = 0; i < steps; i++) {
        tx = Math.round(x + r * Math.cos(2 * Math.PI * i / steps));
        ty = Math.round(y + r * Math.sin(2 * Math.PI * i / steps));
        
        var ck = tx + "|" + ty;
        if(check[ck] === undefined && tx < width && tx > 0 && ty < height && ty > 0) {
            var key = tx + "|" + ty;
            if(arr[key] === undefined) arr[key] = 0;
            arr[key]++;
            check[ck] = true;
        }
    }
    
    return arr;
}
