export interface QualityTier {
  name: 'high' | 'medium' | 'low';
  maxPixelRatio: number;
  antialias: boolean;
  rainCount: number;
}

const TIERS: readonly QualityTier[] = [
  { name: 'high', maxPixelRatio: 2.0, antialias: true, rainCount: 160 },
  { name: 'medium', maxPixelRatio: 1.5, antialias: false, rainCount: 100 },
  { name: 'low', maxPixelRatio: 1.0, antialias: false, rainCount: 50 },
];

export function detectInitialTierIndex(): number {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
  return isMobile ? 1 : 0;
}

export class AdaptiveQuality {
  private tierIndex: number;
  private slowAccumSec = 0;

  constructor(private readonly onTierChanged: (tier: QualityTier) => void) {
    this.tierIndex = detectInitialTierIndex();
  }

  get current(): QualityTier {
    return TIERS[this.tierIndex];
  }

  update(dtSec: number, emaFrameMs: number): void {
    if (this.tierIndex >= TIERS.length - 1) return;

    if (emaFrameMs > 20.0) {
      this.slowAccumSec += dtSec;
      if (this.slowAccumSec >= 1.0) {
        this.tierIndex++;
        this.slowAccumSec = 0;
        this.onTierChanged(this.current);
      }
    } else {
      this.slowAccumSec = Math.max(0, this.slowAccumSec - dtSec * 0.5);
    }
  }
}
