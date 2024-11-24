import * as React from "react";
import { Resizable, ResizeCallbackData } from "react-resizable";
import {
  ResizeHandle,
  TimelineAnimationContainer,
  TimelineDraggable,
  ContextMenu,
} from "./TimelineAnimation.styles.tsx";
import { TimelineAnimationConstants } from "./TimelineAnimation.constants.ts";
import {
  useAnimationPropertiesBeforeDrag,
  useOnClickOutside,
} from "@features/TimeLine/hooks";

interface TimelineAnimationProps {
  id: string;
  calculateXPosition: (
    id: string,
    animationX: number,
    animationWidth: number,
  ) => number;
  calculateXPositionOnDragStop: (
    id: string,
    animationX: number,
    animationWidth: number,
    prevAnimationX: number,
  ) => number;
  canResizeAnimation: (
    id: string,
    animationWidth: number,
    animationX: number,
  ) => boolean;
  adjustInitialPosition: (id: string) => number;
  handleRemoveAnimation: (id: string) => void;
}

export const TimelineAnimation: React.FC<TimelineAnimationProps> = ({
  id,
  calculateXPosition,
  canResizeAnimation,
  calculateXPositionOnDragStop,
  adjustInitialPosition,
  handleRemoveAnimation,
}) => {
  const [isResizing, setIsResizing] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [x, setX] = React.useState(0);
  const prevAnimationX = useAnimationPropertiesBeforeDrag(x, isDragging);
  const [containerWidth, setContainerWidth] = React.useState(
    TimelineAnimationConstants.defaultWidth,
  );
  const contextMenuRef = React.useRef<HTMLDivElement>(null);

  const [showContextMenu, setShowContextMenu] = React.useState(false);

  React.useEffect(() => {
    setX(adjustInitialPosition(id));
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: React.DragEvent) => {
    setX(calculateXPosition(id, event.pageX, containerWidth));
  };

  const handleDragEnd = (event: React.DragEvent) => {
    setIsDragging(false);
    setX(
      calculateXPositionOnDragStop(
        id,
        event.pageX,
        prevAnimationX,
        containerWidth,
      ),
    );
  };

  const handleResize = (_: unknown, { size }: ResizeCallbackData) => {
    const shouldResize = canResizeAnimation(id, size.width, x);

    if (!shouldResize) return;

    setContainerWidth(size.width);
  };

  const handleResizeStart = () => {
    setIsResizing(true);
  };

  const handleResizeStop = () => {
    setIsResizing(false);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setShowContextMenu(true);
  };

  const handleDelete = () => {
    handleRemoveAnimation(id);
  };

  useOnClickOutside(contextMenuRef, () => {
    setShowContextMenu(false);
  });

  return (
    <TimelineDraggable
      draggable={!isResizing}
      onDrag={handleDrag}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      isDragging={isDragging}
      x={x}
      onContextMenu={handleContextMenu}
    >
      <Resizable
        width={containerWidth}
        height={50}
        minConstraints={[110, 50]}
        axis="x"
        handle={<ResizeHandle />}
        onResize={handleResize}
        onResizeStart={handleResizeStart}
        onResizeStop={handleResizeStop}
      >
        <div style={{ width: containerWidth, height: 50 }}>
          <TimelineAnimationContainer isDragging={isDragging}>
            {id}
          </TimelineAnimationContainer>
        </div>
      </Resizable>

      {showContextMenu && (
        <ContextMenu ref={contextMenuRef}>
          <button onClick={handleDelete}>Delete</button>
        </ContextMenu>
      )}
    </TimelineDraggable>
  );
};
