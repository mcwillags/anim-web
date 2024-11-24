import { BaseTimelineItem, RunnerType } from "../models";
import { convertSecondsToMs } from "../utils";
import { CommonConstants } from "../constants";

export interface iFrameTimelineItem
  extends BaseTimelineItem<RunnerType.iFRAME> {
  src: string;
}

export class iFrameRunner {
  public readonly type = RunnerType.iFRAME;
  constructor(private readonly _iframe$: HTMLIFrameElement) {}

  private _elapsed = 0;
  private _timeoutId: NodeJS.Timeout | undefined;
  private _currentItem: iFrameTimelineItem | null = null;
  private onRunnerComplete: (() => void) | null = null;

  public start(
    timelineItem: iFrameTimelineItem,
    iFrameEndCallback: () => void,
  ) {
    this._currentItem = timelineItem;
    this._iframe$.style.display = "block";
    this._iframe$.src = timelineItem.src;
    this.onRunnerComplete = iFrameEndCallback;
    this._play();
  }

  public stop() {
    clearTimeout(this._timeoutId);
  }

  public resume() {
    this._play();
  }

  public destroy() {
    this._iframe$.style.display = "none";
  }

  private _complete() {
    clearTimeout(this._timeoutId);

    this._elapsed = 0;
    this._timeoutId = undefined;
    this._currentItem = null;
    this._iframe$.style.display = "none";

    if (!this.onRunnerComplete) {
      throw new Error("onRunnerComplete in iFrameRunner is not defined");
    }

    this.onRunnerComplete();
  }

  private _play() {
    if (!this._currentItem) {
      return;
    }

    this.trackProgress(this._currentItem);

    this._timeoutId = setTimeout(() => {
      this._play();
    }, CommonConstants.FPS);
  }

  private trackProgress(timelineItem: iFrameTimelineItem) {
    const timelineItemDuration = convertSecondsToMs(timelineItem.duration);

    if (timelineItemDuration <= this._elapsed) {
      this._complete();
    }

    this._elapsed += CommonConstants.FPS;
  }
}
