declare module "*.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly VERCEL?: "1";
    readonly VERCEL_ENV: "development" | "preview" | "production";

    readonly DATOCMS_API_KEY: string;
    readonly NEXT_PUBLIC_DATOCMS_PUBLIC_API_KEY: string;
  }
}

declare const __DEV__: boolean;
