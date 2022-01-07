declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_SENTRY_DSN: string;
    readonly SENTRY_AUTH_TOKEN: string;
    readonly SENTRY_ORG: string;
    readonly SENTRY_PROJECT: string;
  }
}
