import { createRoot } from "react-dom/client";

import { GlobalStyles } from "./styles/GlobalStyles";
import { AnimationContextProvider } from "@context/AnimationContext";

import App from "./App";
import { TimelineContextProvider } from "@context/TimelineContext/TimelineContext.tsx";

document.addEventListener(
  "dragstart",
  (event: any) => {
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
    event.dataTransfer.setDragImage(img, 0, 0);
  },
  false,
);

createRoot(document.getElementById("root")!).render(
  <TimelineContextProvider>
    <AnimationContextProvider>
      <GlobalStyles />
      <App />
    </AnimationContextProvider>
  </TimelineContextProvider>,
);
