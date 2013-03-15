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
    for(var i=0; i<subsetsize; i++){
	this.pointers[i]=i;
	this.maxpointer[i]=array.length-1-i;
    }
};


Subsets.prototype.__iterator__ = function(){
    var array = this.array;
    var i = this.pointers.length-1;
    outerloop:
    while(true){
	while(this.pointers[i]<=this.maxpointer[i]){
	    yield this.pointers.map(function(x){return array[x];});
	    this.pointers[i]++;
	}
	while(this.pointers[i]>this.maxpointer[i]){
	    p[--i]++;
	    if(i==0 && this.pointers[i]>this.maxpointer[i]) break outerloop;
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
    this.tail = null;
}

SortedDLL.prototype.insert = function(elem) {
    if (this.head === null) {
        this.head = new ChainElement(elem);
        this.tail = this.head;
    } else {
        var curr = this.head;
        while ((this.cmp(elem, curr) > 0) && (curr.next !== null)) {
            curr = curr.next;
        }
        if (this.cmp(elem, curr)<=0 && curr.prev===null) { //elem is smaller/equal to minimum 
            curr.prev = new ChainElem(elem);
            curr.prev.next = curr;
            this.head = curr.prev;
        } else if ((this.cmp(elem, curr)>0)) { //elem is new maximum
            curr.next = new ChainElem(elem);
            curr.next.prev = curr;
            this.tail = curr.next;
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
            this.tail = null;
        }
    } else if (this.tail === ce) { 
        this.tail = ce.prev;
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
