export class TimeRenderer {
  public static WIDTH = 400;
  public static HEIGHT = 200;

  private context: CanvasRenderingContext2D;

  public constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.context.clearRect(0, 0, TimeRenderer.WIDTH, TimeRenderer.HEIGHT);
  }

  public render(soundData: Uint8Array) {
    this.context.fillStyle = "rgb(30, 30, 30)";
    this.context.fillRect(0, 0, TimeRenderer.WIDTH, TimeRenderer.HEIGHT);

    this.context.lineWidth = 1;
    this.context.strokeStyle = "rgb(255, 255, 255)";

    this.context.beginPath();
    const sliceWidth = TimeRenderer.WIDTH / soundData.length;
    let x = 0;

    for (let i = 0; i < soundData.length; i++) {
      const v = soundData[i] / 128.0;
      const y = TimeRenderer.HEIGHT - v * (TimeRenderer.HEIGHT / 2);

      if (i === 0) {
        this.context.moveTo(x, y);
      } else {
        this.context.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.context.lineTo(TimeRenderer.WIDTH, TimeRenderer.HEIGHT / 2);
    this.context.stroke();
  }
}
