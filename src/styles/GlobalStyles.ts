import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: #1e1e1e;
    color: white;
    overflow: hidden;
  }

  h2 {
    margin-bottom: 16px;
    font-size: 1.2rem;
    font-weight: 500;
  }
`;