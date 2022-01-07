/// <reference types="@packages/types/sentry" />
/// <reference types="@packages/types/vercel" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly BROWSERLESS_TOKEN: string;
  }
}

declare interface Window {
  mediumZoom: import("medium-zoom").Zoom;
}

declare const __DEV__: boolean;
declare const __PROD__: boolean;
