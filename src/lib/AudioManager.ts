import { SIZE } from "../App";

export class AudioManager {
  private audioContext: AudioContext;
  private analyzer: AnalyserNode;
  private frequencyBuffer: Uint8Array;
  private timeBuffer: Uint8Array;

  constructor() {
    this.audioContext = new AudioContext();
    this.analyzer = this.audioContext.createAnalyser();
    this.analyzer.fftSize = SIZE * 2;
    this.frequencyBuffer = new Uint8Array(this.analyzer.frequencyBinCount);
    this.timeBuffer = new Uint8Array(this.analyzer.fftSize);
  }

  public getCurrentFrequencyData() {
    this.analyzer.getByteFrequencyData(this.frequencyBuffer);
    return this.frequencyBuffer;
  }

  public getCurrentTimeData() {
    this.analyzer.getByteTimeDomainData(this.timeBuffer);
    return this.timeBuffer;
  }

  public async playFile(file: File) {
    const source = this.audioContext.createBufferSource();

    const buffer = await file.arrayBuffer();
    const decodedBuffer = await this.audioContext.decodeAudioData(buffer);
    source.buffer = decodedBuffer;

    source.connect(this.audioContext.destination);
    source.connect(this.analyzer);
    source.start();
  }

  public clean() {
    this.audioContext.close();
  }
}
