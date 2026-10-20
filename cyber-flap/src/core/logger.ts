export const logger = {
  info(msg: string, ...args: unknown[]): void {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.info(`[CYBER-FLAP] ${msg}`, ...args);
    }
  },
  warn(msg: string, ...args: unknown[]): void {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[CYBER-FLAP] ${msg}`, ...args);
    }
  },
  error(msg: string, ...args: unknown[]): void {
    // Errors are always logged so crash diagnostics remain available
    // eslint-disable-next-line no-console
    console.error(`[CYBER-FLAP] ${msg}`, ...args);
  },
};
