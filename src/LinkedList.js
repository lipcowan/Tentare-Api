class _Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  insertFirst(item) {
    this.head = new _Node(item, this.head);
  }

  insertLast(item) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let currNode = this.head;
      while (currNode.next !== null) {
        currNode = currNode.next;
      }
      currNode.next = new _Node(item, null);
    }
  }

  insertBefore(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let currNode = this.head;
      let prevNode = this.head;
      while (currNode.value !== key && currNode !== null) {
        prevNode = currNode;
        currNode = currNode.next;
      }
      if (currNode === null) {
        throw new Error("Item not found");
      }
      let newNode = new _Node(item, currNode);
      prevNode.next = newNode;
    }
  }

  insertAfter(item, key) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let currNode = this.head;
      while (currNode.value !== key && currNode !== null) {
        currNode = currNode.next;
      }
      if (currNode === null) {
        throw new Error("Item not found");
      }
      let newNode = new _Node(item, currNode.next);
      currNode.next = newNode;
    }
  }

  insertAt(item, idx) {
    if (this.head === null) {
      this.insertFirst(item);
    } else {
      let currNode = this.head;
      let prevNode = this.head;
      for (let i = 0; i < idx; i++) {
        prevNode = currNode;
        currNode = currNode.next;
        if (currNode === null) {
          throw new Error("out of bounds");
        }
      }
      let newNode = new _Node(item, currNode);
      prevNode.next = newNode;
    }
  }

  find(item) {
    if (this.head === null) {
      throw new Error("Empty list, item not found");
    } else {
      let currNode = this.head;
      while (currNode.value !== item) {
        if (currNode === null) {
          throw new Error("Item not found");
        }
        currNode = currNode.next;
      }
      return currNode;
    }
  }

  remove(item) {
    // case when item is at head, remove reference to item
    if (this.head.value === item) {
      this.head = this.head.next;
    } else if (this.head === null) {
      throw new Error("Empty List");
    } else {
      let currNode = this.head;
      let prevNode = this.head;
      while (currNode.value !== item && currNode !== null) {
        prevNode = currNode;
        currNode = currNode.next;
      }
      if (currNode === null) {
        throw new Error("Item not found");
      }
      // when found, eliminate reference to node, skip over
      prevNode.next = currNode.next;
    }
  }
}

module.exports = LinkedList;
