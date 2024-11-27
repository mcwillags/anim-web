export interface TimelineAnimationProperties {
  width: number;
  left: number;
}

export type TimelineStage = Record<string, TimelineAnimationProperties>;

export type SortedTimelineStage = [string, TimelineAnimationProperties][];

export type SimplifiedTimeline = { name: string; duration: number }[];

export interface ITimelineContext {
  timelineStage: TimelineStage;
  timelineTimestamp: number;
  timelineTrackWidth: number;
  setInitialTimelineTrackWidth: (width: number) => void;
  adjustTimelineStage: (id: string, left: number, width: number) => void;
  createNewTimelineItem: (id: string) => void;
  removeTimelineItem: (id: string) => void;
  updateTimelineTimestamp: (elapsed: number | null) => void;
  timelineDuration: number;
  createTimeline: () => SimplifiedTimeline;
  changeTimelineDuration: (newDuration: number) => void;
}
