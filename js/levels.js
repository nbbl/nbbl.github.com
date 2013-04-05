//importScripts('alglage/core/Core.js');

// Test
var points_t = [
    new Point(4, 6),
    new Point(12, 4),
    new Point(3, 7),
    new Point(6, 5),
    new Point(6, 7),
    new Point(7, 2),
    new Point(14, 5),
    new Point(4, 1) ];

var edges_t = [
    new Edge(points_t[0], points_t[1]),
    new Edge(points_t[1], points_t[2]),
    new Edge(points_t[2], points_t[4]),
    new Edge(points_t[7], points_t[1]),
    new Edge(points_t[7], points_t[6]),
    new Edge(points_t[2], points_t[6]),
    new Edge(points_t[3], points_t[6]),
    new Edge(points_t[4], points_t[6]),
    new Edge(points_t[7], points_t[5]) ];

var graph_t = new Graph(edges_t);

// Haus vom Nikolaus
var points_hvn = [
    new Point(7, 0.5),
    new Point(7, 6.5),
    new Point(13, 0.5),
    new Point(13, 6.5),
    new Point(10, 9.5)];

var edges_hvn = [
    new Edge(points_hvn[0], points_hvn[1]),
    new Edge(points_hvn[1], points_hvn[2]),
    new Edge(points_hvn[2], points_hvn[3]),
    new Edge(points_hvn[3], points_hvn[1]),
    new Edge(points_hvn[1], points_hvn[4]),
    new Edge(points_hvn[4], points_hvn[3]),
    new Edge(points_hvn[3], points_hvn[0]),
    new Edge(points_hvn[0], points_hvn[2]) ];

var graph_hvn = new Graph(edges_hvn);

//vollstaendiger n-Graph
var get_points_complete_graph = function(n) {
    var yMax = 10;
    var xMax = 15;
    var r = 4;
    var resPoints = [];

    for (var i = 0; i < n; ++i) {
        resPoints.push(new Point(r*Math.cos( (i*2*Math.PI)/n ) + xMax/2, r*Math.sin( (i*2*Math.PI)/n ) + yMax/2));
    }

    return resPoints;
}

var get_edges_complete_graph = function(points) {
    var resEdges = [];

    for (var i = 0; i < points.length-1; ++i) {
        for (var j = i+1; j < points.length; ++j) {
            resEdges.push(new Edge(points[i], points[j]));
        }
    }

    return resEdges;
}   

//vollstaendiger 7 Graph
var points_complete_7 = get_points_complete_graph(7);
var edges_complete_7 = get_edges_complete_graph(points_complete_7);
var graph_complete_7 = new Graph(edges_complete_7);

//vollstaendiger 11 Graph
var points_complete_11 = get_points_complete_graph(11);
var edges_complete_11 = get_edges_complete_graph(points_complete_11);
var graph_complete_11 = new Graph(edges_complete_11);

//vollstaendiger 22 Graph
var points_complete_22 = get_points_complete_graph(22);
var edges_complete_22 = get_edges_complete_graph(points_complete_22);
var graph_complete_22 = new Graph(edges_complete_22);
