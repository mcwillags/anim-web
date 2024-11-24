import styled from 'styled-components';

export const AppContainer = styled.div`
  display: grid;
  grid-template-areas:
    "animations canvas"
    "animations timeline";
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr 200px;
  gap: 20px;
  padding: 20px;
  height: 100vh;
  background-color: #1e1e1e;
  color: white;
`;