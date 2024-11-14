import { RefObject } from "react";

export interface TimelineAnimationProperties {
  width: number;
  left: number;
}

export type TimelineStage = Record<string, TimelineAnimationProperties>;

export type SortedTimelineStage = [string, TimelineAnimationProperties][];

export type SimplifiedTimeline = { name: string; duration: number }[];

export interface ITimelineContext {
  timelineStage: TimelineStage;
  timelineTrackWidth: RefObject<number>;
  setTimelineTrackWidth: (width: number) => void;
  adjustTimelineStage: (id: string, left: number, width: number) => void;
  createNewTimelineItem: (id: string) => void;
  removeTimelineItem: (id: string) => void;
  timelineDuration: number;
  createTimeline: () => SimplifiedTimeline;
  changeTimelineDuration: (newDuration: number) => void;
}
