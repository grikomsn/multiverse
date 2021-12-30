/// <reference types="@packages/types/vercel" />

declare interface Window {
  mediumZoom: import("medium-zoom").Zoom;
}

declare const __DEV__: boolean;
declare const __PROD__: boolean;
