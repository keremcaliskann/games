export interface ShellOptions {
  currentGameId: string;
  onRestart: () => void;
}

export class ShellController {
  constructor(private readonly options: ShellOptions) {
    this.setupShellButtons();
  }

  private setupShellButtons(): void {
    // Left sidebar / general arcade buttons
    window.addEventListener('keydown', (e) => {
      if (e.key === 'r' || e.key === 'R') {
        this.options.onRestart();
      }
    });
  }
}
