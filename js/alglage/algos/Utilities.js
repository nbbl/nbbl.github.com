/*
 * Dieser Generator kann z.B. wie folgt verwendet werden:
 *
 * js> var set = new Binomsubset([1,2,3,4,5,6,7,8,9,10],3);
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
function Binomsubset(array,subsetsize){
    this.array = array;
    this.subsetsize = subsetsize;
    this.pointers = new Array(subsetsize);
    for(var i=0; i<subsetsize; i++){
	this.pointers[i]=i;
    }
};

Binomsubset.prototype.__iterator__ = function(){
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
