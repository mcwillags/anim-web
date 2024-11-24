export class Queue<T> {
  private storage: T[] = [];
  private head = 0;
  private tail = 0;

  constructor(items: T[] = []) {
    this.storage = items;
    this.tail = items.length;
  }

  enqueue(item: T) {
    this.storage[this.tail] = item;
    this.tail++;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }

    const item = this.storage[this.head];
    this.head++;

    if (this.head === this.tail) {
      this.clear();
    }

    return item;
  }

  peek(): T | undefined {
    return this.isEmpty() ? undefined : this.storage[this.head];
  }

  isEmpty(): boolean {
    return this.head === this.tail;
  }

  size(): number {
    return this.tail - this.head;
  }

  clear(): void {
    this.storage = [];
    this.head = 0;
    this.tail = 0;
  }
}
