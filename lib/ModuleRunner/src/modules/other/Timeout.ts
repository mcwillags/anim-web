import { BaseModule } from "../../models";
import { DurationRunner } from "../../utils";
import { setupModuleUsage } from "../../utils";

export default class Timeout implements BaseModule {
  private _durationRunner: DurationRunner;

  constructor({ duration }: { duration: number }) {
    this._durationRunner = new DurationRunner(duration);
  }

  start() {
    this._durationRunner.start();
  }

  stop() {
    this._durationRunner.stop();
  }

  resume() {
    this._durationRunner.resume();
  }

  onDestroy() {
    this._durationRunner.onDestroy();
  }

  set onComplete(callback: () => void) {
    this._durationRunner.onComplete = callback;
  }
}

setupModuleUsage("Timeout", Timeout);
