import { BaseConstants } from "../constants";
import { convertSecondsToMs, shouldPlayFrame } from "../utils";

export class BaseAnimation {
  public readonly stoppable = true;

  protected _canvas$!: HTMLCanvasElement;
  protected _context!: CanvasRenderingContext2D;
  protected _canvasWidth!: number;
  protected _canvasHeight!: number;

  private readonly _durationMs: number;
  public _playing = false;
  private _completed = false;
  private _previousTimestamp: number | null = null;
  private _elapsedMs = 0;
  private _onComplete!: () => void;
  private _onFrameComplete!: (frameDelta: number) => void;
  private _leadingAnimationFrameId?: number;

  constructor(duration: number) {
    this._durationMs = convertSecondsToMs(duration);
    this.init();
  }

  private init() {
    const canvas$ = document.querySelector<HTMLCanvasElement>(
      `#${BaseConstants.canvasId}`,
    );

    if (canvas$ === null) {
      throw new Error(
        `Canvas element with id: ${BaseConstants.canvasId} is not defined`,
      );
    }

    const context = canvas$.getContext("2d");

    if (context === null) {
      throw new Error("Canvas rendering context is null");
    }

    this._canvas$ = canvas$;
    this._context = context;
    this._canvasWidth = canvas$.width;
    this._canvasHeight = canvas$.height;
  }

  protected _start(callback?: () => void) {
    this._canvas$.style.visibility = "visible";
    this._playing = true;
    this._loop(callback);
  }

  protected _resume(callback?: () => void) {
    this._playing = true;
    this._loop(callback);
  }

  protected _stop() {
    cancelAnimationFrame(this._leadingAnimationFrameId as number);
    this._playing = false;
    this._previousTimestamp = null;
  }

  public onDestroy() {
    cancelAnimationFrame(this._leadingAnimationFrameId as number);
  }

  protected get progress() {
    return (this._elapsedMs / this._durationMs) * 100;
  }

  private _loop(callback?: () => void) {
    if (!this._playing) return;

    const frameDelta = this._getFrameTimestamp();

    const shouldPlayNextFrame = this._shouldPlayFrame(frameDelta);

    if (shouldPlayNextFrame && frameDelta) {
      this._updateFrameTimestamp(frameDelta);
      this._onFrameComplete(frameDelta);
    }

    this._checkIsCompleted();

    if (this._completed) return;

    this._leadingAnimationFrameId = requestAnimationFrame(() => {
      if (shouldPlayNextFrame && callback) {
        callback();
      }

      this._loop(callback);
    });
  }

  private _getFrameTimestamp(): number | null {
    if (this._previousTimestamp === null) {
      this._previousTimestamp = Date.now();
      return null;
    }

    return Date.now() - this._previousTimestamp;
  }

  private _shouldPlayFrame(frameDelta: number | null): boolean {
    if (frameDelta === null) return true;

    return shouldPlayFrame(frameDelta);
  }

  private _updateFrameTimestamp(frameDelta: number) {
    this._previousTimestamp = Date.now();
    this._elapsedMs += frameDelta;
  }

  private _checkIsCompleted(): void {
    if (this.progress >= 100) {
      this._completeModule();
    }
  }

  private _completeModule(): void {
    cancelAnimationFrame(this._leadingAnimationFrameId as number);
    this._context.clearRect(0, 0, 1200, 590);
    this._canvas$.style.visibility = "hidden";
    this._completed = true;
    this._playing = false;

    if (this._onComplete) {
      this._onComplete();
    }
  }

  public set onComplete(callback: () => void) {
    this._onComplete = callback;
  }

  set onFrameUpdate(callback: (frameDelta: number) => void) {
    this._onFrameComplete = callback;
  }

  public get playing(): boolean {
    return this._playing;
  }

  public get duration(): number {
    return this._durationMs;
  }
}
