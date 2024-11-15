import { Draggable, Droppable } from "react-beautiful-dnd";

import { DragDropConstants } from "@constants";

import { PanelContainer, AnimationItem } from "./AnimationPanel.styles";

const animations = [
  { id: "SlideInAnimation", name: "Slide In Animation" },
  { id: "CircleAnimation", name: "New Animka" },
  { id:"SnowflakeAnimation", name:"Snowflakes"}
  // Додайте інші анімації тут
];

export const AnimationsPanel = () => {
  return (
    <Droppable droppableId={DragDropConstants.AnimationsPanelDroppableId}>
      {({ innerRef, droppableProps, placeholder }) => (
        <PanelContainer ref={innerRef} {...droppableProps}>
          <h2>Available Animations</h2>
          {animations.map((animation, index) => (
            <Draggable
              draggableId={animation.id}
              key={animation.id}
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
                  {animation.name}
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