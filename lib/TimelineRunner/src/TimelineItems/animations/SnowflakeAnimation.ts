import {
  BaseTimelineItem,
  CommonTimelineItemProps,
  RunnerType,
} from "../../models";

export class SnowflakeAnimation
  implements BaseTimelineItem<RunnerType.ANIMATION>
{
  public readonly type = RunnerType.ANIMATION;

  private snowflakes: { x: number; y: number; size: number }[] = [];
  private readonly _duration: number;

  constructor({ duration }: CommonTimelineItemProps) {
    this._duration = duration;
    this.createSnowflakes(100);
  }

  private createSnowflakes(count: number): void {
    for (let i = 0; i < count; i++) {
      this.snowflakes.push({
        x: Math.random() * 800,
        y: Math.random() * 450,
        size: Math.random() * 5 + 2,
      });
    }
  }

  proceed(context: CanvasRenderingContext2D): void {
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

  get duration() {
    return this._duration;
  }
}
