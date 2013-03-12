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
