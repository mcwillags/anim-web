import { convertSecondsToMs } from "../utils";
import { BaseConstants } from "../constants";

export class DurationRunner {
  private _playing: boolean = false;
  private _elapsed: number = 0;
  private readonly _durationMs!: number;
  private _completed: boolean = false;
  private _onComplete?: () => void;
  private _onFrameUpdate?: (frameDelta: number) => void;
  private _started: boolean = false;

  constructor(duration: number) {
    this._durationMs = convertSecondsToMs(duration);
  }

  start() {
    this._playing = true;
    this._started = true;
    this._loop();
  }

  stop() {
    this._playing = false;
  }

  resume() {
    this._playing = true;
    this._loop();
  }

  onDestroy() {}

  private _loop() {
    if (!this._playing) return;

    this._calculateRemainingTime();

    if (this._completed) return;

    if (this._onFrameUpdate) this._onFrameUpdate(BaseConstants.FPS);

    setTimeout(() => this._loop(), BaseConstants.FPS);
  }

  private _calculateRemainingTime() {
    this._elapsed += BaseConstants.FPS;

    if (this._elapsed >= this._durationMs) {
      this._completeItem();
    }
  }

  private _completeItem(): void {
    if (this._onComplete) {
      this._onComplete();
    }
    this._completed = true;
  }

  set onComplete(callback: () => void) {
    this._onComplete = callback;
  }

  set onFrameUpdate(callback: (frameDelta: number) => void) {
    this._onFrameUpdate = callback;
  }

  get playing(): boolean {
    return this._playing;
  }

  get started(): boolean {
    return this._started;
  }

  get completed(): boolean {
    return this._completed;
  }

  get duration(): number {
    return this._durationMs;
  }
}
