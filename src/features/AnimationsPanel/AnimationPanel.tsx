import { Draggable, Droppable } from "react-beautiful-dnd";

import { DragDropConstants } from "@constants";

import { PanelContainer, AnimationItem } from "./AnimationPanel.styles";
import { useModuleLoader } from "@context/AnimationLoaderContext";
import * as AnimationModules from "@lib/ModuleRunner/src/modules/animations";
import * as GameModules from "@lib/ModuleRunner/src/modules/games";

const extractDevModules = (modules: Record<string, any>): string[] =>
  Object.values(modules)
    .filter((module) => module.isDev)
    .map((module) => module.name);

const DEV_ANIMATIONS = [
  ...extractDevModules(AnimationModules),
  ...extractDevModules(GameModules),
];

export const AnimationsPanel = () => {
  const { animationNames } = useModuleLoader();

  return (
    <Droppable droppableId={DragDropConstants.AnimationsPanelDroppableId}>
      {({ innerRef, droppableProps, placeholder }) => (
        <PanelContainer ref={innerRef} {...droppableProps}>
          <h2>Available Animations</h2>
          {[...DEV_ANIMATIONS, ...animationNames].map((animation, index) => (
            <Draggable draggableId={animation} key={animation} index={index}>
              {({
                draggableProps,
                dragHandleProps,
                innerRef: draggableInnerRef,
              }) => (
                <AnimationItem
                  ref={draggableInnerRef}
                  {...draggableProps}
                  {...dragHandleProps}
                >
                  {animation}
                </AnimationItem>
              )}
            </Draggable>
          ))}
          {placeholder}
        </PanelContainer>
      )}
    </Droppable>
  );
};
