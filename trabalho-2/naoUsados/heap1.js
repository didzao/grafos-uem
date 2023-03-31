//  Dijkstra

class BitHeap {
  list = [];

  usedList = [];

  maxHeapify = (arr, n, i) => {
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

  insert = (num) => {
    const size = this.list.length;

    if (size === 0) {
      this.list.push(num)
    } else {
      this.list.push(num);

      for (let i = parseInt(this.list.length / 2 - 1); i >= 0; i--) {
        this.maxHeapify(this.list, this.list.length, i);
      }
    }
  }

  delete = (num) => {
    const size = this.list.length;

    let i = 0;

    for (i = 0; i < size; i++) {
      if (num === this.list[i]) {
        break;
      }
    }

    [this.list[i], this.list[size - 1]] = [this.list[size - 1], this.list[i]];

    this.list.splice(size - 1);

    if (this.usedList.findIndex(el => el === num) == -1) {
      this.usedList.push(num);
    }

    for (let i = parseInt(this.list.length / 2 - 1); i >= 0; i--) {
      this.maxHeapify(this.list, this.list.length, i);
    }
  }

  getList = () => this.list;

  getUsedList = () => this.usedList;

  findMax = () => this.list[0];

  deleteMax = () => {
    this.delete(this.list[0]);
  }

  extractMax = () => {
    const max = this.list[0];
    this.delete(max);
    return max;
  }
}

module.exports = BitHeap;