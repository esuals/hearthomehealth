// Web Audio API Synthesizer for tactical medical alerts, siren simulation, and heart telemetry
class SoundController {
  private ctx: AudioContext | null = null;
  private sirenOsc: OscillatorNode | null = null;
  private sirenMod: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private isSirenActive = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime(type: 'success' | 'alert' | 'tick' | 'pop' = 'success') {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;
      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.12); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'alert') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(440, now + 0.1);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'pop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      }
    } catch {
      // Audio autoplay might be restricted until user interaction
    }
  }

  playHeartbeat() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Lub
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(80, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Dub
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(95, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.22);
      gain2.gain.setValueAtTime(0.15, now + 0.14);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.26);
    } catch {
      // Ignore
    }
  }

  startAmbulanceSiren() {
    if (this.isSirenActive) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const carrier = this.ctx.createOscillator();
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const masterGain = this.ctx.createGain();

      carrier.type = 'sawtooth';
      modulator.type = 'sine';

      // Ambulance wail: 650Hz to 950Hz oscillation at 0.4 Hz
      carrier.frequency.setValueAtTime(800, this.ctx.currentTime);
      modulator.frequency.setValueAtTime(0.35, this.ctx.currentTime);
      modGain.gain.setValueAtTime(180, this.ctx.currentTime);

      modulator.connect(carrier.frequency);
      carrier.connect(masterGain);

      // Keep volume measured and subtle for good UX
      masterGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);

      modulator.start();
      carrier.start();

      this.sirenOsc = carrier;
      this.sirenMod = modulator;
      this.sirenGain = masterGain;
      this.isSirenActive = true;
    } catch {
      // Audio error safety
    }
  }

  stopAmbulanceSiren() {
    if (!this.isSirenActive) return;
    try {
      if (this.sirenGain && this.ctx) {
        this.sirenGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
      }
      setTimeout(() => {
        if (this.sirenOsc) this.sirenOsc.stop();
        if (this.sirenMod) this.sirenMod.stop();
        this.sirenOsc = null;
        this.sirenMod = null;
        this.sirenGain = null;
        this.isSirenActive = false;
      }, 220);
    } catch {
      this.isSirenActive = false;
    }
  }

  toggleSiren(): boolean {
    if (this.isSirenActive) {
      this.stopAmbulanceSiren();
      return false;
    } else {
      this.startAmbulanceSiren();
      return true;
    }
  }
}

export const soundFx = new SoundController();
