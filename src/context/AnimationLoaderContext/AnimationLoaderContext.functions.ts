import axios from "@utils/axios";
import { APIContants } from "@constants";

const HIDDEN_MODULE_NAMES: Record<string, boolean> = {
  Timeout: true,
  ModuleRunner: true,
};

export namespace AnimationLoaderContextFunctions {
  const fetchModulesNames = async (signal?: AbortSignal): Promise<string[]> => {
    return axios
      .get<string[]>("/get-modules-names", { signal })
      .then((res) => res.data);
  };

  const removeFilenameExtension = (fileName: string) => {
    const [name] = fileName.split(".");

    return name;
  };

  const addFilenameExtension = (fileName: string) => `${fileName}.js`;

  const filterDevModulesNames = (
    animationNames: string[],
    devModules: string[],
  ) => {
    const devModulesMap = new Set(devModules.map(addFilenameExtension));

    return animationNames.filter(
      (animationName) => !devModulesMap.has(animationName),
    );
  };

  const filterHiddenModules = (modules: string[]) =>
    modules.filter((module) => !HIDDEN_MODULE_NAMES[module]);

  export const fetchAndInsertModules = async (
    devModules: string[],
    signal?: AbortSignal,
  ) => {
    let modulesNames: string[];
    let modulesToFetch: string[] | undefined;

    try {
      modulesNames = await fetchModulesNames(signal);

      modulesToFetch = filterDevModulesNames(modulesNames, devModules);

      modulesNames = [...devModules, ...modulesToFetch];
    } catch {
      modulesNames = devModules;
    }

    if (modulesToFetch === undefined) {
      return filterHiddenModules(modulesNames.map(removeFilenameExtension));
    }

    await Promise.all(
      modulesToFetch.map(
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

    return filterHiddenModules(modulesNames.map(removeFilenameExtension));
  };
}
