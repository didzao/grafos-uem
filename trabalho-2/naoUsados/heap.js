//  Dijkstra

export default function BitHeap () {
  let list = [];

  let usedList = [];

  this.maxHeapify = (arr, n, i) => {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest != i) {
      let temp = arr[i]; 
      arr[i] = arr[largest]; 
      arr[largest] = temp; 
  
      this.maxHeapify(arr, n, largest)
    }
  }

  this.insert = (num) => {
    const size = list.length;

    if (size === 0) {
      list.push(num)
    } else {
      list.push(num);

     for (let i = parseInt(list.length / 2 - 1); i >= 0; i--) {
         this.maxHeapify(list, list.length, i); 
     }
    }
  }

        this.delete = (num) => {
          const size = list.length;

          let i = 0;

          for (i = 0; i < size; i ++) {
            if (num === list[i]) {
              break;
            }
          }

          [list[i], list[size - 1]] = [list[size - 1], list[i]];

          list.splice(size -1);

          if (usedList.findIndex(el => el === num) == -1) {
            usedList.push(num);
          }

          for (let i = parseInt(list.length / 2 - 1); i >= 0; i--) {
            this.maxHeapify(list, list.length, i); 
          }
        }

  this.getList = () => list;

  this.getUsedList = () => usedList;

  this.findMax = () => list[0];

  this.deleteMax = () => {
    this.delete(list[0]);
  }

  this.extractMax = () => {
    const max = list[0];
    this.delete(max);
    return max;
  }
}

const heap = new BitHeap();

heap.insert(9);
heap.insert(39);
heap.insert(2);

console.log(heap.getList());

heap.delete(9)
heap.delete(9)

console.log(heap.getList());
console.log(">>>", heap.getUsedList());



