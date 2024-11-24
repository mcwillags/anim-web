import { DurationRunner } from "../utils";
import { BaseConstants } from "../constants";

export class BaseIFrame {
  protected _iframe$!: HTMLIFrameElement;
  private readonly _durationRunner: DurationRunner;

  constructor(duration: number) {
    this._durationRunner = new DurationRunner(duration);
    this._init();
  }

  private _init() {
    const iframe = document.querySelector<HTMLIFrameElement>(
      `#${BaseConstants.iframeId}`,
    );

    if (iframe === null) {
      throw new Error("iFrame element is not defined");
    }

    this._iframe$ = iframe;
  }

  protected _start() {
    this._iframe$.style.visibility = "visible";
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
    this._iframe$.style.visibility = "hidden";
  }

  set onComplete(callback: () => void) {
    this._durationRunner.onComplete = () => {
      this._iframe$.style.visibility = "hidden";
      callback();
    };
  }

  get completed(): boolean {
    return this._durationRunner.completed;
  }
}
