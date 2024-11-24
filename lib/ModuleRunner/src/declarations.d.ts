import { BaseModule } from "./models";

declare global {
  interface Window {
    CustomModules: Record<string, new (...args: any[]) => BaseModule>;
  }
}
