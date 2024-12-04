import styled from 'styled-components';

export const PanelContainer = styled.div`
  grid-area: animations;
  background-color: #2d2d2d;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
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

export const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const Loader = styled.div`
  width: 50px;
  padding: 8px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: #ffff;
  --_m: 
    conic-gradient(#0000 10%,#000),
    linear-gradient(#000 0 0) content-box;
  -webkit-mask: var(--_m);
          mask: var(--_m);
  -webkit-mask-composite: source-out;
          mask-composite: subtract;
  animation: l3 1s infinite linear;
@keyframes l3 {to{transform: rotate(1turn)}}
`;

 