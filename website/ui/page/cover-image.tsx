import Head from "next/head";
import type { ComponentProps } from "react";

export type CoverImageProps = ComponentProps<"img">;

export function CoverImage({ alt = "cover", ...rest }: CoverImageProps) {
  return (
    <>
      <Head>
        <link as="image" href={rest.src} rel="preload" />
      </Head>
      <img alt={alt} {...rest} />
    </>
  );
}
