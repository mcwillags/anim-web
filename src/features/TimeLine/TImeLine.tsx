import * as React from "react";
import {
  TimelineContainer,
  TimelineHeader,
  DurationContainer,
  DurationSelect,
  DurationLabel,
  TimeIndicators,
  TimeMarker,
  TimelineCursor,
  TimelineCursorContainer,
} from "./TimeLine.styles";
import { TimelineTrack } from "./components/TimelineTrack/TimelineTrack.tsx";
import { useTimeline } from "@context/TimelineContext";
import { TimelineContextConstants } from "@context/TimelineContext";
import { TimelineFunctions } from "@features/TimeLine/Timeline.functions.ts";

export const Timeline = () => {
  const [timeMarkers, setTimeMarkers] = React.useState<number[]>([]);
  const {
    timelineDuration,
    changeTimelineDuration,
    timelineTimestamp,
    timelineTrackWidth,
  } = useTimeline();

  const formatTime = (time: number): string => {
    return Number(time.toFixed(1)) + "s";
  };

  React.useEffect(() => {
    const markers = [];
    const step = timelineDuration / 6;
    for (let i = 0; i <= timelineDuration; i += step) {
      markers.push(i);
    }
    setTimeMarkers(markers);
  }, [timelineDuration]);

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      changeTimelineDuration(value);
    }
  };

  const cursorPosition = TimelineFunctions.calculateCursorPosition(
    timelineTimestamp,
    timelineDuration,
    timelineTrackWidth,
  );

  return (
    <TimelineContainer>
      <TimelineHeader>
        <DurationContainer>
          <DurationLabel>Duration:</DurationLabel>
          <DurationSelect
            value={timelineDuration}
            onChange={handleDurationChange}
          >
            {TimelineContextConstants.timelineDurations.map((option) => (
              <option key={option} value={option}>
                {option} seconds
              </option>
            ))}
          </DurationSelect>
        </DurationContainer>
      </TimelineHeader>

      <TimeIndicators>
        {timeMarkers.map((time) => (
          <TimeMarker
            key={time}
            style={{ left: `${(time / timelineDuration) * 100}%` }}
          >
            {formatTime(time)}
          </TimeMarker>
        ))}
      </TimeIndicators>

      <TimelineCursorContainer>
        <TimelineCursor x={cursorPosition} />
      </TimelineCursorContainer>

      <TimelineTrack />
    </TimelineContainer>
  );
};
