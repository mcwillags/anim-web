declare class Queue<T> {
  private storage: T[];
  private head: number;
  private tail: number;

  enqueue(item: T): number;
  dequeue(): T | undefined;
  peek(): T | undefined;
  isEmpty(): boolean;
  size(): number;
  clear(): void;
}
