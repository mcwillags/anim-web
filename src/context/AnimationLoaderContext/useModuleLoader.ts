import * as React from "react";
import { AnimationLoaderContext } from "./AnimationLoaderContext.tsx";

export const useModuleLoader = () => {
  const context = React.useContext(AnimationLoaderContext);

  if (!context) {
    throw new Error(
      "useModuleLoader can be used only within AnimationLoaderContext",
    );
  }

  return context;
};
