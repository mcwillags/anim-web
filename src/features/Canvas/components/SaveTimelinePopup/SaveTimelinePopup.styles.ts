import styled from "styled-components";

export const Popup = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(37, 52, 66, 0.35);

  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

export const PopupForm = styled.form`
  width: 100%;
  max-width: 36rem;
  padding: 2rem;
  border-radius: 2rem;

  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const Title = styled.h2`
  font-size: 1.5rem;
`;

export const Description = styled.p`
  color: #757272;
`;

export const TimelineName = styled.span`
  font-weight: bold;
  color: #ffffff;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const BaseButton = styled.button`
  appearance: none;
  outline: none;

  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 1rem;
`;

export const SaveButton = styled(BaseButton)`
  background-color: #30799b;
  border: 1px solid #11557c;
  color: #ffffff;
`;

export const CancelButton = styled(BaseButton)``;
