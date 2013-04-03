/*
 * Dieser Generator kann z.B. wie folgt verwendet werden:
 *
 * js> var set = new Subsets([1,2,3,4,5,6,7,8,9,10],3);
 * js> for(var i in set) print(i); 
 * 1,2,3
 * 1,2,4
 * ...
 * 1,2,10
 * 1,3,10
 * 1,4,10
 * ...
 * 1,9,10
 * 2,9,10
 * 3,9,10
 * ...
 * 8,9,10
 */
function Subsets(array,subsetsize){
    this.array = array;
    this.subsetsize = subsetsize;
    this.pointers = new Array(subsetsize);
    this.maxpointer = new Array(subsetsize);
    this.init();
};

Subsets.prototype.init = function() {
    for(var i=0; i<this.subsetsize; i++){
	this.pointers[i]=i;
	this.maxpointer[i]=this.array.length-(this.subsetsize-i);
    }
}

Subsets.prototype.__iterator__ = function(){
    var array = this.array;
    var i = this.pointers.length-1;
//    outerloop:
    while(true){
        while(this.pointers[i]<=this.maxpointer[i]){
            yield (this.pointers.map(function(x){return array[x];}));
            this.pointers[i]++;
        }
        while(this.pointers[i]>this.maxpointer[i]){
            this.pointers[--i]++;
            if(i==0 && this.pointers[i]>this.maxpointer[i]) {
                this.init();
                throw StopIteration
//                break outerloop;
            }
        }
        while(i<this.pointers.length-1){
            ++i;
            this.pointers[i]=this.pointers[i-1]+1;
        }	    
    }
};

/*------------------------------------------------------------------*/
/*START Sorted Double Linked List-----------------------------------*/
/*------------------------------------------------------------------*/
function SortedDLL(compFunction) {
    this.cmp = cmpFunction;
    this.head = null;
}

SortedDLL.prototype.insert = function(elem) {
    if (this.head === null) {
        this.head = new ChainElement(elem);
    } else {
        var curr = this.head;
        while ((this.cmp(elem, curr) > 0) && (curr.next !== null)) {
            curr = curr.next;
        }
        if (this.cmp(elem, curr)<=0 && curr.prev===null) { //elem is smaller/equal to minimum 
            curr.prev = new ChainElem(elem);
            curr.prev.next = curr;
            this.head = curr.prev;
        } else if (this.cmp(elem, curr) > 0) { //elem is new maximum
            curr.next = new ChainElem(elem);
            curr.next.prev = curr;
        } else { //insert inside existing chain
            curr.prev.next = new ChainElem(elem);
            curr.prev.next.prev = curr.prev;
            curr.prev = curr.prev.next;
            curr.prev.next = curr;
        }
    }
}

// delete a given ChainElement, returns the stored vaule
SortedDLL.prototype.deleteChainElem = function(ce) {
    if (this.head === ce) {     
        if (ce.next !== null) { //there is at least one other ChainElement 
            this.head = ce.next; 
            ce.next.prev = null; 
        } else {                //ce is the only ChainElement 
            this.head = null;
        }
    } else if (ce.next === null) { 
        ce.prev.next = null;
    } else {                    //ce has 'prev' and 'next' ChainElement
        ce.prev.nex = ce.next;
        ce.next.prev = ce.prev;
    }
    return ce.value;
}

//retrieves minimal stored value, and removes its corresponding ChainElement 
SortedDLL.prototype.retrieveMin = function() {
    if (this.head===null) return null; //no elements there
    return deleteChainElem(this.head);
}

//creates a container for elements used in  SortedDLL
function ChainElem(elem) {
    this.value = elem;
    this.prev = null;
    this.next = null;
}
/*------------------------------------------------------------------*/
/*END Sorted Double Linked List-----------------------------------*/
/*------------------------------------------------------------------*/
function randomPoints(amount, maxX, maxY) {
    var points = [];
    for(i = 0; i < amount; i++) {
        var x = Math.random() * maxX;
        var y = Math.random() * maxY;
        points.push(new Point(x, y));
    }
    return points;
}


function randomGraph(amountPoints, amountEdges, maxX, maxY) {
    var graph = new Graph([], []);

    // punkte auswürfeln und einzeln hinzufügen
    var pts = randomPoints(amountPoints, maxX, maxY);
    for(var i = 0; i < amountPoints; i++) {
        graph.addPoint(pts[i]);
    }

    var edge, p1, p2;
    for(var i = 0; i < amountEdges; i++) {
        // eine neue Kante auslosen
        do {
            // zwei verschiedene Punkte auslosen
            p1 = graph.points[Math.floor(Math.random() * graph.points.length)];
            do {
                p2 = graph.points[Math.floor(Math.random() * graph.points.length)];
            } while(p1.equals(p2))
            
        } while(p1.isAdjacentTo(p2))
        graph.addEdge(new Edge(p1, p2));
    }
    return graph;
}


Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
