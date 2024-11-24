import styled from 'styled-components';

export const PanelContainer = styled.div`
  grid-area: animations;
  background-color: #2d2d2d;
  border-radius: 8px;
  padding: 16px;
  overflow-y: auto;
`;

export const AnimationItem = styled.div`
  padding: 12px;
  margin-bottom: 8px;
  background-color: #3d3d3d;
  border-radius: 4px;
  cursor: grab;
  
  &:hover {
    background-color: #4d4d4d;
  }
`;