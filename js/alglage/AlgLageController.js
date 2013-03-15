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
    
    function refresh() {
        gui.drawPoints(points);
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
        var name = event.data.name;
        switch (name) {
            case 'algo1':
                var $ele = $('#' + event.data.name);
                $ele.find('h2').html(event.data.score);
                $ele.find('p:first').html(event.data.more);
                break;
            case 'algo2':
                var $ele = $('#' + event.data.name);
                $ele.find('h2').html(event.data.score);
                $ele.find('p:first').html(event.data.more);
                break;
            case 'ShortestDistance':
                var $ele = $('#' + 'algo3');
                $ele.find('h2').html(event.data.score);
                break;
            default:
                console.log('No matching switchcase for ' + name + ' in handleResponse()-switch');
                break;
        }
    }
    
    // Öffentliches Interface
    return {
        addPoint : addPoint,
        addAlgo : addAlgo,
        calculateAlgos : calculateAlgos,
        refresh : refresh,
        fillRandomly : fillRandomly
    }
};
