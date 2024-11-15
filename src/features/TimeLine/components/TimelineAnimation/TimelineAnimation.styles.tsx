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

export const ContextMenu = styled.div`
  position: absolute;
  top: 0; 
  left: 0; 
  background-color: #2d2d2d; 
  border: 1px solid #444; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5); 
  padding: 8px;
  z-index: 100;
  border-radius: 4px;


  transform: translate(calc(100% + 5px), -50%); 

  button {
    background-color: #3d3d3d; 
    border: none;
    color: white; 
    padding: 6px 12px; 
    cursor: pointer;
    border-radius: 4px; 
    transition: background-color 0.2s; 

    &:hover {
      background-color: #4d4d4d; 
    }
  }
`;