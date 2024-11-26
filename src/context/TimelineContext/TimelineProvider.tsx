import * as React from "react";
import { SimplifiedTimeline, TimelineStage } from "./TimelineContext.models.ts";
import { TimelineAnimationConstants } from "@features/TimeLine/components/TimelineAnimation";
import { TimelineContextFunctions } from "./TimelineContextFunctions.ts";
import { TimelineContext } from "./TimelineContext.tsx";

export const TimelineContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [timelineStage, setTimelineStage] = React.useState<TimelineStage>({});
  const timelineTrackWidth = React.useRef<number>(0);
  const [timelineDuration, setTimelineDuration] = React.useState(60);

  const setTimelineTrackWidth = (width: number) => {
    timelineTrackWidth.current = width;
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

  const changeTimelineDuration = (newDuration: number) => {
    setTimelineDuration(newDuration);
  };

  const createNewTimelineItem = (id: string) => {
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
      timelineTrackWidth.current,
      timelineDuration,
    );
  };

  const context = {
    timelineStage,
    adjustTimelineStage,
    setTimelineTrackWidth,
    timelineDuration,
    timelineTrackWidth,
    createTimeline,
    createNewTimelineItem,
    removeTimelineItem,
    changeTimelineDuration,
  };

  return (
    <TimelineContext.Provider value={context}>
      {children}
    </TimelineContext.Provider>
  );
};