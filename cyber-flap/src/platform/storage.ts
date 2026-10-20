import { logger } from '../core/logger';

const HIGH_SCORE_KEY = 'cyber_flap_high_score_v1';

export class StorageService {
  loadHighScore(): number {
    try {
      const raw = window.localStorage.getItem(HIGH_SCORE_KEY);
      if (!raw) return 0;
      const parsed = Number.parseInt(raw, 10);
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
    } catch (err) {
      logger.warn('Failed to read high score from storage', err);
      return 0;
    }
  }

  saveHighScore(score: number): void {
    try {
      window.localStorage.setItem(HIGH_SCORE_KEY, String(Math.floor(score)));
    } catch (err) {
      logger.warn('Failed to persist high score to storage', err);
    }
  }
}
