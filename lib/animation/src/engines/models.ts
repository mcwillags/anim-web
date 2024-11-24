export interface AnimationEngine {
  play(
    context: CanvasRenderingContext2D,
    animationFrameTimestamp: number,
  ): void;
  stop(context: CanvasRenderingContext2D): void;
}
