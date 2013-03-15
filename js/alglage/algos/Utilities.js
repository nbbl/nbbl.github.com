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
    for(var i=0; i<subsetsize; i++){
	this.pointers[i]=i;
    }
};

Subsets.prototype.__iterator__ = function(){
    var array = this.array
    var nextmax = array.length-1;
    for(var i=this.subsetsize-1; i>=0; i--){
	while(this.pointers[i]<nextmax){
	    yield this.pointers.map(function(x){return array[x];});
	    this.pointers[i]++;
	}
	nextmax--;
    }
    yield this.pointers.map(function(x){return array[x];});
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
function SortedDll.prototype.deleteChainElem(ce) {
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

function ChainElem(elem) {
    this.value = elem;
    this.prev = null;
    this.next = null;
}
/*------------------------------------------------------------------*/
/*END Sorted Double Linked List-----------------------------------*/
/*------------------------------------------------------------------*/
