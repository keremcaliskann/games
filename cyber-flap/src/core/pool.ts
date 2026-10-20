export class Pool<T> {
  private readonly free: T[] = [];

  constructor(
    private readonly create: () => T,
    private readonly reset: (item: T) => void,
    prewarmCount = 0,
  ) {
    for (let i = 0; i < prewarmCount; i++) {
      this.free.push(this.create());
    }
  }

  acquire(): T {
    return this.free.pop() ?? this.create();
  }

  release(item: T): void {
    this.reset(item);
    this.free.push(item);
  }

  getFreeCount(): number {
    return this.free.length;
  }
}
