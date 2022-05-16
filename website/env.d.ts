declare namespace NodeJS {
  interface ProcessEnv {
    readonly GRAPHQL_ENDPOINT: string;
    readonly GRAPHQL_TOKEN: string;
    readonly NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT: string;
  }
}

declare const __DEV__: boolean;
declare const __PROD__: boolean;
