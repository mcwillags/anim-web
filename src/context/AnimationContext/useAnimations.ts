import * as React from "react";
import { AnimationContext } from "./AnimationContext.ts";

export const useAnimations = () => {
  const context = React.useContext(AnimationContext);

  if (!context) {
    throw new Error(
      "useAnimations should be used within AnimationContextProvider",
    );
  }

  return context;
};
