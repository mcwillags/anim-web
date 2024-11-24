import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";

import { AnimationsPanel } from "@features/AnimationsPanel/AnimationPanel";
import { Timeline } from "@features/TimeLine/TImeLine";
import { useAnimations } from "@context/AnimationContext";

import { AppContainer } from "./App.styles";
import { ModulePlayer } from "@features/Canvas/ModulePlayer.tsx";

function App() {
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
}

export default App;
