import { TimelineAnimation, TimelineItemProps } from '../models';
import { BaseTimelineItem } from "../BaseTimelineItem";

export class SnowflakeAnimation 
  extends BaseTimelineItem 
  implements TimelineAnimation {
  private snowflakes: { x: number; y: number; size: number }[] = [];

  constructor({ duration }: TimelineItemProps) {
    super (duration);
    this.createSnowflakes(100);
  }

  private createSnowflakes(count: number): void {
    for (let i = 0; i < count; i++) {
      this.snowflakes.push({
        x: Math.random() * 800,
        y: Math.random() * 450,
        size: Math.random() * 5 + 2 
      });
    }
  }

  proceed(context: CanvasRenderingContext2D, timestamp: number): void {
    this.calculateRemainingDuration(timestamp);
    context.clearRect(0, 0, 800, 450);

    for (const snowflake of this.snowflakes) {
      snowflake.y += 1;
      if (snowflake.y > 450) {
        snowflake.y = 0;
        snowflake.x = Math.random() * 800;
      }

      context.beginPath();
      context.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
      context.fillStyle = "white";
      context.fill();
    }
  }
}