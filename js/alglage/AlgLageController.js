/*
 * Die "zentrale Instanz"
 */

var AlgLageController = function(gui) {
        
    // Private Variablen
    var Points = [];
    var algos = {};
    var gui = gui;
    
    function addPoint(p) {
        Points.push(p);
    }
    
    function addAlgo(algoName, algoPath) {
        var w = new Worker(algoPath);
        
        w.onmessage = function(event) {
            var $ele = $('#' + event.data.name);
            $ele.find('h2').html(event.data.score);
            $ele.find('p:first').html(event.data.more);
        };
        
        var a = {
            worker : w,
            name : algoName
        };
        
        algos[algoName] = a;
    }
    
    function calculateAlgos() {
        for(var a in algos) {
            algos[a].worker.postMessage({
                name : algos[a].name,
                points : Points
            });
        }
    }
    
    function stopAlgos() {
        for(var i = 0; i < algos.length; i++) {
            algos[i].worker.postMessage({
                points : Points
            });
        }
    }
    
    function refresh() {
        gui.drawPoints(Points);
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
    $.subscribe('Points-change', function() {
        Points = gui.getPoints();
        calculateAlgos()
    });
    
    // Öffentliches Interface
    return {
        addPoint : addPoint,
        addAlgo : addAlgo,
        calculateAlgos : calculateAlgos,
        refresh : refresh,
        fillRandomly : fillRandomly
    }
};
