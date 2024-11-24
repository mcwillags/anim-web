import { BaseModule } from "../models";
import { Queue, setupModuleUsage } from "../utils";

export class ModuleRunner {
  private _timeline: Queue<BaseModule>;
  private _currentModule: BaseModule | undefined;
  private _completed: boolean = false;
  private _onComplete?: () => void;

  private _onForcePause?: () => void;
  private _onForcePlay?: () => void;

  constructor(timeline: BaseModule[]) {
    if (timeline.length === 0) {
      this._completed = true;
    }

    this._timeline = new Queue<BaseModule>(timeline);
  }

  start() {
    this._proceedWithNextModule();
  }

  resume() {
    if (this._currentModule) {
      this._currentModule.resume();
    }
  }

  stop() {
    if (this._currentModule) {
      this._currentModule.stop();
    }
  }

  onDestroy() {
    if (this._currentModule) {
      this._currentModule.onDestroy();
    }
  }

  private _proceedWithNextModule(shouldForcePlay = false): void {
    if (!this._timeline.peek()) {
      this._completeRunner();

      return;
    }

    if (shouldForcePlay && this._onForcePlay) {
      this._onForcePlay();
    }

    this._currentModule = this._timeline.dequeue();

    if (this._currentModule!.shouldForcePause && this._onForcePause) {
      this._onForcePause();
    }

    this._currentModule!.onComplete = this._proceedWithNextModule.bind(this);

    this._currentModule!.start();
  }

  private _completeRunner() {
    if (this._onComplete) {
      this._onComplete();
    }
    this._completed = true;
  }

  set onComplete(callback: () => void) {
    this._onComplete = callback;
  }

  set onForcePause(callback: () => void) {
    this._onForcePause = callback;
  }

  set onForcePlay(callback: () => void) {
    this._onForcePlay = callback;
  }

  get completed(): boolean {
    return this._completed;
  }
}

setupModuleUsage("ModuleRunner", ModuleRunner);
