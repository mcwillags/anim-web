import {
  TimelineAnimation,
  TimelineItemProps,
} from "lib/animation/src/animations/models";
import { BaseTimelineItem } from "../BaseTimelineItem";

export class SlideInAnimation
  extends BaseTimelineItem
  implements TimelineAnimation
{
  private rotationAngle = 0;
  private ballX: number = 30;
  private ballY: number = 100;

  constructor({ duration }: TimelineItemProps) {
    super(duration);
  }

  proceed(context: CanvasRenderingContext2D, timestamp: number): void {
    this.calculateRemainingDuration(timestamp);

    context.clearRect(0, 0, 800, 450);

    const progress = this.calculateProgress() / 100; 
    const maxBallX = 800;

    this.ballX = 30 + (maxBallX - 30) * progress;
    this.rotationAngle += 4;

    context.save();
    context.translate(this.ballX, this.ballY);
    context.rotate((this.rotationAngle * Math.PI) / 180);

    const radius = 15;
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, "#e65c00");
    gradient.addColorStop(1, "#803300");

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
  }
}