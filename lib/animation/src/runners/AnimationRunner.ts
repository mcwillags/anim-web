import { TimelineItem } from "../animations/models";
import { AnimationEngine } from "../engines/models";
import { AnimationRunnerFunctions } from "./AnimationRunner.functions.ts";

export class AppAnimationRunner {
  private _playing = true;
  private _animationEngine: AnimationEngine;
  private _leadingAnimationRequestId: number | null = null;
  private _previousFrameTimestamp: number | null = null;
  private readonly _fps = 60;

  constructor(
    Ctor: new (timeline: TimelineItem[]) => AnimationEngine,
    timeline: TimelineItem[],
  ) {
    this._animationEngine = new Ctor(timeline);
  }

  start(context: CanvasRenderingContext2D) {
    this._playing = true;

    this.play(context);
  }

  stop(): void {
    this._previousFrameTimestamp = null;
    this._playing = false;
  }

  private play(context: CanvasRenderingContext2D): void {
    if (!this._playing) {
      return cancelAnimationFrame(this._leadingAnimationRequestId as number);
    }

    if (!this._previousFrameTimestamp) {
      this._previousFrameTimestamp = Date.now();

      this._animationEngine.play(context, 0);
    } else {
      const frameDiff = Date.now() - this._previousFrameTimestamp;

      if (AnimationRunnerFunctions.shouldPlayFrame(frameDiff, this._fps)) {
        this._previousFrameTimestamp = Date.now();

        this._animationEngine.play(context, frameDiff);
      }
    }

    this._leadingAnimationRequestId = requestAnimationFrame(() => {
      this.play(context);
    });
  }
}
