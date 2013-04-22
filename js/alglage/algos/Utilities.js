function randomPoints(amount, maxX, maxY) {
    var points = [];
    for(i = 0; i < amount; i++) {
        var x = Math.random() * maxX;
        var y = Math.random() * maxY;
        points.push(new Point(x, y));
    }
    return points;
}


function randomGraph(amountPoints, amountEdges, maxX, maxY) {
   
    var pts = randomPoints(amountPoints, maxX, maxY);
    var edges = [];
    var p1, p2;
    
    var doubleCheck = {}; // Zur Überprüfung ob Kante schon existiert
    
    for(var i = 0; i < amountEdges; i++) {
        // eine neue Kante auslosen
        do {
            // zwei verschiedene Punkte auslosen
            p1 = pts[Math.floor(Math.random() * amountPoints)];
            do {
                p2 = pts[Math.floor(Math.random() * amountPoints)];
            } while(p1===p2)
            
        } while(doubleCheck[p1 + '&' + p2] || doubleCheck[p2 + '&' + p1])
        edges.push(new Edge(p1, p2));
        doubleCheck[p1 + '&' + p2] = true;
        doubleCheck[p2 + '&' + p1] = true;
    }

    return new Graph(edges);
}


Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};


// source: http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
function randomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
         color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}

// Liste von HTML-Farben für die Einfärbung der Annotations
annotationsColors = ["#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF", "#FF6600", "#9933CC"];
