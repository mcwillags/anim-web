import { BaseModule } from "@lib/ModuleRunner";

declare global {
  interface Window {
    CustomModules: Record<string, new (...args: any[]) => BaseModule>;
  }
}
