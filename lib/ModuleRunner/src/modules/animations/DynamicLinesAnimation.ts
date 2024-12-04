import { BaseAnimation } from "../../instances";
import { RequiredTimelineModuleProps, StoppableModule } from "../../models";
import { setupModuleUsage } from "../../utils";

export class DynamicLinesAnimation extends BaseAnimation implements StoppableModule {
  static isDev = true;

  private lines: Line[] = [];
  private opts = {
    len: 20,
    count: 50,
    baseTime: 10,
    addedTime: 10,
    dieChance: 0.05,
    spawnChance: 1,
    sparkChance: 0.1,
    sparkDist: 10,
    sparkSize: 2,
    color: "hsl(hue, 100%, light%)",
    baseLight: 50,
    addedLight: 10,
    shadowToTimePropMult: 6,
    baseLightInputMultiplier: 0.01,
    addedLightInputMultiplier: 0.02,
    cx: 0,
    cy: 0,
    repaintAlpha: 0.04,
    hueChange: 0.1,
  };
  private tick = 0;

  private _cycleDuration: number; 
  private _timeScale: number;

  constructor({ duration }: RequiredTimelineModuleProps) {
    super(duration);

    this._cycleDuration = 5;
    this._timeScale = this.calculateTimeScale(duration);

    this.resize();
  }

  private calculateTimeScale(duration: number): number {
    return this._cycleDuration / duration;
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

  private resize() {
    this.opts.cx = this._canvasWidth / 2;
    this.opts.cy = this._canvasHeight / 2;
  }

  private __loop(): void {
    this.tick++;

    this._context.globalCompositeOperation = "source-over";
    this._context.shadowBlur = 0;

    this._context.globalCompositeOperation = "lighter";

    if (
      this.lines.length < this.opts.count &&
      Math.random() < this.opts.spawnChance
    ) {
      this.lines.push(new Line(this.tick, this.opts));
    }

    this.lines.forEach((line) => line.step(this._context, this._timeScale));

    if (this.tick >= this._cycleDuration * this._timeScale) {
      if (this.progress >= 100) {
        this.clearCanvas();
      }
    }
}

private clearCanvas(): void {
  this._context.globalCompositeOperation = "source-over";
  this._context.shadowColor = "rgba(0, 0, 0, 0)";
  this._context.shadowBlur = 0;
  this._context.globalAlpha = 1;
  this._context.lineWidth = 1;
  this._context.clearRect(0, 0, this._canvasWidth, this._canvasHeight);
}
}

class Line {
  private x = 0;
  private y = 0;
  private addedX = 0;
  private addedY = 0;
  private rad = 0;
  private cumulativeTime = 0;
  private time = 0;
  private targetTime = 0;
  private color: string | undefined;
  private lightInputMultiplier: number | undefined;

  constructor(private tick: number, private opts: any) {
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.addedX = 0;
    this.addedY = 0;

    this.rad = 0;

    this.lightInputMultiplier =
      this.opts.baseLightInputMultiplier +
      this.opts.addedLightInputMultiplier * Math.random();

    this.color = this.opts.color.replace("hue", this.tick * this.opts.hueChange);
    this.cumulativeTime = 0;

    this.beginPhase();
  }

  beginPhase() {
    this.x += this.addedX;
    this.y += this.addedY;

    this.time = 0;
    this.targetTime = Math.round(
      this.opts.baseTime + this.opts.addedTime * Math.random()
    );

    const baseRad = (Math.PI * 2) / 6;
    this.rad += baseRad * (Math.random() < 0.5 ? 1 : -1);
    this.addedX = Math.cos(this.rad);
    this.addedY = Math.sin(this.rad);

    const dieX = this.opts.cx / this.opts.len;
    const dieY = this.opts.cy / this.opts.len;

    if (
      Math.random() < this.opts.dieChance ||
      this.x > dieX ||
      this.x < -dieX ||
      this.y > dieY ||
      this.y < -dieY
    ) {
      this.reset();
    }
  }

  step(context: CanvasRenderingContext2D, timeScale: number) {
    this.time += timeScale;
    this.cumulativeTime += timeScale;

    if (this.time >= this.targetTime) this.beginPhase();

    const prop = this.time / this.targetTime;
    const wave = Math.sin((prop * Math.PI) / 2);
    const x = this.addedX * wave;
    const y = this.addedY * wave;

    context.shadowBlur = prop * this.opts.shadowToTimePropMult;
    context.fillStyle = context.shadowColor = this.color?.replace(
      "light",
      this.opts.baseLight +
      this.opts.addedLight * Math.sin(this.cumulativeTime * (this.lightInputMultiplier || 0))
    ) || "";
    context.fillRect(
      this.opts.cx + (this.x + x) * this.opts.len,
      this.opts.cy + (this.y + y) * this.opts.len,
      2,
      2
    );

    if (Math.random() < this.opts.sparkChance) {
      context.fillRect(
        this.opts.cx +
          (this.x + x) * this.opts.len +
          Math.random() * this.opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) -
          this.opts.sparkSize / 2,
        this.opts.cy +
          (this.y + y) * this.opts.len +
          Math.random() * this.opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) -
          this.opts.sparkSize / 2,
        this.opts.sparkSize,
        this.opts.sparkSize
      );
    }
  }
}

setupModuleUsage("DynamicLinesAnimation", DynamicLinesAnimation);
