import { BaseAnimation } from "../../instances";
import { BaseModule } from "../../models";
import { setupModuleUsage } from "../../utils";

function random_rgba() {
  const o = Math.round,
    r = Math.random,
    s = 255;
  return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + ")";
}

export class BallAnimation extends BaseAnimation implements BaseModule {
  static isDev = true;

  private _ballX: number;
  private _ballY: number;
  private _velocityX: number;
  private _velocityY: number;
  private _ballRadius: number;
  private _color = random_rgba();

  constructor({ duration }: { duration: number }) {
    super(duration);

    this._ballX = 100; // Initial X position
    this._ballY = 100; // Initial Y position
    this._velocityX = 12; // Velocity in X direction
    this._velocityY = 12; // Velocity in Y direction
    this._ballRadius = 20; // Radius of the ball
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
    const canvasWidth = this._canvas$.width;
    const canvasHeight = this._canvas$.height;

    // Clear the canvas for the next frame
    this._context.clearRect(0, 0, canvasWidth, canvasHeight);

    // Update ball position
    this._ballX += this._velocityX;
    this._ballY += this._velocityY;

    // Check for collisions with canvas edges
    if (
      this._ballX + this._ballRadius > canvasWidth ||
      this._ballX - this._ballRadius < 0
    ) {
      this._velocityX *= -1; // Reverse X direction
      this._color = random_rgba();
    }

    if (
      this._ballY + this._ballRadius > canvasHeight ||
      this._ballY - this._ballRadius < 0
    ) {
      this._velocityY *= -1; // Reverse Y direction
      this._color = random_rgba();
    }

    // Draw the ball
    this._context.beginPath();
    this._context.arc(
      this._ballX,
      this._ballY,
      this._ballRadius,
      0,
      Math.PI * 2,
    );
    this._context.fillStyle = this._color;
    this._context.fill();
    this._context.closePath();
  }
}

setupModuleUsage("BallAnimation", BallAnimation);
