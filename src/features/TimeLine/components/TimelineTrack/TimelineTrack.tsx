import * as React from "react";
import { useLayoutEffect, useRef } from "react";
import { Droppable } from "react-beautiful-dnd";

import { DragDropConstants } from "@constants";
import { useAnimations } from "@context/AnimationContext";
import { useTimeline } from "@context/TimelineContext/";

import { TimelineAnimation } from "../TimelineAnimation/TimelineAnimation.tsx";
import { TimelineTrackFunctions } from "./TimelineTrack.functions.ts";
import { TimelineTrackContainer } from "./TimelineTrack.styles.ts";
import { TimelineAnimationConstants } from "@features/TimeLine/components/TimelineAnimation";

export const TimelineTrack: React.FC = () => {
  const { animations } = useAnimations();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { timelineStage, adjustTimelineStage, setTimelineTrackWidth } =
    useTimeline();
  const { removeAnimation } = useAnimations();

  const calculateXPosition = (
    id: string,
    animationPageX: number,
    animationWidth: number,
  ): number => {
    if (!containerRef.current) return 425 - animationPageX;

    const { left, right } = containerRef.current.getBoundingClientRect();

    const animationX = TimelineTrackFunctions.calculateAnimationX(
      animationPageX,
      animationWidth,
      left,
      right,
    );

    adjustTimelineStage(id, animationX, animationWidth);

    return animationX;
  };

  const adjustAnimationInitialPosition = (animationId: string): number => {
    if (!containerRef.current) return 0;

    const animationX = TimelineTrackFunctions.calculateInitialAnimationPosition(
      animationId,
      timelineStage,
      TimelineAnimationConstants.defaultWidth,
      containerRef.current.clientWidth,
    );

    if (animationX === null) {
      removeAnimation(animationId);
      return 0;
    }

    adjustTimelineStage(
      animationId,
      animationX,
      TimelineAnimationConstants.defaultWidth,
    );

    return animationX;
  };

  const calculateXPositionOnDragStop = (
    id: string,
    animationPageX: number,
    prevAnimationX: number,
    animationWidth: number,
  ): number => {
    if (!containerRef.current) return 425 - animationPageX;

    const { left, right } = containerRef.current.getBoundingClientRect();

    const animationX = TimelineTrackFunctions.calculateAnimationX(
      animationPageX,
      animationWidth,
      left,
      right,
    );

    const finalAnimationX = TimelineTrackFunctions.calculateFinalAnimationX(
      id,
      timelineStage,
      animationX,
      prevAnimationX,
      animationWidth,
    );

    adjustTimelineStage(id, finalAnimationX, animationWidth);

    return finalAnimationX;
  };

  const canResizeAnimation = (
    id: string,
    animationWidth: number,
    animationX: number,
  ): boolean => {
    if (!containerRef.current) return false;

    const { width } = containerRef.current.getBoundingClientRect();

    const shouldResizeAnimation = TimelineTrackFunctions.shouldResizeAnimation(
      id,
      timelineStage,
      width,
      animationX,
      animationWidth,
    );

    if (shouldResizeAnimation) {
      adjustTimelineStage(id, animationX, animationWidth);
    }

    return shouldResizeAnimation;
  };

  useLayoutEffect(() => {
    const { width } = containerRef.current!.getBoundingClientRect();

    setTimelineTrackWidth(width);
  }, []);

  return (
    <div ref={containerRef}>
      <Droppable
        droppableId={DragDropConstants.AnimationsTimelineDroppableId}
        direction="horizontal"
      >
        {({ droppableProps, innerRef, placeholder }) => (
          <>
            <TimelineTrackContainer ref={innerRef} {...droppableProps}>
              {animations.map((animationId, index) => (
                <TimelineAnimation
                  key={animationId}
                  calculateXPosition={calculateXPosition}
                  canResizeAnimation={canResizeAnimation}
                  adjustInitialPosition={adjustAnimationInitialPosition}
                  calculateXPositionOnDragStop={calculateXPositionOnDragStop}
                  id={animationId}
                  index={index}
                />
              ))}
            </TimelineTrackContainer>
            {placeholder}
          </>
        )}
      </Droppable>
    </div>
  );
};
