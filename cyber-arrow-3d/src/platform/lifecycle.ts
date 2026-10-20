export type VisibilityChangeCallback = (isVisible: boolean) => void;

/**
 * Mobile and browser lifecycle watcher.
 * Notifies when the app is backgrounded or brought back to the foreground.
 */
export class LifecycleManager {
  private static listeners: VisibilityChangeCallback[] = [];
  private static isInitialized = false;

  public static init(): void {
    if (this.isInitialized || typeof document === 'undefined') return;
    this.isInitialized = true;

    document.addEventListener('visibilitychange', () => {
      const isVisible = document.visibilityState === 'visible';
      for (let i = 0; i < this.listeners.length; i++) {
        this.listeners[i](isVisible);
      }
    });
  }

  public static onVisibilityChange(cb: VisibilityChangeCallback): () => void {
    this.init();
    this.listeners.push(cb);
    return () => {
      const idx = this.listeners.indexOf(cb);
      if (idx !== -1) {
        this.listeners.splice(idx, 1);
      }
    };
  }
}
