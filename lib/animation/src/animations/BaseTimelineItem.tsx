import { convertTime } from "../utils/convertTime.ts";

export class BaseTimelineItem {
  protected _completed = false;
  protected _elapsedMs = 0;
  private readonly _durationMs: number;

  constructor(_duration: number) {
    this._durationMs = convertTime(_duration);
  }

  protected calculateRemainingDuration(frameDiffMs: number) {
    this._elapsedMs += frameDiffMs;

    if (this._elapsedMs >= this._durationMs) {
      this._completed = true;
      console.log("Timeline item completed");
    }
  }

  public calculateProgress(): number {
    if (this._completed) {
      return 100;
    }

    const progress = (this._elapsedMs / this._durationMs) * 100;

    return Math.min(Math.max(progress, 0), 100);
  }

  public get completed() {
    return this._completed;
  }
}
