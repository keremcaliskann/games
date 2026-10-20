export type EventCallback<T = any> = (payload: T) => void;

/**
 * Lightweight, zero-allocation event bus for decoupled inter-module messaging.
 * Avoids circular dependencies between ui, game logic, and audio systems.
 */
export class EventBus {
  private static instance: EventBus;
  private readonly listeners: Map<string, EventCallback[]> = new Map();

  public static get(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on<T>(event: string, callback: EventCallback<T>): () => void {
    let list = this.listeners.get(event);
    if (!list) {
      list = [];
      this.listeners.set(event, list);
    }
    list.push(callback);
    return () => this.off(event, callback);
  }

  public off<T>(event: string, callback: EventCallback<T>): void {
    const list = this.listeners.get(event);
    if (!list) return;
    const index = list.indexOf(callback);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  public emit<T>(event: string, payload: T): void {
    const list = this.listeners.get(event);
    if (!list) return;
    for (let i = 0; i < list.length; i++) {
      list[i](payload);
    }
  }
}
