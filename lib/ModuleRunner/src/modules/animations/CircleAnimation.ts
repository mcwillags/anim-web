import { BaseAnimation } from "../../instances";
import { BaseModule } from "../../models";
import { setupModuleUsage } from "../../utils";

export class CircleAnimation
  extends BaseAnimation
  implements BaseModule
{
  private angle: number = 0;
  private radius: number = 100;
  private readonly centerX: number;
  private readonly centerY: number;

  constructor({ duration }: { duration: number }) {
    super(duration);

    this.centerX = this._canvasWidth / 2;
    this.centerY = this._canvasHeight / 2;
  }

  public start() {
    this._start(this.__loop.bind(this));
  }

  public stop() {
    this._stop();
  }

  public resume() {
    this._resume(this.__loop.bind(this));
  }

  private __loop(): void {
    this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

    const progress = this.progress / 100;

    this.angle = progress * 360;

    const ballX =
      this.centerX + this.radius * Math.cos((this.angle * Math.PI) / 180);
    const ballY =
      this.centerY + this.radius * Math.sin((this.angle * Math.PI) / 180);

    this._context.save();
    this._context.translate(ballX, ballY);

    const radius = 15;
    const gradient = this._context.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, "#0000FF");
    gradient.addColorStop(1, "#0033CC");

    this._context.beginPath();
    this._context.arc(0, 0, radius, 0, Math.PI * 2);
    this._context.fillStyle = gradient;
    this._context.fill();

    this._context.strokeStyle = "#0d0d0d";
    this._context.lineWidth = 1.2;

    this._context.beginPath();
    this._context.moveTo(-radius * 0.5, 0);
    this._context.lineTo(radius * 0.5, 0);
    this._context.stroke();

    this._context.beginPath();
    this._context.moveTo(0, -radius * 0.5);
    this._context.lineTo(0, radius * 0.5);
    this._context.stroke();

    this._context.restore();

    if (progress >= 95) {
      this.showText();
    }
  }

  private showText(): void {
    this._context.save();
    this._context.fillStyle = "white";
    this._context.font = "30px Arial";
    this._context.fillText(
      "Hello world!",
      this._canvasWidth / 2,
      this._canvasHeight / 2,
    );
    this._context.restore();
  }
}

setupModuleUsage("CircleAnimation", CircleAnimation);
