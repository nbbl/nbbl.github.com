/*
 * Hier kommt alles rein, was überall Verfügbar sein muss (auch in den 'Web Workers')
 */

// Point Klasse

function Point(x, y) {
    this.x = x || 0;
    this.y = y || 0;
};

Point.prototype.x = null;
Point.prototype.y = null;

Point.prototype.add = function(v) {
    return new Point(this.x + v.x, this.y + v.y);
};

Point.prototype.clone = function() {
    return new Point(this.x, this.y);
};

Point.prototype.degreesTo = function(v) {
    var dx = this.x - v.x;
    var dy = this.y - v.y;
    var angle = Math.atan2(dy, dx);
    // radians
    return angle * (180 / Math.PI);
    // degrees
};

Point.prototype.distance = function(v) {
    var x = this.x - v.x;
    var y = this.y - v.y;
    return Math.sqrt(x * x + y * y);
};

Point.prototype.equals = function(toCompare) {
    return this.x == toCompare.x && this.y == toCompare.y;
};

Point.prototype.interpolate = function(v, f) {
    return new Point((this.x + v.x) * f, (this.y + v.y) * f);
};

Point.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
};

Point.prototype.normalize = function(thickness) {
    var l = this.length();
    this.x = this.x / l * thickness;
    this.y = this.y / l * thickness;
};

Point.prototype.orbit = function(origin, arcWidth, arcHeight, degrees) {
    var radians = degrees * (Math.PI / 180);
    this.x = origin.x + arcWidth * Math.cos(radians);
    this.y = origin.y + arcHeight * Math.sin(radians);
};

Point.prototype.offset = function(dx, dy) {
    this.x += dx;
    this.y += dy;
};

Point.prototype.substract = function(v) {
    return new Point(this.x - v.x, this.y - v.y);
};

Point.prototype.toString = function() {
    return "(x=" + this.x + ", y=" + this.y + ")";
};

Point.interpolate = function(pt1, pt2, f) {
    return new Point((pt1.x + pt2.x) * f, (pt1.y + pt2.y) * f);
};

Point.polar = function(len, angle) {
    return new Point(len * Math.sin(angle), len * Math.cos(angle));
};

Point.distance = function(pt1, pt2) {
    var x = pt1.x - pt2.x;
    var y = pt1.y - pt2.y;
    return Math.sqrt(x * x + y * y);
};

//Vektor Prototyp

function Vector(x,y){
    return new Point(x,y);
}

Vector.skalarMult = function(s,v){
    return new Vector(v.x*s,v.y*s);
}

Vector.skalarProd = function(v1,v2){
    return v1.x*v2.x + v1.y*v2.y;
}

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
  
}

Edge.norm = function(pt1, pt2) {
    return 
}

/* diese beiden Funktionen sind nötig da Punkte nicht zwingend in der
 * Sortierung zur Initialisierung bleiben. 
 */
Edge.prototype.getLeft = function(){
    if (pt1.x == pt2.x) return null;
    else if (pt1.x < pt2.x) return pt1;
    else return pt2;
}

Edge.prototype.getRight = function(){
    if (pt1.x == pt2.x) return null;
    else if (pt1.x < pt2.x) return pt2;
    else return pt1;
}

Edge.prototype.distanceToLine = function(pt){
    return Vector.skalarProd(pt,this.normal) - this.dist;
}

// Edge.prototype.intersectLine = function(pt,epsilon){
    
// }

// Edge.prototype.intersectLineSegment = function(pt,epsilon){
    
// }
