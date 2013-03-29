/*
 * Die "zentrale Instanz"
 */

var AlgLageController = function(gui) {
        
    // Private Variablen
    var graph = new Graph([], []);
    var algos = {};
    var gui = gui;

    function setGraph(gr) {
        graph = gr;
        gui.initGraph(graph);
    }
   
    function addAlgo(algoName, algoPath) {
        var w = new Worker(algoPath);
        // Dieser Check macht nicht viel Sinn...
        if (!w) {
            console.log('could not create worker with path' + algoPath);
        };
        
        w.onmessage = function(event) {
            handleResponse(event);
        };
        
        var a = {
            worker : w,
            name : algoName
        };

        algos[algoName] = a;
        
        // Algo-Box initialisieren
        gui.initAlgoBox(algoName);
    }
    
    function calculateAlgos() {
        for(var a in algos) {
            
            // Ladeanimation setzten
            gui.setAlgoBoxLoading(a);

            algos[a].worker.postMessage({
                name : algos[a].name,
                graph : graph,
                points : graph.points
            });
        }
    }
    
    function stopAlgos() {
        for(var i = 0; i < algos.length; i++) {
            // algos[i].worker Macht noch nichts...
        }
    }


    function fillRandomly(amount, maxX, maxY) {
        this.graph.points = [];
        this.graph.edges = [];
        var points = randomPoints(amount, maxX, maxY);
        for(var i = 0; i < points.length; i++) {
            this.graph.points.push(points[i]);
        }
    }
    
    // Wird ausgeführt wenn sich Punkte ändern
    $.subscribe('points-change', function() {
        graph.points = gui.getPoints();
        gui.eraseAllAnnotations();
        calculateAlgos();
    });

    function handleResponse(event) {
        // Algo-Boxen neuladen
        var name = event.data.name;
        var score = event.data.score;
        var info = event.data.info;
        var annots = event.data.annotations;
        gui.refreshAlgoBox(name, score, info, annots);
    }
    
    // Öffentliches Interface
    return {
        setGraph : setGraph,
        addAlgo : addAlgo,
        calculateAlgos : calculateAlgos,
        fillRandomly : fillRandomly
    }
};
