import type { ImageFieldsFragment } from "__generated__/graphql";
import type { ImageProps } from "next/image";
import Image from "next/image";

export type QueryImageProps = ImageFieldsFragment &
  Omit<ImageProps, keyof ImageFieldsFragment | "blurDataURL" | "placeholder" | "src">;

export function QueryImage({ blurUpThumb, url, ...rest }: QueryImageProps) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image blurDataURL={blurUpThumb} placeholder="blur" src={url} {...rest} />;
}
