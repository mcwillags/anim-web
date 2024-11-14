import { Queue } from "../utils/Queue";

import { AnimationEngine } from "lib/animation/src/engines/models";
import { TimelineItem } from "lib/animation/src/animations/models";

export class SequentialAnimationEngine implements AnimationEngine {
  private _timeline: Queue<TimelineItem>;

  constructor(timeline: TimelineItem[]) {
    this._timeline = new Queue<TimelineItem>(timeline);
  }

  play(context: CanvasRenderingContext2D, frameDiffMs: number): void {
    if (this._timeline.isEmpty()) return;

    const currentAnimation = this._timeline.peek();

    if (currentAnimation!.completed) {
      this._timeline.dequeue();
      return;
    }

    currentAnimation!.proceed(context, frameDiffMs);
  }

  stop(context: CanvasRenderingContext2D): void {
    console.log(context);
  }
}
