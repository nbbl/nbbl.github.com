/*
 * Die "zentrale Instanz"
 */

var AlgLageController = function(gui) {
        
    // Private Variablen
    var points = [];
    var algos = {};
    var gui = gui;
    
    function addPoint(p) {
        points.push(p);
        gui.initGraph(points);
    }
    
    function addAlgo(algoName, algoPath) {
        var w = new Worker(algoPath);
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
            algos[a].worker.postMessage({
                name : algos[a].name,
                points : points
            });
        }
    }
    
    function stopAlgos() {
        for(var i = 0; i < algos.length; i++) {
            // algos[i].worker Macht noch nichts...
        }
    }

    // Füllt das Feld zw. Ursprung und maxX/maxY zufällig mit <amount> vielen Punkten
    function fillRandomly(amount, maxX, maxY) {
        for(i = 0; i < amount; i++) {
            var x = Math.random() * maxX;
            var y = Math.random() * maxY;
            this.addPoint(new Point(x, y));
        }
    }
    
    // Wird ausgeführt wenn sich Punkte ändern
    $.subscribe('points-change', function() {
        points = gui.getPoints();
        calculateAlgos()
    });

    function handleResponse(event) {
        // Layer an GUI schicken
        // gui.draw(...);
        
        // Algo-Boxen neuladen
        var name = event.data.name;
        var score = event.data.score;
        var info = event.data.info;
        gui.refreshAlgoBox(name, score, info);
    }
    
    // Öffentliches Interface
    return {
        addPoint : addPoint,
        addAlgo : addAlgo,
        calculateAlgos : calculateAlgos,
        fillRandomly : fillRandomly
    }
};
