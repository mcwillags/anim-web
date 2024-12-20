import { DurationRunner } from "../utils";
import { BaseConstants } from "../constants";

export class BaseVideo {
  protected _video$!: HTMLVideoElement;
  private readonly _durationRunner: DurationRunner;

  constructor(duration: number) {
    this._durationRunner = new DurationRunner(duration);
    this._init();
  }

  private _init() {
    const video$ = document.querySelector<HTMLVideoElement>(
      `#${BaseConstants.videoId}`,
    );

    if (video$ === null) {
      throw new Error("Video component is not defined");
    }

    this._video$ = video$;
  }

  protected _start() {
    this._video$.style.visibility = "visible";
    this._durationRunner.start();
  }

  protected _stop() {
    this._durationRunner.stop();
  }

  protected _resume() {
    this._durationRunner.resume();
  }

  protected _onDestroy() {
    this._durationRunner.onDestroy();
  }

  set onComplete(callback: () => void) {
    this._durationRunner.onComplete = () => {
      this._completeModule();
      callback();
    };
  }

  private _completeModule() {
    this._video$.style.visibility = "hidden";
  }

  get completed() {
    return this._durationRunner.completed;
  }
}
