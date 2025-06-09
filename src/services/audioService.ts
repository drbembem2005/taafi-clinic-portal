
export class AudioService {
  private audioContext: AudioContext | null = null;
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async playTone(frequency: number, duration: number, volume: number = 0.3) {
    if (!this.audioContext) {
      await this.initialize();
    }
    
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  async playBinauralBeat(baseFreq: number, beatFreq: number, duration: number) {
    if (!this.audioContext) {
      await this.initialize();
    }
    
    if (!this.audioContext) return;

    const leftOsc = this.audioContext.createOscillator();
    const rightOsc = this.audioContext.createOscillator();
    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();
    const merger = this.audioContext.createChannelMerger(2);
    
    leftOsc.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
    rightOsc.frequency.setValueAtTime(baseFreq + beatFreq, this.audioContext.currentTime);
    
    leftGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    rightGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    leftGain.connect(merger, 0, 0);
    rightGain.connect(merger, 0, 1);
    merger.connect(this.audioContext.destination);
    
    leftOsc.start();
    rightOsc.start();
    
    setTimeout(() => {
      leftOsc.stop();
      rightOsc.stop();
    }, duration * 1000);
  }

  speakText(text: string, rate: number = 1, pitch: number = 1) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = 0.8;
      
      speechSynthesis.speak(utterance);
      
      return new Promise<void>((resolve) => {
        utterance.onend = () => resolve();
      });
    }
  }

  stopSpeaking() {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }
}

export const audioService = new AudioService();
