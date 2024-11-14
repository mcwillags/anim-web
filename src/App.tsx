import { DragDropContext, OnDragEndResponder } from "react-beautiful-dnd";

import { AnimationsPanel } from "@features/AnimationsPanel/AnimationPanel";
import { Canvas } from "@features/Canvas/Canvas";
import { Timeline } from "@features/TimeLine/TImeLine";
import { useAnimations } from "@context/AnimationContext";

import { AppContainer } from "./App.styles";

function App() {
  const { onAnimationDrop } = useAnimations();

  const handleAnimationDrop: OnDragEndResponder = (...props) => {
    onAnimationDrop(...props);
  };

  return (
    <DragDropContext onDragEnd={handleAnimationDrop}>
      <AppContainer>
        <AnimationsPanel />
        <Canvas />
        <Timeline />
      </AppContainer>
    </DragDropContext>
  );
}

export default App;
