export class FFTRenderer {
  public static WIDTH = 400;
  public static HEIGHT = 200;

  private context: CanvasRenderingContext2D;

  public constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.context.clearRect(0, 0, FFTRenderer.WIDTH, FFTRenderer.HEIGHT);
  }

  public render(soundData: Uint8Array) {
    this.context.fillStyle = "rgb(30, 30, 30)";
    this.context.fillRect(0, 0, FFTRenderer.WIDTH, FFTRenderer.HEIGHT);

    this.context.lineWidth = 1;
    this.context.strokeStyle = "rgb(255, 255, 255)";

    this.context.beginPath();
    const sliceWidth = FFTRenderer.WIDTH / soundData.length;
    let x = 0;

    for (let i = 0; i < soundData.length; i++) {
      const v = soundData[i] / 128.0;
      const y = FFTRenderer.HEIGHT - v * (FFTRenderer.HEIGHT / 2) + 1;

      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.context.lineTo(FFTRenderer.WIDTH, FFTRenderer.HEIGHT + 1);
    this.context.stroke();
  }
}
