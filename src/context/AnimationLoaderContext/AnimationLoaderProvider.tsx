import * as React from "react";

import { LoadingStatus } from "./AnimationLoaderContext.models.ts";
import { AnimationLoaderContextFunctions } from "./AnimationLoaderContext.functions.ts";
import { AnimationLoaderContext } from "./AnimationLoaderContext.tsx";

import * as AnimationModules from "@lib/ModuleRunner/src/modules/animations";
import * as GameModules from "@lib/ModuleRunner/src/modules/games";
import * as IFrameModules from "@lib/ModuleRunner/src/modules/iframes";
import * as VideoModules from "@lib/ModuleRunner/src/modules/videos";

const extractDevModules = (modules: Record<string, any>): string[] =>
  Object.values(modules)
    .filter((module) => module.isDev)
    .map((module) => module.name);

const DEV_MODULES = [
  ...extractDevModules(AnimationModules),
  ...extractDevModules(GameModules),
  ...extractDevModules(IFrameModules),
  ...extractDevModules(VideoModules),
];

export const AnimationLoaderProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [loadingStatus, setLoadingStatus] = React.useState<LoadingStatus>(
    LoadingStatus.REQUEST,
  );
  const [animationNames, setAnimationNames] = React.useState<string[]>([]);

  React.useEffect(() => {
    const controller = new AbortController();

    const fetchAnimations = async () => {
      try {
        const animationNames =
          await AnimationLoaderContextFunctions.fetchAndInsertModules(
            DEV_MODULES,
            controller.signal,
          );

        setAnimationNames(animationNames);

        setLoadingStatus(LoadingStatus.SUCCESS);
      } catch {
        setLoadingStatus(LoadingStatus.ERROR);
      }
    };

    fetchAnimations();
  }, []);

  const context = React.useMemo(
    () => ({
      loadingStatus,
      animationNames,
    }),
    [loadingStatus, animationNames],
  );

  return (
    <AnimationLoaderContext.Provider value={context}>
      {children}
    </AnimationLoaderContext.Provider>
  );
};
