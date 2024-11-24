import {
  BaseTimelineItem,
  CommonTimelineItemProps,
  RunnerType,
} from "../../models";

export class CircleAnimation implements BaseTimelineItem<RunnerType.ANIMATION> {
  public readonly type = RunnerType.ANIMATION;

  private angle: number = 0;
  private radius: number = 100;
  private readonly centerX: number;
  private readonly centerY: number;
  private readonly _duration: number;

  constructor({ duration }: CommonTimelineItemProps) {
    this._duration = duration;
    this.centerX = 400;
    this.centerY = 225;
  }

  proceed(context: CanvasRenderingContext2D, animationProgress: number): void {
    context.clearRect(0, 0, 800, 450);

    const progress = animationProgress / 100;

    this.angle = progress * 360;

    const ballX =
      this.centerX + this.radius * Math.cos((this.angle * Math.PI) / 180);
    const ballY =
      this.centerY + this.radius * Math.sin((this.angle * Math.PI) / 180);

    context.save();
    context.translate(ballX, ballY);

    const radius = 15;
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, "#0000FF");
    gradient.addColorStop(1, "#0033CC");

    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.fillStyle = gradient;
    context.fill();

    context.strokeStyle = "#0d0d0d";
    context.lineWidth = 1.2;

    context.beginPath();
    context.moveTo(-radius * 0.5, 0);
    context.lineTo(radius * 0.5, 0);
    context.stroke();

    context.beginPath();
    context.moveTo(0, -radius * 0.5);
    context.lineTo(0, radius * 0.5);
    context.stroke();

    context.restore();

    if (progress >= 95) {
      this.showText(context);
    }
  }

  private showText(context: CanvasRenderingContext2D): void {
    context.save();
    context.fillStyle = "white";
    context.font = "30px Arial";
    context.fillText("Hello world!", 350, 225);
    context.restore();
  }

  get duration() {
    return this._duration;
  }
}
