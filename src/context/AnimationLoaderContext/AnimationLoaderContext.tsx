import * as React from "react";
import {
  IAnimationLoaderContext,
  LoadingStatus,
} from "./AnimationLoaderContext.models.ts";
import { AnimationLoaderContextFunctions } from "./AnimationLoaderContext.functions.ts";

const AnimationLoaderContext = React.createContext(
  {} as IAnimationLoaderContext,
);

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
            controller.signal,
          );

        setAnimationNames(
          AnimationLoaderContextFunctions.filterAnimations(animationNames),
        );

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

export const useModuleLoader = () => {
  const context = React.useContext(AnimationLoaderContext);

  if (!context) {
    throw new Error(
      "useModuleLoader can be used only within AnimationLoaderContext",
    );
  }

  return context;
};
