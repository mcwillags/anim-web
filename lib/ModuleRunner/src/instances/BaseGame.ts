import { convertSecondsToMs, shouldPlayFrame } from "../utils";
import { BaseConstants } from "../constants";

export class BaseGame {
  public shouldForcePause = true;

  protected _canvas$!: HTMLCanvasElement;
  protected _context!: CanvasRenderingContext2D;

  private readonly _FPS: number;
  private _playing: boolean = false;
  private _leadingAnimationFrame?: number;
  private _prevTimestamp?: number;
  protected _onComplete?: (shouldForcePlay: boolean) => void;

  private readonly _durationMs: number;

  constructor(duration: number, FPS = BaseConstants.FPS) {
    this._durationMs = convertSecondsToMs(duration);
    this._FPS = FPS;
  }

  protected _initRenderingComponents() {
    const canvas$ = document.querySelector<HTMLCanvasElement>(
      `#${BaseConstants.canvasId}`,
    );

    if (canvas$ === null) {
      throw new Error("Canvas element is not defined");
    }

    const context = canvas$.getContext("2d");

    if (context === null) {
      throw new Error("Canvas rendering context is not defined");
    }

    this._canvas$ = canvas$;
    this._context = context;
  }

  protected _start(callback: () => void) {
    this._playing = true;
    this._canvas$.style.visibility = "visible";
    this._loop(callback);
  }

  protected _cleanUp() {
    cancelAnimationFrame(this._leadingAnimationFrame as number);
    this._context.clearRect(0, 0, 1200, 590);
    this._canvas$.style.visibility = "hidden";
    this._playing = false;
  }

  private _loop(callback: () => void) {
    if (!this._playing) return;

    if (!this._shouldPlayNextFrame()) {
      this._leadingAnimationFrame = requestAnimationFrame(() =>
        this._loop(callback),
      );
      return;
    }

    callback();

    this._leadingAnimationFrame = requestAnimationFrame(() =>
      this._loop(callback),
    );
  }

  private _shouldPlayNextFrame(): boolean {
    if (this._prevTimestamp === undefined) {
      this._prevTimestamp = Date.now();
      return true;
    }

    const frameDelta = Date.now() - this._prevTimestamp;

    if (shouldPlayFrame(frameDelta, this._FPS)) {
      this._prevTimestamp = Date.now();
      return true;
    }

    return false;
  }

  public stop() {}

  public resume() {}

  public get duration() {
    return this._durationMs;
  }

  public set onComplete(callback: () => void) {
    this._onComplete = callback;
  }
}
