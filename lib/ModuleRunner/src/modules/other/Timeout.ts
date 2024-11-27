import { StoppableModule } from "../../models";
import { DurationRunner } from "../../utils";
import { setupModuleUsage } from "../../utils";

export default class Timeout implements StoppableModule {
  public readonly stoppable = true;

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

  set onFrameUpdate(callback: (frameDelta: number) => void) {
    this._durationRunner.onFrameUpdate = callback;
  }

  get duration(): number {
    return this._durationRunner.duration;
  }
}

setupModuleUsage("Timeout", Timeout);
