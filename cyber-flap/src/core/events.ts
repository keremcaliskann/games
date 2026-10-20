type Handler<T> = (payload: T) => void;

export class EventBus<E extends Record<string, unknown>> {
  private readonly map = new Map<keyof E, Set<Handler<never>>>();

  on<K extends keyof E>(type: K, handler: Handler<E[K]>): () => void {
    let set = this.map.get(type);
    if (!set) {
      set = new Set();
      this.map.set(type, set);
    }
    set.add(handler as Handler<never>);
    return (): void => {
      set.delete(handler as Handler<never>);
    };
  }

  emit<K extends keyof E>(type: K, payload: E[K]): void {
    const set = this.map.get(type);
    if (!set) return;
    for (const handler of set) {
      (handler as Handler<E[K]>)(payload);
    }
  }

  clear(): void {
    this.map.clear();
  }
}
