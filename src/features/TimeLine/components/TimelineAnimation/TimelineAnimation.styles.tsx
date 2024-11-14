import styled from "styled-components";

export const TimelineAnimationContainer = styled.div<{ isDragging: boolean }>`
  height: 100%;
  background-color: ${(props) => (props.isDragging ? "#565454" : "#3d3d3d")};
  border-radius: 4px;
  padding: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
`;

export const ResizeHandle = styled.span`
  position: absolute;
  top: 0;
  right: 5px;

  width: 15px;
  height: 50px;
  background-color: #ffffff;
`;

export const TimelineDraggable = styled.div.attrs<{
  x: number;
  isDragging: boolean;
}>((props) => ({
  style: {
    left: `${props.x}px`,
  },
}))`
  position: absolute;
  z-index: ${(props) => (props.isDragging ? 1 : 0)};
`;
