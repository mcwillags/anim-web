import {
  BaseTimelineItem,
  CommonTimelineItemProps,
  RunnerType,
} from "../../models";

export class Timeout implements BaseTimelineItem<RunnerType.ANIMATION> {
  public readonly type = RunnerType.ANIMATION;

  private readonly _duration: number;

  constructor({ duration }: CommonTimelineItemProps) {
    this._duration = duration;
  }

  proceed(): void {}

  get duration() {
    return this._duration;
  }
}
