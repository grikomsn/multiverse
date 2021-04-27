/// <reference types="next" />
/// <reference types="next/types/global" />

// https://fettblog.eu/typescript-react/styles/#load-css-with-webpack
declare module "*.css" {
  const classNames: {
    [k: string]: string;
  };
  export = classNames;
}
