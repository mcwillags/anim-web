import * as React from "react";
import { OnDragEndResponder } from "react-beautiful-dnd";

import { AnimationContext } from "./AnimationContext.ts";
import { AnimationContextFunctions } from "./AnimationContextFunctions.ts";
import { useTimeline } from "@context/TimelineContext";

import { DragDropConstants } from "@constants";

export const AnimationContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [animations, setAnimations] = React.useState<string[]>([]);
  const { createNewTimelineItem, removeTimelineItem } = useTimeline();

  const onAnimationDrop: OnDragEndResponder = React.useCallback(
    ({ destination, draggableId }) => {
      if (!destination) return;

      if (
        destination.droppableId !==
        DragDropConstants.AnimationsTimelineDroppableId
      )
        return;

      const newDraggableId =
        AnimationContextFunctions.createDraggableId(draggableId);

      setAnimations((prev) => [...prev, newDraggableId]);

      createNewTimelineItem(newDraggableId);
    },
    [createNewTimelineItem],
  );

  const removeAnimation = React.useCallback(
    (id: string) => {
      setAnimations((prev) => prev.filter((animationId) => id !== animationId));
      removeTimelineItem(id);
    },
    [removeTimelineItem],
  );

  const context = React.useMemo(
    () => ({
      animations,
      removeAnimation,
      onAnimationDrop,
    }),
    [animations, onAnimationDrop, removeAnimation],
  );

  return (
    <AnimationContext.Provider value={context}>
      {children}
    </AnimationContext.Provider>
  );
};
