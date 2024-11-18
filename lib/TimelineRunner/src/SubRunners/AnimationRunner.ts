import { RunnerType } from "../models";
import { BaseTimelineItem } from "../models";
import { convertSecondsToMs, shouldPlayFrame } from "../utils";
import { CommonConstants } from "../constants";

export interface AnimationTimelineItem
  extends BaseTimelineItem<RunnerType.ANIMATION> {
  proceed: (context: CanvasRenderingContext2D, progress: number) => void;
}

export class AnimationRunner {
  public readonly type = RunnerType.ANIMATION;
  private readonly _context: CanvasRenderingContext2D;
  constructor(private readonly _canvas$: HTMLCanvasElement) {
    const context = this._canvas$.getContext("2d");

    if (!context) {
      throw new Error("Cant get context from canvas element");
    }

    this._context = context;
  }

  private _currentItem: AnimationTimelineItem | null = null;
  private _previousFrameTimestamp: number | null = null;
  private _elapsedMs: number = 0;
  private _onAnimationEnd: (() => void) | null = null;
  private _playing: boolean = false;
  private _leadingAnimationRequestId: number | undefined;

  public start(
    timelineItem: AnimationTimelineItem,
    animationEndCallback: () => void,
  ) {
    this._canvas$.style.display = "block";
    this._currentItem = timelineItem;
    this._onAnimationEnd = animationEndCallback;
    this._playing = true;

    this._play();
  }

  public stop() {
    this._playing = false;
    cancelAnimationFrame(this._leadingAnimationRequestId as number);
    this._leadingAnimationRequestId = undefined;
    this._previousFrameTimestamp = null;
  }

  public resume() {
    this._playing = true;
    this._play();
  }

  public destroy() {
    this._canvas$.style.display = "none";
  }

  private _play() {
    if (!this._playing || !this._currentItem) {
      return cancelAnimationFrame(this._leadingAnimationRequestId as number);
    }

    if (this._previousFrameTimestamp === null) {
      this._previousFrameTimestamp = Date.now();

      const progress = this._calculateProgress(
        convertSecondsToMs(this._currentItem!.duration),
        this._elapsedMs,
      );

      this._currentItem.proceed(this._context, progress);
    } else {
      const newTimestamp = Date.now();
      const frameDiff = newTimestamp - this._previousFrameTimestamp;

      if (shouldPlayFrame(frameDiff, CommonConstants.FPS)) {
        this._previousFrameTimestamp = newTimestamp;
        this._elapsedMs += frameDiff;

        const progress = this._calculateProgress(
          convertSecondsToMs(this._currentItem!.duration),
          this._elapsedMs,
        );

        this._currentItem.proceed(this._context, progress);
      }
    }

    this._leadingAnimationRequestId = requestAnimationFrame(() => {
      this._play();
    });
  }

  private _complete() {
    cancelAnimationFrame(this._leadingAnimationRequestId as number);
    this._currentItem = null;
    this._currentItem = null;
    this._previousFrameTimestamp = null;
    this._elapsedMs = 0;
    this._playing = false;
    this._leadingAnimationRequestId = undefined;
    this._canvas$.style.display = "none";

    if (!this._onAnimationEnd) {
      throw new Error("On animation end is not defined");
    }

    this._onAnimationEnd();
  }

  private _calculateProgress(
    animationDurationMs: number,
    elapsedMs: number,
  ): number {
    const progress = (elapsedMs / animationDurationMs) * 100;

    if (progress >= 100) {
      this._complete();
      return 100;
    }

    return progress;
  }
}
