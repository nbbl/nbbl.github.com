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

var graph_t = new Graph(points_t, edges_t);

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

var graph_hvn = new Graph(points_hvn, edges_hvn);
