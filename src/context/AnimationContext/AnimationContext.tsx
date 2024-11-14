import * as React from "react";
import { OnDragEndResponder } from "react-beautiful-dnd";

import { IAnimationContext } from "./AnimationContext.models.ts";
import { AnimationContextFunctions } from "./AnimationContextFunctions.ts";
import { useTimeline } from "@context/TimelineContext";

import { DragDropConstants } from "@constants";

const AnimationContext = React.createContext({} as IAnimationContext);

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

  const removeAnimation = (id: string) => {
    setAnimations((prev) => prev.filter((animationId) => id !== animationId));
    removeTimelineItem(id);
  };

  const context = React.useMemo(
    () => ({
      animations,
      removeAnimation,
      onAnimationDrop,
    }),
    [animations, onAnimationDrop],
  );

  return (
    <AnimationContext.Provider value={context}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimations = () => {
  const context = React.useContext(AnimationContext);

  if (!context) {
    throw new Error(
      "useAnimations should be used within AnimationContextProvider",
    );
  }

  return context;
};
