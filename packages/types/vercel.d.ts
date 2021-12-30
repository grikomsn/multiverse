// https://vercel.com/docs/environment-variables#system-environment-variables

declare namespace NodeJS {
  interface ProcessEnv {
    readonly VERCEL: "1";
    readonly CI: "1";

    readonly VERCEL_REGION:
      | "arn1"
      | "bom1"
      | "cdg1"
      | "cle1"
      | "dub1"
      | "gru1"
      | "hkg1"
      | "hnd1"
      | "iad1"
      | "icn1"
      | "lhr1"
      | "pdx1"
      | "sfo1"
      | "sin1"
      | "syd1"
      | "dev1";

    readonly VERCEL_ENV: "development" | "production" | "preview";
    readonly VERCEL_URL: string;
    readonly VERCEL_GIT_PROVIDER: string;
    readonly VERCEL_GIT_REPO_SLUG: string;
    readonly VERCEL_GIT_REPO_OWNER: string;
    readonly VERCEL_GIT_REPO_ID: string;
    readonly VERCEL_GIT_COMMIT_REF: string;
    readonly VERCEL_GIT_COMMIT_SHA: string;
    readonly VERCEL_GIT_COMMIT_MESSAGE: string;
    readonly VERCEL_GIT_COMMIT_AUTHOR_LOGIN: string;
    readonly VERCEL_GIT_COMMIT_AUTHOR_NAME: string;

    readonly NEXT_PUBLIC_VERCEL_ENV: "development" | "production" | "preview";
    readonly NEXT_PUBLIC_VERCEL_URL: string;
    readonly NEXT_PUBLIC_VERCEL_GIT_PROVIDER: string;
    readonly NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG: string;
    readonly NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER: string;
    readonly NEXT_PUBLIC_VERCEL_GIT_REPO_ID: string;
    readonly NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF: string;
    readonly NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: string;
    readonly NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE: string;
    readonly NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_LOGIN: string;
    readonly NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME: string;
  }
}
