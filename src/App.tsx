import { AnimationContextProvider } from "@context/AnimationContext";

import { AnimationLoaderProvider } from "@context/AnimationLoaderContext";
import { TimelineContextProvider } from "@context/TimelineContext";
import { GlobalStyles } from "./styles/GlobalStyles.ts";
import { MainPage } from "@pages";

function App() {
  return (
    <AnimationLoaderProvider>
      <TimelineContextProvider>
        <AnimationContextProvider>
          <GlobalStyles />
          <MainPage />
        </AnimationContextProvider>
      </TimelineContextProvider>
    </AnimationLoaderProvider>
  );
}

export default App;
