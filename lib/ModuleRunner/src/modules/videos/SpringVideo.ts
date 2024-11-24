import { BaseVideo } from "../../instances";
import { BaseModule } from "../../models";
import { setupModuleUsage } from "../../utils";

export default class SpringVideo extends BaseVideo implements BaseModule {
  private readonly _src =
    "https://cdn.pixabay.com/video/2024/11/07/240320_large.mp4";

  constructor({ duration }: { duration: number }) {
    super(duration);

    this.onComplete = this._onComplete.bind(this);
  }

  start(): void {
    this._video$.style.visibility = "visible";
    this._video$.src = this._src;
    this._start();
  }

  stop(): void {
    this._video$.pause();
    this._stop();
  }

  resume(): void {
    this._video$.play();
    this._resume();
  }

  onDestroy() {
    this._onDestroy();
  }

  private _onComplete() {
    this._video$.style.visibility = "hidden";
  }
}

setupModuleUsage("SpringVideo", SpringVideo);
