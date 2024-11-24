import { BaseAnimation } from "../../instances";
import { CanvasConstants } from "../../constants";
import { BaseModule } from "../../models";
import { setupModuleUsage } from "../../utils";

export default class SnowflakeAnimation
  extends BaseAnimation
  implements BaseModule
{
  private snowflakes: { x: number; y: number; size: number }[] = [];

  constructor({ duration }: { duration: number }) {
    super(duration);
    this.createSnowflakes(100);
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
    this._context.clearRect(
      0,
      0,
      CanvasConstants.canvasWidth,
      CanvasConstants.canvasHeight,
    );

    for (const snowflake of this.snowflakes) {
      snowflake.y += 1;
      if (snowflake.y > CanvasConstants.canvasHeight) {
        snowflake.y = 0;
        snowflake.x = Math.random() * 1200;
      }

      this._context.beginPath();
      this._context.arc(
        snowflake.x,
        snowflake.y,
        snowflake.size,
        0,
        Math.PI * 2,
      );
      this._context.fillStyle = "white";
      this._context.fill();
    }
  }

  private createSnowflakes(count: number): void {
    for (let i = 0; i < count; i++) {
      this.snowflakes.push({
        x: Math.random() * CanvasConstants.canvasWidth,
        y: Math.random() * CanvasConstants.canvasHeight,
        size: Math.random() * 5 + 2,
      });
    }
  }
}

setupModuleUsage("SnowflakeAnimation", SnowflakeAnimation);
