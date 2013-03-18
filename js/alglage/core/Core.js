/*
 * Hier kommt alles rein, was überall Verfügbar sein muss (auch in den 'Web Workers')
 */

var ORIGIN = new Vector(0,0);  // Ursprungspunkt
var SPATIAL_TOLERANCE = 1e-10; // Die Toleranz bei Abständen zu Strecken & Geraden
var ANGULAR_TOLERANCE = undefined; // yet to be defined.

function approx(skalar1,skalar2){
    return Math.abs(skalar1 - skalar2) < SPATIAL_TOLERANCE;
}

// Vector Klasse

function Vector(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Vector.prototype.x = null;
Vector.prototype.y = null;

Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
};

Vector.prototype.abs = function() {
    return this.distance(ORIGIN);
};

Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y);
};

Vector.prototype.degreesTo = function(v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    var angle = Math.atan2(dy, dx);
    // radians
    return angle * (180 / Math.PI);
    // degrees
};

Vector.prototype.distance = function(v) {
    var x = this.x - v.x;
    var y = this.y - v.y;
    return Math.sqrt(x * x + y * y);
};

Vector.prototype.equals = function(toCompare) {
    return approx(this.x,toCompare.x) && approx(this.y,toCompare.y);
};

Vector.prototype.interpolate = function(v, f) {
    return new Vector((this.x + v.x) * f, (this.y + v.y) * f);
};

Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.normalize = function(thickness) {
    var l = this.length();
    this.x = this.x / l * thickness;
    this.y = this.y / l * thickness;
};

Vector.prototype.orbit = function(ORIGIN, arcWidth, arcHeight, degrees) {
    var radians = degrees * (Math.PI / 180);
    this.x = ORIGIN.x + arcWidth * Math.cos(radians);
    this.y = ORIGIN.y + arcHeight * Math.sin(radians);
};

Vector.prototype.offset = function(dx, dy) {
    this.x += dx;
    this.y += dy;
};

Vector.prototype.substract = function(v) {
    return new Vector(this.x - v.x, this.y - v.y);
};

Vector.prototype.toString = function() {
    return "(x=" + this.x + ", y=" + this.y + ")";
};

