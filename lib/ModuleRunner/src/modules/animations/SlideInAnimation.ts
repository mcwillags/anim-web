import { BaseAnimation } from "../../instances";
import { RequiredTimelineModuleProps, StoppableModule } from "../../models";
import { setupModuleUsage } from "../../utils";

export class SlideInAnimation extends BaseAnimation implements StoppableModule {
  static isDev = true;
  private ballX: number = 30;
  private ballY: number = 400;
  private rotationAngle = 0;

  constructor({ duration }: RequiredTimelineModuleProps) {
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
    this.rotationAngle += 6;

    this._context.save();
    this._context.translate(this.ballX, this.ballY);
    this._context.rotate((this.rotationAngle * Math.PI) / 180);

    this.drawBall();
    this._context.restore();

    this.drawShadow();
  }

  private drawBall(): void {
    const radius = 50;

    this._context.beginPath();
    this._context.arc(0, 0, radius, 0, Math.PI * 2);
    this._context.fillStyle = "#e76f51";
    this._context.fill();
    this._context.lineWidth = 3;
    this._context.strokeStyle = "#333";
    this._context.stroke();

    this._context.beginPath();
    this._context.moveTo(-radius, 0);
    this._context.lineTo(radius, 0);
    this._context.stroke();

    this._context.beginPath();
    this._context.moveTo(0, -radius); 
    this._context.lineTo(0, radius);
    this._context.stroke();

    this._context.beginPath();
    this._context.arc(0, -41, radius * 0.5, Math.PI, 0, true);
    this._context.stroke();

    this._context.beginPath();
    this._context.arc(0, 82 * 0.5, radius * 0.5, 0, Math.PI, true);
    this._context.stroke();

  }

  private drawShadow(): void {
    const shadowWidth = 100;
    const shadowHeight = 15;
    const shadowOpacity = 0.2;
    // const scaleFactor = 0.7 + 0.3 * Math.abs(Math.sin((this.rotationAngle * Math.PI) / 180));

    this._context.save();
    this._context.translate(this.ballX, this.ballY + 50);
    this._context.scale(1, 1);

    this._context.beginPath();
    this._context.ellipse(0, 0, shadowWidth / 2, shadowHeight / 2, 0, 0, Math.PI * 2);
    this._context.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
    this._context.fill();

    this._context.restore();
  }
}

setupModuleUsage("SlideInAnimation", SlideInAnimation);
