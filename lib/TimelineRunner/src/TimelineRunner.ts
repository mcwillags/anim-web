import { Queue } from "../../animation/src/utils/Queue";
import { RunnerType, TimelineItem } from "./models";
import { AnimationRunner, iFrameRunner, VideoRunner } from "./SubRunners";

interface TimelineRunnerProps {
  canvas$?: HTMLCanvasElement;
  iframe$?: HTMLIFrameElement;
  video$?: HTMLVideoElement;
  timeline: TimelineItem[];
}

export class TimelineRunner {
  private readonly _animationRunner?: AnimationRunner;
  private readonly _iframeRunner?: iFrameRunner;
  private readonly _videoRunner?: VideoRunner;

  private _timeline: Queue<TimelineItem>;
  private _currentRunner: AnimationRunner | iFrameRunner | VideoRunner | null =
    null;

  constructor({ canvas$, iframe$, video$, timeline }: TimelineRunnerProps) {
    if (canvas$) {
      this._animationRunner = new AnimationRunner(canvas$);
    }
    if (iframe$) {
      this._iframeRunner = new iFrameRunner(iframe$);
    }
    if (video$) {
      this._videoRunner = new VideoRunner(video$);
    }

    this._timeline = new Queue<TimelineItem>(timeline);
    this._checkRunnerCompatibility(timeline);
  }

  public start(): void {
    this._proceedWithNextItem();
  }

  public stop(): void {
    if (this._currentRunner) {
      this._currentRunner.stop();
    }
  }

  public resume(): void {
    if (this._currentRunner) {
      this._currentRunner.resume();
    }
  }

  public destroy() {
    if (this._animationRunner) {
      this._animationRunner.destroy();
    }
    if (this._iframeRunner) {
      this._iframeRunner.destroy();
    }
    if (this._videoRunner) {
      this._videoRunner.destroy();
    }
  }

  private _proceedWithNextItem(): void {
    const currentTimelineItem = this._timeline.dequeue();
    if (currentTimelineItem === undefined) {
      return this.stop();
    }

    const currentRunner = this._getRunnerForTimelineItem(currentTimelineItem);
    if (currentRunner === null) {
      throw new Error(
        `Runner for ${currentTimelineItem.type} is not available`,
      );
    }

    this._currentRunner = currentRunner;

    this._currentRunner.start(
      currentTimelineItem as any,
      this._proceedWithNextItem.bind(this),
    );
  }

  private _checkRunnerCompatibility(timeline: TimelineItem[]) {
    const availableRunnerTypes = new Set(
      [
        this._animationRunner?.type,
        this._videoRunner?.type,
        this._iframeRunner?.type,
      ].filter((type) => type !== undefined),
    );

    const isCompatible = timeline.every((timelineItem) =>
      availableRunnerTypes.has(timelineItem.type),
    );

    if (!isCompatible) {
      throw new Error(
        `Timeline runner is not compatible, available types are: ${[...availableRunnerTypes]}`,
      );
    }
  }

  private _getRunnerForTimelineItem(
    timelineItem: TimelineItem,
  ): AnimationRunner | VideoRunner | iFrameRunner | null {
    switch (timelineItem.type) {
      case RunnerType.iFRAME:
        return this._iframeRunner ? this._iframeRunner : null;
      case RunnerType.VIDEO:
        return this._videoRunner ? this._videoRunner : null;
      case RunnerType.ANIMATION:
        return this._animationRunner ? this._animationRunner : null;
      default:
        return null;
    }
  }
}
