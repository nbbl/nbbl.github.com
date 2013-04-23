/*
 * Die "zentrale Instanz"
 */

var AlgLageController = function(gui) {
    
    // Highscore Variablen
    var GET_HS_URL = 'http://allglage.funpic.de/getscore.php';
    var SET_HS_URL = 'http://allglage.funpic.de/setscore.php?';
    
    // Private Variablen
    var graph = new Graph([]);
    var algos = {};
    var levels = {};
    var highscore = {};
    var currLevname;
    
    var algoReady = {}; // Wird gespeichert ob ein Algo fertig ist.
    
    var gui = gui;
    
    function setGraph(gr) {
        graph = gr;
        gui.initGraph(graph);
    }
    
    function addLevel(name, gr) {
        levels[name] = gr;
        gui.addLevelToNav(name);
    }
    
    function loadLevel(name) {
	currLevname = name;
        if(levels[name] === undefined) return false;
        
        if(name.indexOf('Custom') != -1) {
            gui.setHighscoreVisibility(false);
        }

        else {
            gui.setHighscoreVisibility(true);
            
            refreshHighscore();
        }

        gui.changePageHeader(name);
        gui.eraseAllAnnotations();
        setGraph(levels[name]);
        calculateAlgos();
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
        algoReady[algoName] = true;
        // Farbe hinzufügen (zirkulär aus annotationsColors ausgewählt)
        var nrOfAddedAlgos = Object.keys(algos).length;
        var color = annotationsColors[(nrOfAddedAlgos-1) % annotationsColors.length];
        algos[algoName].color = color;
        // Algo-Box initialisieren
        gui.initAlgoBox(algoName, color);
    }
    
    function calculateAlgos() {
        for(var a in algos) {
            
            // Active checken
            if(!gui.isActive(a) || !algoReady[a]) continue;
            
            // Algo auf "rechnen" setzen
            algoReady[a] = false;
            
            // Ladeanimation setzten
            gui.setAlgoBoxLoading(a);

            algos[a].worker.postMessage({
                name : algos[a].name,
                graph : graph,
                points : graph.points
            });
        }
    }
    
    // Wird ausgeführt wenn sich Punkte ändern
    $.subscribe('points-change', function() {
        graph.points = gui.getPoints();
        
        calculateAlgos();
    });
    
    // Wird ausgeführt wenn Highscore
    $.subscribe('post-highscore', function() {
        postHighscore();
    });
    
    function handleResponse(event) {
        // Algo-Boxen neuladen
        var name = event.data.name;
        var score = event.data.score;
        var info = event.data.info;
        var annots = event.data.annotations;
        
        
        gui.refreshAlgoBox(name, score, info, annots, algos[name].color);
        algoReady[name] = true;
    }
    
    function showHighscore() {
        var h = highscore[currLevname];
        if(h === undefined) return false;
        
        gui.showHighscore(h)
    }
    
    function refreshHighscore() {
        var $s = $("<scri" + "pt type='text/javasc" + "ript' src=" + GET_HS_URL + "><\/script>");
        $("body").append($s);
        $s.remove();
    }
    
    function setHighscore(hs) {
        highscore = hs;
        showHighscore();
    }
    
    function postHighscore() {
        var tscore = $('#ShortestDistPoint-Edge .score').text();
        if(tscore == '' || tscore == '-') return false;
        
        var url = SET_HS_URL;
        url += 'levname=' + currLevname + '&';
        url += 'name=' + $('#scoreText').val() + '&';
        url += 'score=' + tscore + '&';
        url += 'points=' + getPointsAsStringArray();
        
        $('<img/>').attr('src', url);
        
        setTimeout(function() {
            refreshHighscore();
        }, 300);
    }
    
    function getPointsAsStringArray() {
        var ret = "[";
        var points = graph.points;
        
        for(var i = 0; i < points.length; i++) {
            if(i > 0) ret += ",";
            
            ret += "[";
            ret += points[i].x + "," + points[i].y;
            ret += "]";
        }
        
        ret += "]";
        return ret;
    }
    
    // Abfangen wenn Level ausgewählt wird
    window.onhashchange = function() {
        currLevname = window.location.hash.substring(1);
        loadLevel(currLevname);
    }
    
    // Öffentliches Interface
    return {
        addLevel : addLevel,
        loadLevel : loadLevel,
        addAlgo : addAlgo,
        calculateAlgos : calculateAlgos,
        fillRandomly : fillRandomly,
        setHighscore : setHighscore,
        postHighscore : postHighscore
    }
};
