import * as React from "react";
import {
  TimelineContainer,
  TimelineHeader,
  DurationContainer,
  DurationSelect,
  DurationLabel,
  TimeIndicators,
  TimeMarker,
} from "./TimeLine.styles";
import { TimelineTrack } from "./components/TimelineTrack/TimelineTrack.tsx";
import { useTimeline } from "@context/TimelineContext";
import { TimelineContextConstants } from "@context/TimelineContext";

export const Timeline = () => {
  const { timelineDuration, changeTimelineDuration } = useTimeline();
  const [timeMarkers, setTimeMarkers] = React.useState<number[]>([]);

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

  return (
    <TimelineContainer>
      <TimelineHeader>
        <h2>Timeline</h2>
        <DurationContainer>
          <DurationLabel>Duration:</DurationLabel>
          <DurationSelect
            value={timelineDuration}
            onChange={handleDurationChange}
          >
            {TimelineContextConstants.timelineDurations.map((option) => (
              <option value={option}>{option} seconds</option>
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

      <TimelineTrack />
    </TimelineContainer>
  );
};
