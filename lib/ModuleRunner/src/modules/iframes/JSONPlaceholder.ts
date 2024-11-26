import { StoppableModule } from "../../models";
import { BaseIFrame } from "../../instances";
import { setupModuleUsage } from "../../utils";

export class JSONPlaceholder extends BaseIFrame implements StoppableModule {
  private readonly _src = "https://jsonplaceholder.typicode.com";

  constructor({ duration }: { duration: number }) {
    super(duration);

    this.onComplete = this._onComplete.bind(this);
  }

  start() {
    this._iframe$.style.visibility = "visible";
    this._iframe$.src = this._src;
    this._start();
  }

  stop() {
    this._stop();
  }

  resume() {
    this._resume();
  }

  onDestroy() {
    this._onDestroy();
  }

  private _onComplete() {
    this._iframe$.style.visibility = "hidden";
  }
}

setupModuleUsage("JSONPlaceholder", JSONPlaceholder);
