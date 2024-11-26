import { SortedTimelineStage, TimelineStage } from "@context/TimelineContext/";
import { TimelineContextFunctions } from "@context/TimelineContext/";

const ANIMATION_SAFE_SPACE = 5;

export namespace TimelineTrackFunctions {
  const findClosestToRightAnimation = (
    id: string,
    stage: SortedTimelineStage,
  ) => {
    const currentItemIndex = stage.findIndex(([stageId]) => id === stageId);

    if (currentItemIndex === -1) {
      throw new Error("findClosestToRightAnimation it cant be undefined");
    }

    const closestToRight = stage[currentItemIndex + 1];

    if (!closestToRight) return null;

    return closestToRight[1];
  };

  const canDragToCoordinates = (
    stage: SortedTimelineStage,
    animationX: number,
    animationWidth: number,
  ): boolean => {
    for (const [, animationProperties] of stage) {
      const overlapsWithPreviousAnimation =
        animationProperties.left + animationProperties.width > animationX;
      const overlapsWithNextAnimation =
        animationX + animationWidth > animationProperties.left;

      const shouldCompareWithPrevious = animationX >= animationProperties.left;
      const shouldCompareWithNext = animationX <= animationProperties.left;

      if (shouldCompareWithPrevious && overlapsWithPreviousAnimation) {
        return false;
      }

      if (shouldCompareWithNext && overlapsWithNextAnimation) {
        return false;
      }
    }

    return true;
  };

  export const calculateInitialAnimationPosition = (
    animationId: string,
    stage: TimelineStage,
    animationWidth: number,
    containerWidth: number,
  ): number | null => {
    const sortedStage = TimelineContextFunctions.sortTimelineStageWithoutId(
      stage,
      animationId,
    );

    if (sortedStage.length === 0) return 0;

    const { 1: firstStageItem } = sortedStage[0];

    if (firstStageItem.left > animationWidth) return 0;

    for (let i = 0; i < sortedStage.length; i++) {
      const { 1: currentItem } = sortedStage[i];
      const { 1: nextItem } = sortedStage[i + 1] ?? {};

      const closestToLeftBorder = currentItem.left + currentItem.width;
      const closestToRightBorder = nextItem ? nextItem.left : containerWidth;

      const freeSpace =
        closestToRightBorder -
        ANIMATION_SAFE_SPACE -
        (closestToLeftBorder + ANIMATION_SAFE_SPACE);

      if (freeSpace > animationWidth)
        return closestToLeftBorder + ANIMATION_SAFE_SPACE;
    }

    return null;
  };

  export const calculateAnimationX = (
    animationPageX: number,
    animationWidth: number,
    containerLeftPageX: number,
    containerRightPageX: number,
  ): number => {
    if (animationPageX <= containerLeftPageX) return 0;

    const isOverflowingRight =
      animationPageX >= containerRightPageX - animationWidth;

    if (isOverflowingRight) {
      return containerRightPageX - containerLeftPageX - animationWidth;
    }

    return animationPageX - containerLeftPageX;
  };

  export const calculateFinalAnimationX = (
    animationId: string,
    timelineStage: TimelineStage,
    animationX: number,
    previousAnimationX: number,
    animationWidth: number,
  ) => {
    const sortedStage = TimelineContextFunctions.sortTimelineStageWithoutId(
      timelineStage,
      animationId,
    );

    const shouldApplyDrag = canDragToCoordinates(
      sortedStage,
      animationX,
      animationWidth,
    );

    return shouldApplyDrag ? animationX : previousAnimationX;
  };

  export const shouldResizeAnimation = (
    id: string,
    timelineStage: TimelineStage,
    containerWidth: number,
    animationX: number,
    animationWidth: number,
  ): boolean => {
    if (animationX + animationWidth > containerWidth) {
      return false;
    }

    const sortedStage =
      TimelineContextFunctions.sortTimelineStage(timelineStage);

    const closestAnimation = findClosestToRightAnimation(id, sortedStage);

    if (closestAnimation === null) {
      return true;
    }

    return animationX + animationWidth < closestAnimation.left;
  };
}
