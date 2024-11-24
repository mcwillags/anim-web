import { BaseAnimation } from "../../instances";
import { BaseModule } from "../../models";
import { setupModuleUsage } from "../../utils";

export class SlideInAnimation
  extends BaseAnimation
  implements BaseModule
{
  private rotationAngle = 0;
  private ballX: number = 30;
  private ballY: number = 100;

  constructor({ duration }: { duration: number }) {
    super(duration);
  }

  start() {
    this._start(this.__loop.bind(this));
  }
  stop() {
    this._stop();
  }

  resume() {
    this._resume(this.__loop.bind(this));
  }

  private __loop(): void {
    this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);

    const progress = this.progress / 100;

    const maxBallX = this._canvasWidth;

    this.ballX = 30 + (maxBallX - 30) * progress;
    this.rotationAngle += 4;

    this._context.save();
    this._context.translate(this.ballX, this.ballY);
    this._context.rotate((this.rotationAngle * Math.PI) / 180);

    const radius = 15;
    const gradient = this._context.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, "#e65c00");
    gradient.addColorStop(1, "#803300");

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

    this._context.lineTo(0, radius * 0.5);
    this._context.stroke();

    this._context.restore();
  }
}

setupModuleUsage("SlideInAnimation", SlideInAnimation);
