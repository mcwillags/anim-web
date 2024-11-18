import styled from "styled-components";

export const CanvasContainer = styled.div`
  grid-area: canvas;
  background-color: #2d2d2d;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

export const PlayerContainer = styled.div`
  width: 1100px;
  height: 550px;
`;

export const StyledCanvas = styled.canvas`
  background-color: #1a1a1a;
  border-radius: 4px;
  width: 100%;
  height: 100%;

`;

export const StyledIFrame = styled.iframe`
  background-color: #1a1a1a;
  border-radius: 4px;
  width: 100%;
  height: 100%;

  display: none;
`;

export const StyledVideo = styled.video`
  background-color: #1a1a1a;
  border-radius: 4px;
  width: 100%;
  height: 100%;

  display: none;
`;

export const ControlsContainer = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

export const ControlButton = styled.button`
  background-color: #3d3d3d;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4d4d4d;
  }

  &:active {
    background-color: #5d5d5d;
  }

  &:disabled {
    background-color: #2d2d2d;
    cursor: not-allowed;
    opacity: 0.5;
  }
`;
