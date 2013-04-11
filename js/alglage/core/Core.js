/*
 * Hier kommt alles rein, was überall Verfügbar sein muss (auch in den 'Web Workers')
 */

var ORIGIN = new Vector(0,0);  // Ursprungspunkt
var SPATIAL_TOLERANCE = 1e-10; // Die Toleranz bei Abständen zu Strecken & Geraden
var ANGULAR_TOLERANCE = undefined; // yet to be defined.

function approx(skalar1,skalar2){ return Math.abs(skalar1 - skalar2) < SPATIAL_TOLERANCE;
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

Vector.prototype.inv = function() {
    return new Vector(-this.x, -this.y);
};

Vector.prototype.add = function(v) {
    return new Vector(this.x + v.x, this.y + v.y);
};

// Vector.prototype.degreesTo = function(v) {
//     var dx = this.x - v.x;
//     var dy = this.y - v.y;
//     var angle = Math.atan2(dy, dx);
//     // radians
//     return angle * (180 / Math.PI);
//     // degrees
// };

Vector.prototype.degreesTo = function(v) { //nur für Winkel <= PI verwenden!
    return Math.acos(Vector.skalarProd(v,this)/(this.length() * v.length()));
};

Vector.prototype.distance = function(v) {
    var x = this.x - v.x;
    var y = this.y - v.y;
    return Math.sqrt(x * x + y * y);
};

Vector.prototype.equals = function(toCompare) {
    return toCompare!==undefined &&  approx(this.x,toCompare.x) && approx(this.y,toCompare.y);
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

Vector.prototype.moveTo = function(coordX, coordY) {
  this.x = coordX;
  this.y = coordY;
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
    if(p === undefined) {
        return false;
    }
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

Point.prototype.isAdjacentTo = function(point) {
    if(this.incidentEdges === undefined) return false;
    if(point.incidentEdges === undefined) return false;

    var edges = this.incidentEdges;
    for(var i = 0; i < edges.length; i++) {
        if(edges[i].getAdjacent(this).equals(this)) return true;
    }
    return false;
};

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

Edge.prototype.reload = function() {
    this.normal = Vector.skalarMult(1/Math.sqrt(Math.pow(this.pt2.y-this.pt1.y,2)+Math.pow(this.pt1.x-this.pt2.x,2)),
				    (function(v) { return new Vector(v.y,-v.x) }) (this.pt1.substract(this.pt2)));
    this.dist = Vector.skalarProd(this.normal,this.pt1);
};

Edge.cast = function(p) {
    
    if(p === undefined) {
        return false;
    }
    if( Object.prototype.toString.call(p) === '[object Array]' ) {
        for(var i = 0; i < p.length; i++) {
            p[i].__proto__ = Edge.prototype;
            p[i].pt1 = Point.cast(p[i].pt1);
            p[i].pt2 = Point.cast(p[i].pt2);
	    p[i].normal = Vector.cast(p[i].normal);
	}   
    }
    else {
        p.__proto__ = Edge.prototype;
        p.pt1 = Point.cast(p.pt1);
        p.pt2 = Point.cast(p.pt2);
	p.normal = Vector.cast(p.normal);
    }
    return p;
};

Edge.prototype.length = function() {
    return this.pt1.distance(this.pt2);
};

Edge.prototype.getY = function(x){
    return (this.dist - this.normal.x * x) / this.normal.y;
};

/* diese beiden Funktionen sind nötig da Punkte nicht zwingend in der
 * Sortierung zur Initialisierung bleiben. 
 *
 * Gleiche X-Koordinaten müssen im vorhinein ausgeschlossen werden!
 */
Edge.prototype.getLeft = function(){
    if (this.pt1.x <= this.pt2.x) return this.pt1;
    else return this.pt2;
};

Edge.prototype.getRight = function(){
    if (this.pt1.x <= this.pt2.x) return this.pt2;
    else return this.pt1;
};

Edge.prototype.getAdjacent = function(point) {
    if(point === this.pt1) return this.pt2;
    else if(point === this.pt2) return this.pt1;
    else return false;
};

Edge.prototype.projectionToLine = function(pt){
    return pt.substract(Vector.skalarMult(this.signedDistanceToLine(pt),this.normal));
};

Edge.prototype.projectionToEdge = function(pt){
    var res = this.projectionToLine(pt);
    return this.contains(res) ? res : null; 
};

Edge.prototype.distanceToLine = function(pt){
    return Math.abs(Vector.skalarProd(pt,this.normal) - this.dist);
};

Edge.prototype.signedDistanceToLine = function(pt){
    return Vector.skalarProd(pt,this.normal) - this.dist;
};

Edge.prototype.lineContains = function(pt){ //enthält die Gerade zur Kante den Punkt?
    return this.distanceToLine(pt) < SPATIAL_TOLERANCE; 
};

Edge.prototype.contains = function(pt){ //enthält die Kante den Punkt?
    return this.lineContains(pt) && 
	approx(this.getLeft().distance(pt) + this.getRight().distance(pt), this.length());
};

/*
 * Veraltete Version
 */
//Edge.prototype.lineIntersection = function(edge){ //der Schnittpunkt der beiden Geraden. (Lösung des LGS der HNFs)
//    if (this.normal.equals(edge.normal) || this.normal.equals(Vector.skalarMult(-1,edge.normal))) {
//        if (approx(this.dist,edge.dist)) return "identical_lines";
//        return "parallel_lines"; 
//    }
//    var y = (this.normal.x * edge.dist     - edge.normal.x * this.dist) / 
//        (this.normal.x * edge.normal.y - this.normal.y * edge.normal.x);
//    var x = (this.dist - this.normal.y * y) / this.normal.x;
//    if (!isFinite(x) || !isFinite(y)) return null; 
//    return new Point(x,y);
//}; 

//zuverlaessigere Version
Edge.prototype.lineIntersection = function(edge) {
    if (this.normal.equals(edge.normal) || this.normal.equals(Vector.skalarMult(-1, edge.normal))) {
        if (approx(this.dist, edge.dist)) return "identical_lines";
        return "parallel_lines";
    }

    var y, x = null;
    y = (this.dist*edge.normal.x - edge.dist*this.normal.x) / 
        (this.normal.y*edge.normal.x - this.normal.x*edge.normal.y);
    if (this.normal.x !== 0) {
        x = (this.dist - this.normal.y*y) / this.normal.x;
    } else {
        x = (edge.dist - edge.normal.y*y) / edge.normal.x;
    }
    return new Point(x,y);
};

Edge.prototype.edgeIntersection = function(edge){ //der Schnittpunkt der beiden Kanten.
    var potIntsec = this.lineIntersection(edge);
    if (potIntsec === "parallel_lines") return "parallel_lines"; //kein Schnittpunkt
    if (potIntsec === "identical_lines") return "identical_lines"; //sollte nicht passieren
    if (potIntsec !== null && edge.contains(potIntsec) && this.contains(potIntsec)) return potIntsec;
    return null; //kein Schnittpunkt
};


function Graph(edges) {
    this.edges =  [];
    this.points = [];
    var me = this;

    edges.map(function(e){me.addEdge(e);});

};

// Graph.prototype.addPoint = function(point) {
//     point.incidentEdges = [];
//     this.points.push(point);
// };

Graph.prototype.addEdge = function(edge) {
    var ind1 = null;
    var ind2 = null;
    if((ind1 = this.points.indexOf(edge.pt1))===-1){
	this.points.push(edge.pt1);
	edge.pt1.incidentEdges = [edge];
    } else {
	this.points[ind1].incidentEdges.push(edge);
    }

    if((ind2 = this.points.indexOf(edge.pt2))===-1){
	this.points.push(edge.pt2);
	edge.pt2.incidentEdges = [edge];
    } else {
	this.points[ind2].incidentEdges.push(edge);
    }    
    this.edges.push(edge)
};

// Graph.prototype.addEdge = function(edge) {
//     // checken, ob die punkte der kante bereits im graph vorhanden sind
//     var ind1 = this.points.indexOf(edge.pt1);
//     var ind2 = this.points.indexOf(edge.pt2);

//     // noch nicht vorhandene werden hinzugefügt
//     if(ind1 == -1) {
//         this.addPoint(pt1);
//     }
//     if(ind2 == -1) {
//         this.addPoint(pt2);
//     }
    
//     // den Punkten die Inzidenz hinzufügen
//     edge.pt1.incidentEdges.push(edge);
//     edge.pt2.incidentEdges.push(edge);

//     this.edges.push(edge);
// };

Graph.prototype.toString = function() {
    var ret = "{\"points\": [";
    for(var i = 0; i < this.points.length; i++) {
        var tmp = "[" + this.points[i].x + ", " + this.points[i].y + "]";
        ret += tmp; 
        if(i < this.points.length-1) ret += ", ";
    }
    ret += "], ";
    ret += " \"edges\": [";
    for(var i = 0; i < this.edges.length; i++) {
        var tmp = "[" + this.points.indexOf(this.edges[i].pt1) + ", " + this.points.indexOf(this.edges[i].pt2) + "]";
        ret += tmp;
        if(i < this.edges.length-1) ret += ", ";
    }
    ret += "]}";
    return ret;
};

function isArray(a) {
    return Object.prototype.toString.apply(a) === '[object Array]';
};

function parseGraph(graphString) {
    var graph = JSON.parse(graphString);
    if(isArray(graph.edges)  &&
       isArray(graph.points) && 
       graph.edges.reduce( function(a,b){return a && isArray(b) && b.length===2 && 
					 b[0]<graph.points.length && b[1]<graph.points.length},true) &&
       graph.points.reduce(function(a,b){return a && isArray(b) && b.length===2},true)) {
	
	var points = graph.points.map(function(ptarr){return new Point(ptarr[0],ptarr[1])});
	var edges  = [];
	for(var i=0; i<graph.edges.length; ++i){
	    edges.push(new Edge(points[graph.edges[i][0]],points[graph.edges[i][1]]));
	}
	return new Graph(edges);
    }
    
    return null;
};

function Angle(points) {
    this.a = points[0];
    this.b = points[1];
    this.c = points[2];
    this.degrees = Angle.getDegrees(this.a,this.b,this.c);
};

// Angle.getDegrees = function(pointA, pointB, pointC) {
//     var AminusB = new Vector( pointB.inv().add(pointA) );
//     var CminusB = new Vector( pointB.inv().add(pointC) );
//     return AminusB.degreesTo(CminusB);
// };

Angle.getDegrees = function(a, b, c) {
    return a.substract(b).degreesTo(c.substract(b));
};

/* 
*  Kreis-Klasse
*/

function Circle(point, radius) {
    this.point = point;
    this.radius = radius;
}
