type Callback<T = unknown> = (data: T) => void;

export class EventBus {
  private listeners: Map<string, Set<Callback>> = new Map();

  public on<T = unknown>(event: string, callback: Callback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    const casted = callback as Callback;
    set.add(casted);
    return () => set.delete(casted);
  }

  public emit<T = unknown>(event: string, data?: T): void {
    const set = this.listeners.get(event);
    if (!set) return;
    for (const cb of set) {
      cb(data);
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
