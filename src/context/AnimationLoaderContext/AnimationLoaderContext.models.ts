export enum LoadingStatus {
  INACTIVE = "INACTIVE",
  REQUEST = "REQUEST",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export interface IAnimationLoaderContext {
  loadingStatus: LoadingStatus;
  animationNames: string[];
}
