import { BaseAnimation } from "../../instances";
import { RequiredTimelineModuleProps, StoppableModule } from "../../models";
import { setupModuleUsage } from "../../utils";

export class AtomAnimation extends BaseAnimation implements StoppableModule {
  static isDev = true;

  private angle: number = 45;
  private rotationSpeed: number;
  private nucleusRadius: number = 40;
  private shellRadii: [number, number] = [80, 240]; 
  private readonly colors: [string, string, string] = ["blue", "red", "green"];

  private startTime: number;

  constructor({ duration }: RequiredTimelineModuleProps) {
    super(duration);
    this.rotationSpeed = 10 / duration;
    this.startTime = performance.now();
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
    this.clearCanvas()
    const ctx = this._context;
    const width = this._canvasWidth;
    const height = this._canvasHeight;

    const elapsedTime = performance.now() - this.startTime; 
    if (elapsedTime >= this.duration * 1000) {
      this.stop();
      return;
    }

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    ctx.translate(width / 2, height / 2);

    ctx.rotate((this.angle * Math.PI) / 180);

    this.drawNucleus(ctx);

    for (let i = 0; i < 3; i++) {
      const color = this.colors[i];
      this.drawShell(ctx, this.shellRadii[0], this.shellRadii[1], color);
      this.drawElectron(ctx, this.shellRadii[0], this.shellRadii[1], color);
      ctx.rotate((120 * Math.PI) / 180);
    }

    ctx.restore();

    this.angle += this.rotationSpeed;
  }

  private drawNucleus(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(0, 0, this.nucleusRadius, 0, Math.PI * 2);
    ctx.fillStyle = "blue";
    ctx.fill();
    ctx.closePath();
  }

  private drawShell(ctx: CanvasRenderingContext2D, xRadius: number, yRadius: number, color: string): void {
    ctx.beginPath();
    ctx.ellipse(0, 0, xRadius, yRadius, 0, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }

  private drawElectron(ctx: CanvasRenderingContext2D, xRadius: number, yRadius: number, color: string): void {
    const x = xRadius * Math.cos((this.angle * 5 * Math.PI) / 180);
    const y = yRadius * Math.sin((this.angle * 5 * Math.PI) / 180);

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
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

setupModuleUsage("AtomAnimation", AtomAnimation);
