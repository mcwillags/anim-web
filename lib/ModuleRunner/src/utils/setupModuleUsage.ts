import { TimelineModule } from "../models";

export const setupModuleUsage = (
  key: string,
  module: new (...args: any[]) => TimelineModule,
) => {
  if (window.CustomModules === undefined) {
    window.CustomModules = {
      [key]: module,
    };
  } else {
    window.CustomModules[key] = module;
  }
};
