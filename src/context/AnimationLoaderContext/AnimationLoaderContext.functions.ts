import axios from "@utils/axios";
import { APIContants } from "@constants";

const HIDDEN_MODULE_NAMES: Record<string, boolean> = {
  Timeout: true,
  ModuleRunner: true,
};

export namespace AnimationLoaderContextFunctions {
  const fetchModulesNames = async (signal?: AbortSignal) => {
    return axios
      .get<string[]>("/get-modules-names", { signal })
      .then((res) => res.data);
  };

  const removeFilenameExtension = (fileName: string) => {
    const [name] = fileName.split(".");

    return name;
  };

  const shouldDisplayAnimationName = (name: string) =>
    !HIDDEN_MODULE_NAMES[name];

  export const fetchAndInsertModules = async (signal?: AbortSignal) => {
    const modulesNames = await fetchModulesNames(signal);

    await Promise.all(
      modulesNames.map(
        (moduleName) =>
          new Promise((res, rej) => {
            const script = document.createElement("script");

            script.onload = res;
            script.onerror = rej;
            script.src =
              APIContants.baseURL + APIContants.staticDirApiPart + moduleName;
            document.head.appendChild(script);
          }),
      ),
    );

    return modulesNames.map(removeFilenameExtension);
  };

  export const filterAnimations = (animationNames: string[]): string[] =>
    animationNames.filter(shouldDisplayAnimationName);
}
