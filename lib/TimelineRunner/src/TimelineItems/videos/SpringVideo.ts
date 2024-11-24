import {
  BaseTimelineItem,
  RunnerType,
  CommonTimelineItemProps,
} from "../../models";

export class SpringVideo implements BaseTimelineItem<RunnerType.VIDEO> {
  public readonly type = RunnerType.VIDEO;
  private readonly _src =
    "https://cdn.pixabay.com/video/2024/11/07/240320_large.mp4";
  private readonly _duration: number;

  constructor({ duration }: CommonTimelineItemProps) {
    this._duration = duration;
  }

  get duration() {
    return this._duration;
  }

  get src() {
    return this._src;
  }
}
