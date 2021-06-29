// https://fettblog.eu/typescript-react/styles/#load-css-with-webpack
declare module "*.css" {
  const classNames: {
    [k: string]: string;
  };
  export = classNames;
}

declare namespace NodeJS {
  interface ProcessEnv {
    VERCEL?: "1";
    VERCEL_ENV: "development" | "preview" | "production";

    DATOCMS_API_KEY: string;
    NEXT_PUBLIC_DATOCMS_PUBLIC_API_KEY: string;

    [k: string]: string;
  }
}

declare let __DEV__: true | undefined;
