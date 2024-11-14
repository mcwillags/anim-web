import * as React from "react";
import {
  ITimelineContext,
  SimplifiedTimeline,
  TimelineStage,
} from "./TimelineContext.models.ts";
import { TimelineContextFunctions } from "./TimelineContextFunctions.ts";

import { TimelineAnimationConstants } from "@features/TimeLine/components/TimelineAnimation";

export const TimelineContext = React.createContext({} as ITimelineContext);

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
          id === animationId ? acc : { ...prev, [animationId]: props },
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

  const context = React.useMemo(
    () => ({
      timelineStage,
      adjustTimelineStage,
      setTimelineTrackWidth,
      timelineDuration,
      timelineTrackWidth,
      createTimeline,
      createNewTimelineItem,
      removeTimelineItem,
      changeTimelineDuration,
    }),
    [timelineStage, adjustTimelineStage, timelineDuration],
  );

  return (
    <TimelineContext.Provider value={context}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => {
  const context = React.useContext(TimelineContext);

  if (!context) {
    throw new Error("useTimeline can be used only within TimelineContext");
  }

  return context;
};
