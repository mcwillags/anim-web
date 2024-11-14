import {
  SimplifiedTimeline,
  TimelineAnimationProperties,
  TimelineStage,
} from "./TimelineContext.models.ts";

import { AnimationContextFunctions } from "@context/AnimationContext";

const TIMEOUT_MIN_DURATION = 0.5;

export namespace TimelineContextFunctions {
  export const sortTimelineStage = (
    stage: TimelineStage,
  ): [string, TimelineAnimationProperties][] => {
    return Object.entries(stage).sort(
      ([_, item1], [__, item2]) => item1.left - item2.left,
    );
  };

  export const sortTimelineStageWithoutId = (
    stage: TimelineStage,
    animationId: string,
  ) => sortTimelineStage(stage).filter(([id]) => id !== animationId);

  const convertPixelToSeconds = (width: number, timelineDuration: number) =>
    timelineDuration / width;

  const widthToDuration = (width: number, durationPerPixel: number) =>
    width * durationPerPixel;

  export const generateTimeline = (
    timelineStage: TimelineStage,
    timelineWidth: number,
    timelineDuration: number,
  ): SimplifiedTimeline => {
    const sortedStage = sortTimelineStage(timelineStage);

    if (sortedStage.length === 0) return [];

    const result: SimplifiedTimeline = [];
    const secondsPerPixel = convertPixelToSeconds(
      timelineWidth,
      timelineDuration,
    );

    const { 1: firstItemProperties } = sortedStage[0];

    if (firstItemProperties.left !== 0) {
      const timeoutDuration = widthToDuration(
        firstItemProperties.left,
        secondsPerPixel,
      );

      if (timeoutDuration > TIMEOUT_MIN_DURATION)
        result.push({
          name: "Timeout",
          duration: widthToDuration(firstItemProperties.left, secondsPerPixel),
        });
    }

    for (let i = 0; i < sortedStage.length; i++) {
      const [name, current] = sortedStage[i];
      const next = sortedStage[i + 1] ? sortedStage[i + 1][1] : undefined;

      result.push({
        name: AnimationContextFunctions.extractDraggableId(name),
        duration: widthToDuration(current.width, secondsPerPixel),
      });

      if (next) {
        const timeoutDuration = widthToDuration(
          next.left - current.left - current.width,
          secondsPerPixel,
        );

        if (timeoutDuration <= TIMEOUT_MIN_DURATION) continue;

        result.push({
          name: "Timeout",
          duration: timeoutDuration,
        });
      }
    }

    return result;
  };
}
