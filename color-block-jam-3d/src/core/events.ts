type EventHandler<T = any> = (payload: T) => void;

export class EventBus {
  private static instance: EventBus | null = null;
  private readonly listeners = new Map<string, Set<EventHandler>>();

  public static get(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on<T = any>(event: string, handler: EventHandler<T>): () => void {
    let set = this.listeners.get(event);
    if (!set) {
      set = new Set();
      this.listeners.set(event, set);
    }
    set.add(handler);
    return () => this.off(event, handler);
  }

  public off<T = any>(event: string, handler: EventHandler<T>): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(handler);
    }
  }

  public emit<T = any>(event: string, payload: T): void {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((fn) => {
        try {
          fn(payload);
        } catch (err) {
          console.error(`[EventBus] Error in handler for '${event}':`, err);
        }
      });
    }
  }

  public clear(): void {
    this.listeners.clear();
  }
}
