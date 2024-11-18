import { BaseTimelineItem, RunnerType } from "../models";

export interface VideoTimelineItem extends BaseTimelineItem<RunnerType.VIDEO> {
  src: string;
}

export class VideoRunner {
  public readonly type = RunnerType.VIDEO;
  constructor(private readonly _video$: HTMLVideoElement) {}

  private _currentItem: VideoTimelineItem | null = null;

  public start(timelineItem: VideoTimelineItem, videoEndCallback: () => void) {
    this._video$.style.display = "block";
    this._currentItem = timelineItem;
    this._video$.src = timelineItem.src;
    this._video$.onended = () => {
      this._complete();
      videoEndCallback();
    };
    this._runUntilVideoDurationSet();
    this.resume();
  }

  public stop() {
    this._video$.pause();
  }

  public resume() {
    this._video$.play();
  }

  private _complete() {
    this._video$.style.display = "none";
  }

  public destroy() {
    this._video$.style.display = "none";
  }

  private _runUntilVideoDurationSet() {
    if (this._currentItem === null) {
      throw new Error("Run until video duration is not set");
    }

    setTimeout(() => {
      if (Number.isFinite(this._video$.duration)) {
        return (this._video$.playbackRate = this._calculatePlaybackRate(
          this._video$.duration,
          this._currentItem!.duration,
        ));
      }

      this._runUntilVideoDurationSet();
    }, 50);
  }

  private _calculatePlaybackRate(
    videoDuration: number,
    timelineDuration: number,
  ) {
    return videoDuration / timelineDuration;
  }
}