Vector.interpolate = function(pt1, pt2, f) {
    return new Vector((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
};

Vector.polar = function(len, angle) {
    return new Vector(len * Math.sin(angle), len * Math.cos(angle));
};

Vector.distance = function(pt1, pt2) {
    var x = pt1.x - pt2.x;
    var y = pt1.y - pt2.y;
    return Math.sqrt(x * x + y * y);
};

Vector.skalarMult = function(s,v){
    return new Vector(v.x*s,v.y*s);
};

Vector.skalarProd = function(v1,v2){
    return v1.x*v2.x + v1.y*v2.y;
};

Vector.cast = function(p) {
    if( Object.prototype.toString.call(p) === '[object Array]' ) {
        for(var i = 0; i < p.length; i++) {
            p[i].__proto__ = Point.prototype;
        }   
    }
    else {
        p.__proto__ = Point.prototype;
    }
    return p;
};

//Punkt als Alias fuer einen Vektor
var Point = Vector; 

// Kanten Prototyp

function Edge(pt1,pt2){

    if (pt1.x <= pt2.x){
	this.pt1 = pt1;
	this.pt2 = pt2;
    } else {
	this.pt1 = pt2;
	this.pt2 = pt1;
    }
    
    this.normal = Vector.skalarMult(1/Math.sqrt(Math.pow(pt2.y-pt1.y,2)+Math.pow(pt1.x-pt2.x,2)),
				    (function(v) { return new Vector(v.y,-v.x) }) (pt1.substract(pt2)));
    this.dist = Vector.skalarProd(this.normal,pt1);
  
};

Edge.prototype.length = function() {
    return this.pt1.distance(this.pt2);
};

/* diese beiden Funktionen sind nötig da Punkte nicht zwingend in der
 * Sortierung zur Initialisierung bleiben. 
 *
 * Gleiche X-Koordinaten müssen im vorhinein ausgeschlossen werden!
 */
Edge.prototype.getLeft = function(){
    if (this.pt1.x === this.pt2.x) return null;
    else if (this.pt1.x < this.pt2.x) return this.pt1;
    else return this.pt2;
};

Edge.prototype.getRight = function(){
    if (this.pt1.x === this.pt2.x) return null;
    else if (this.pt1.x < this.pt2.x) return this.pt2;
    else return this.pt1;
};

Edge.prototype.distanceToLine = function(pt){
    return Math.abs(Vector.skalarProd(pt,this.normal) - this.dist);
};

Edge.prototype.lineContains = function(pt){ //enthält die Gerade zur Kante den Punkt?
    return this.distanceToLine(pt) < SPATIAL_TOLERANCE; 
};

Edge.prototype.contains = function(pt){ //enthält die Kante den Punkt?
    return this.lineContains(pt) && 
	approx(this.getLeft().distance(pt) + this.getRight().distance(pt), this.length());
};

/*
 *
 */
Edge.prototype.lineIntersection = function(edge){ //der Schnittpunkt der beiden Geraden. (Lösung des LGS der HNFs)
    if (this.normal.equals(edge.normal) || this.normal.equals(-edge.normal)) {
	if (approx(this.dist,edge.dist)) return "identical_lines";
	return "parallel_lines"; 
    }
    var y = (this.normal.x * edge.dist     - edge.normal.x * this.dist) / 
	    (this.normal.x * edge.normal.y - this.normal.y * edge.normal.x);
    var x = (this.dist - this.normal.y * y) / this.normal.x;
    if (!isFinite(x) || !isFinite(y)) return null; 
    return new Point(x,y);
}; 

Edge.prototype.edgeIntersection = function(edge){ //der Schnittpunkt der beiden Kanten.
    var potIntsec = this.lineIntersection(edge);
    if (potIntsec === "parallel_lines") return null; //kein Schnittpunkt
    if (potIntsec === "identical_lines") return "identical_lines"; //sollte nicht passieren
    if (potIntsec !== null && edge.contains(potIntsec) && this.contains(potIntsec)) return potIntsec;
    return null; //kein Schnittpunkt
};

function Graph(points, edges) {
    this.points = points;
    this.edges = edges;
};
Graph.prototype.getPoints = function() {
    return this.points;
};
Graph.prototype.getEdges = function() {
    return this.edges;
};
Graph.prototype.setGraph = function(points, edges) {
    this.points = points;
    this.edges = edges;
}
Graph.prototype.setPoints = function(points) {
    this.points = points;
}
Graph.prototype.setEdges = function(edges) {
    this.edges = edges;
}

Graph.prototype.addPoint = function(point) {
    if(point === undefined) {
        console.log('cannot add undefined point to graph');
    }
    else {
        this.points.push(point);
    }
};

Graph.prototype.removePoint = function(point) {
    if(point === undefined) {
        console.log('cannot remove undefined point from graph');
    }
    else {
        for(var i = 0; i < this.points.length; i++) {
            if(this.points[i].x === point.x && this.points[i].y === point.y) {
                this.points.splice(i, 1);
            }
        }
    }
};

Graph.prototype.addEdge = function(edge) {
    if(edge === undefined || edge.pt1 === undefined || edge.pt2 === undefined) {
        console.log('cannot add undefined edge to graph');
    }
    else {
        // was soll passieren, wenn man einen Punkt löscht, der in einer noch
        // bestehenden Kante enthalten ist?
        this.edges.push(edge);
    }
};

Graph.prototype.removeEdge = function(edge) {
    if(edge === undefined || edge.pt1 === undefined || edge.pt2 === undefined) {
        console.log('cannot remove undefined edge from graph');
    }
    else {
        for(var i = 0; i < this.edges.length; i++) {
            if(this.edges[i].pt1.equals(edge.pt1) && this.edges[i].pt2.equals(edge.pt2)) {
                this.edges.splice(i, 1);
                return;
            }
        }
    }
};

/* 
*  Kreis-Klasse
*/

function Circle(point, radius) {
    this.point = point;
    this.radius = radius;
}
