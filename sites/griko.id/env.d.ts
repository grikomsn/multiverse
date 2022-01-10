/* eslint-disable @typescript-eslint/no-empty-interface */

/// <reference types="@packages/types/sentry" />
/// <reference types="@packages/types/vercel" />

declare namespace NodeJS {
  interface ProcessEnv {
    //
  }
}

declare interface Window {
  mediumZoom: import("medium-zoom").Zoom;
}

declare const __DEV__: boolean;
declare const __PROD__: boolean;
