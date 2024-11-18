import {
  AnimationTimelineItem,
  iFrameTimelineItem,
  VideoTimelineItem,
} from "../SubRunners";

export const enum RunnerType {
  ANIMATION = "ANIMATION",
  VIDEO = "VIDEO",
  iFRAME = "iFRAME",
}

export interface BaseTimelineItem<Type extends RunnerType> {
  type: Type;
  duration: number;
}

export interface CommonTimelineItemProps {
  duration: number;
}

export type TimelineItem =
  | VideoTimelineItem
  | AnimationTimelineItem
  | iFrameTimelineItem;
