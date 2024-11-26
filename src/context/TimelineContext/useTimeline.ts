import * as React from "react";
import { TimelineContext } from "./TimelineContext.tsx";

export const useTimeline = () => {
  const context = React.useContext(TimelineContext);

  if (!context) {
    throw new Error("useTimeline can be used only within TimelineContext");
  }

  return context;
};
