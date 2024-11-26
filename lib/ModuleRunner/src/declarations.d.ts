import { BaseModule } from "./models";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CustomModules: Record<string, new (...args: any[]) => BaseModule>;
  }
}
