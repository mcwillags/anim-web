import { createRoot } from "react-dom/client";

import { GlobalStyles } from "./styles/GlobalStyles";
import { AnimationContextProvider } from "@context/AnimationContext";

import App from "./App";
import { TimelineContextProvider } from "@context/TimelineContext/TimelineContext.tsx";
import { AnimationLoaderProvider } from "@context/AnimationLoaderContext";
import { disableDragGhostImage } from "@utils/disableDragGhostImage.ts";

disableDragGhostImage();

createRoot(document.getElementById("root")!).render(
  <AnimationLoaderProvider>
    <TimelineContextProvider>
      <AnimationContextProvider>
        <GlobalStyles />
        <App />
      </AnimationContextProvider>
    </TimelineContextProvider>
  </AnimationLoaderProvider>,
);
