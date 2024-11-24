import {
  TimelineItemProps,
  TimelineTimeout,
} from "lib/animation/src/animations/models";
import { BaseTimelineItem } from "../BaseTimelineItem";

export class Timeout extends BaseTimelineItem implements TimelineTimeout {
  constructor({ duration }: TimelineItemProps) {
    super(duration);
  }

  get completed(): boolean {
    return this._completed;
  }

  proceed(context: CanvasRenderingContext2D, timestamp: number): void {
    this.calculateRemainingDuration(timestamp);
    console.log("Playing timeout");
  }
}
