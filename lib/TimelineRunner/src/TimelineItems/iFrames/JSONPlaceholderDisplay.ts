import {
  BaseTimelineItem,
  RunnerType,
  CommonTimelineItemProps,
} from "../../models";

export class JSONPlaceholderDisplay
  implements BaseTimelineItem<RunnerType.iFRAME>
{
  public readonly type = RunnerType.iFRAME;
  private readonly _duration: number;
  private readonly _src = "https://jsonplaceholder.typicode.com";

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
