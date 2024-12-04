import { useState, useEffect } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

import { DragDropConstants } from "@constants";

import { PanelContainer, AnimationItem, LoaderContainer, Loader } from "./AnimationPanel.styles";
import { useModuleLoader } from "@context/AnimationLoaderContext";

export const AnimationsPanel = () => {
  const { animationNames } = useModuleLoader();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (animationNames.length > 0) {
      setIsLoading(false);
    }
  }, [animationNames]);

  return (
    <Droppable droppableId={DragDropConstants.AnimationsPanelDroppableId}>
      {({ innerRef, droppableProps, placeholder }) => (
        <PanelContainer ref={innerRef} {...droppableProps}>
          <h2>Available Animations</h2>
          {isLoading ? (
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          ) : (
            <>
              {animationNames.map((animation, index) => (
                <Draggable
                  draggableId={animation}
                  key={animation}
                  index={index}
                >
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
            </>
          )}
        </PanelContainer>
      )}
    </Droppable>
  );
};
