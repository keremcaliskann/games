export interface LifecycleCallbacks {
  onPause(): void;
  onResume(): void;
}

export class LifecycleManager {
  private readonly handleVisibility: () => void;
  private readonly handleBlur: () => void;

  constructor(callbacks: LifecycleCallbacks) {
    this.handleVisibility = (): void => {
      if (document.hidden) {
        callbacks.onPause();
      } else {
        callbacks.onResume();
      }
    };

    this.handleBlur = (): void => {
      callbacks.onPause();
    };

    document.addEventListener('visibilitychange', this.handleVisibility);
    window.addEventListener('blur', this.handleBlur);
  }

  dispose(): void {
    document.removeEventListener('visibilitychange', this.handleVisibility);
    window.removeEventListener('blur', this.handleBlur);
  }
}
