import * as React from "react";
import { SimplifiedTimeline, TimelineStage } from "./TimelineContext.models.ts";
import { TimelineAnimationConstants } from "@features/TimeLine/components/TimelineAnimation";
import { TimelineContextFunctions } from "./TimelineContextFunctions.ts";
import { TimelineContext } from "./TimelineContext.tsx";
import { useDiffThrottling } from "@hooks";

export const TimelineContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [timelineStage, setTimelineStage] = React.useState<TimelineStage>({});
  const [timelineDuration, setTimelineDuration] = React.useState(60);
  const [timelineTrackWidth, setTimelineTrackWidth] = React.useState<number>(0);
  const [timelineTimestamp, setTimelineTimestamp, resetTimelineTimestamp] =
    useDiffThrottling(0, 30);

  const setInitialTimelineTrackWidth = (width: number): void => {
    setTimelineTrackWidth(width);
  };

  const adjustTimelineStage = (
    id: string,
    left: number,
    width: number,
  ): void => {
    setTimelineStage((prev) => ({
      ...prev,
      [id]: {
        left,
        width,
      },
    }));
  };

  const updateTimelineTimestamp = (elapsed: number | null): void => {
    if (elapsed === null) return resetTimelineTimestamp();

    setTimelineTimestamp(elapsed);
  };

  const changeTimelineDuration = (newDuration: number): void => {
    setTimelineDuration(newDuration);
  };

  const createNewTimelineItem = (id: string): void => {
    adjustTimelineStage(id, 0, TimelineAnimationConstants.defaultWidth);
  };

  const removeTimelineItem = (id: string) => {
    setTimelineStage((prev) =>
      Object.entries(prev).reduce(
        (acc, [animationId, props]) =>
          id === animationId ? acc : { ...acc, [animationId]: props },
        {},
      ),
    );
  };

  const createTimeline = (): SimplifiedTimeline => {
    return TimelineContextFunctions.generateTimeline(
      timelineStage,
      timelineTrackWidth,
      timelineDuration,
    );
  };

  const context = {
    timelineStage,
    timelineTimestamp,
    timelineDuration,
    timelineTrackWidth,
    createTimeline,
    removeTimelineItem,
    adjustTimelineStage,
    createNewTimelineItem,
    changeTimelineDuration,
    updateTimelineTimestamp,
    setInitialTimelineTrackWidth,
  };

  return (
    <TimelineContext.Provider value={context}>
      {children}
    </TimelineContext.Provider>
  );
};
