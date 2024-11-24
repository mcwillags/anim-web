import { CanvasConstants } from "../../../../constants";
import { SnakePosition } from "..//models";

const SEGMENT_SIZE = 40;
const SEGMENTS_X_LENGTH = CanvasConstants.canvasWidth / SEGMENT_SIZE;
const SEGMENTS_Y_LENGTH = CanvasConstants.canvasHeight / SEGMENT_SIZE;

const DEFAULT_SNAKE_SETTINGS = {
  stroke: "#212f6e",
  fill: "#4359ab",
};

const getInitialSnakePosition = () => ({
  x: Math.round(SEGMENTS_X_LENGTH / 2) * SEGMENT_SIZE,
  y: Math.round(SEGMENTS_Y_LENGTH / 2) * SEGMENT_SIZE,
});

export class GameRenderer {
  private _segments: SnakePosition[] = [];

  constructor(private readonly _context: CanvasRenderingContext2D) {}

  init() {
    this._segments.push(getInitialSnakePosition());
  }

  render() {
    this._context.clearRect(
      0,
      0,
      CanvasConstants.canvasWidth,
      CanvasConstants.canvasHeight,
    );

    this._context.fillStyle = DEFAULT_SNAKE_SETTINGS.fill;
    this._context.strokeStyle = DEFAULT_SNAKE_SETTINGS.stroke;

    this._segments.forEach((segment) => {
      this._context.beginPath();
      this._context.rect(segment.x, segment.y, SEGMENT_SIZE, SEGMENT_SIZE);
      this._context.fill();
      this._context.stroke();
      this._context.closePath();
    });

    const lastSegment = this._segments.shift();

    this._segments.push({
      x: lastSegment!.x - SEGMENT_SIZE,
      y: lastSegment!.y,
    });
  }
}
