export class SoundController {
  private ctx: AudioContext | null = null;
  private userMuted = false;
  private platformMuted = false;

  private ensureContext(): AudioContext | null {
    if (this.userMuted || this.platformMuted) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public setPlatformMuted(muted: boolean): void {
    this.platformMuted = muted;
  }

  public toggleUserMute(): boolean {
    this.userMuted = !this.userMuted;
    return this.userMuted;
  }

  public isMuted(): boolean {
    return this.userMuted || this.platformMuted;
  }

  private playTone(
    freqStart: number,
    freqEnd: number,
    durationSec: number,
    type: OscillatorType = 'triangle',
    gainPeak = 0.14
  ): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + durationSec);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(gainPeak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + durationSec);
  }

  public playWinchFire(): void {
    this.playTone(480, 920, 0.16, 'sawtooth', 0.15);
  }

  public playCheckpointCamp(): void {
    this.playTone(540, 760, 0.2, 'triangle', 0.16);
  }

  public playMudSplash(): void {
    this.playTone(160, 95, 0.12, 'sine', 0.09);
  }

  public playBoosterActivate(): void {
    this.playTone(320, 860, 0.25, 'sawtooth', 0.16);
  }

  public playVictory(): void {
    const notes = [440, 554.37, 659.25, 880];
    for (let i = 0; i < notes.length; i++) {
      setTimeout(() => {
        this.playTone(notes[i], notes[i] * 1.05, 0.22, 'triangle', 0.16);
      }, i * 95);
    }
  }

  public playStallWarning(): void {
    this.playTone(360, 210, 0.24, 'sawtooth', 0.14);
  }
}
