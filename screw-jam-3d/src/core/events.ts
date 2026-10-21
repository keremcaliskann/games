type Callback<T = any> = (data: T) => void;

export class EventBus {
  private static instance: EventBus | null = null;
  private listeners = new Map<string, Callback[]>();

  public static get(): EventBus {
    if (!this.instance) {
      this.instance = new EventBus();
    }
    return this.instance;
  }

  public on<T = any>(event: string, callback: Callback<T>): void {
    const list = this.listeners.get(event) || [];
    list.push(callback);
    this.listeners.set(event, list);
  }

  public off<T = any>(event: string, callback: Callback<T>): void {
    const list = this.listeners.get(event);
    if (!list) return;
    this.listeners.set(event, list.filter((cb) => cb !== callback));
  }

  public emit<T = any>(event: string, data?: T): void {
    const list = this.listeners.get(event);
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      try {
        list[i](data);
      } catch (err) {
        console.error(`Error in event ${event}:`, err);
      }
    }
  }
}
