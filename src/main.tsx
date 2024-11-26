import { createRoot } from "react-dom/client";

import App from "./App";

import { disableDragGhostImage } from "@utils/disableDragGhostImage.ts";

disableDragGhostImage();

createRoot(document.getElementById("root")!).render(<App />);
