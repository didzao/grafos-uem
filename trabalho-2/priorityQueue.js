class PriorityQueue {
  array = [];
  enqueue = function(newMem) {
    if (this.isEmpty()) {
      this.array.push(newMem);
    }
    else {
      var added = false;
      for (var i = 0; i < this.array.length; i++) {
        if (newMem[1] < this.array[i][1]) {
          this.array.splice(i, 0, newMem);
          added = true;
          break;
        }
      }
      if (!added) {
        this.array.push(newMem);
      }
    }
  };
  print = function() {
    console.log(this.array);
  };
  dequeue = function() {
    return this.array.shift();
  };
  front = function() {
    return this.array[0];
  };
  size = function() {
    return this.array.length;
  };
  isEmpty = function() {
    return (this.array.length === 0);
  };
  find = function(element) {
    let achou = -1;
    this.array.forEach((elemento, index) => {
      if (elemento[0] == element) {
        achou = index;
      }
    });
    return achou;
  };
  get = function(element) {
    return this.array[element];
  }
  delete = function(index) {
    return this.array.splice(index, 1);
  }
}

module.exports = PriorityQueue;
