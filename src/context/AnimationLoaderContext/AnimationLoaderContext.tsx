import * as React from "react";
import { IAnimationLoaderContext } from "./AnimationLoaderContext.models.ts";

export const AnimationLoaderContext = React.createContext(
  {} as IAnimationLoaderContext,
);
