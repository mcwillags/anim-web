import styled from "styled-components";

export const TimelineContainer = styled.div`
  grid-area: timeline;
  background-color: #2d2d2d;
  border-radius: 8px;
  padding: 16px;
`;

export const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const DurationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DurationInput = styled.input`
  width: 80px;
  height: 32px;
  background-color: #1a1a1a;
  border: 1px solid #3d3d3d;
  border-radius: 4px;
  color: white;
  padding: 0 8px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #4d4d4d;
  }

  /* Приховуємо стрілки для number input */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export const DurationLabel = styled.label`
  font-size: 14px;
  color: #9a9a9a;
`;

export const TimeIndicators = styled.div`
  position: relative;
  height: 24px;
  margin-bottom: 4px;
  padding-inline: 1rem;
`;

export const TimeMarker = styled.div`
  position: absolute;
  transform: translateX(-50%);
  font-size: 12px;
  color: #9a9a9a;

  &::after {
    content: "";
    position: absolute;
    top: 16px;
    left: 50%;
    height: 4px;
    width: 1px;
    background-color: #3d3d3d;
  }
`;

export const TimelineCursorContainer = styled.div`
  position: relative;
`;

export const TimelineCursor = styled.div.attrs<{ x: number }>((props) => ({
  style: {
    left: `${props.x}px`,
  },
}))`
  z-index: 2;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::before {
    content: '';
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid #ffffff;
  }

  &::after {
    content: '';
    width: 2px;
    height: 100px;
    background-color: #ffffff;
    margin-top: 2px;
    box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
  }

  transition: left 0.1s;
`;

export const DurationSelect = styled.select`
  margin-left: 8px;
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 4px;
  background-color: #2c2c2c; 
  color: #ffffff;
  border: 1px solid #444;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #3a3a3a;
  }
`;
