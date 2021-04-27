declare namespace NodeJS {
  interface ProcessEnv {
    VERCEL?: "1";
    VERCEL_ENV: "development" | "preview" | "production";

    DATOCMS_API_KEY: string;
    NEXT_PUBLIC_DATOCMS_PUBLIC_API_KEY: string;

    [k: string]: string;
  }
}
