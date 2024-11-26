import * as React from "react";
import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";
import { AnimationsPanel } from "@features/AnimationsPanel/AnimationPanel.tsx";
import { ModulePlayer } from "@features/Canvas/ModulePlayer.tsx";
import { Timeline } from "@features/TimeLine/TImeLine.tsx";
import { AppContainer } from "./MainPage.styles.ts";
import { useAnimations } from "@context/AnimationContext";

export const MainPage: React.FC = () => {
  const { onAnimationDrop } = useAnimations();

  const handleAnimationDrop: OnDragEndResponder = (...props) => {
    onAnimationDrop(...props);
  };

  return (
    <DragDropContext onDragEnd={handleAnimationDrop}>
      <AppContainer>
        <AnimationsPanel />
        <ModulePlayer />
        <Timeline />
      </AppContainer>
    </DragDropContext>
  );
};
