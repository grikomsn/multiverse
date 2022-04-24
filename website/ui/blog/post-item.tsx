import type { PostFieldsFragment } from "__generated__/graphql";
import clsx from "clsx";
import { Calendar as CalendarIcon, ExternalLink as ExternalIcon, Link as LinkIcon } from "lucide-react";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { Anchor } from "ui/core/anchor";
import { parseIsoToMdy } from "utils/date";
import type { OmitChildren } from "utils/react";

export interface PostItemProps extends OmitChildren<ComponentProps<"li">> {
  data: PostFieldsFragment;
}

export function PostItem({ data, className, ...rest }: PostItemProps) {
  const Icon = data.redirect ? ExternalIcon : LinkIcon;
  return (
    <li className={clsx("group flex relative flex-col p-4 sm:hover:bg-neutral-800 sm:rounded-xl", className)} {...rest}>
      <h4 className="mb-2 text-lg font-bold line-clamp-3">{data.title}</h4>
      <p className="mb-4 max-w-2xl text-neutral-400 line-clamp-3">{data.description}</p>
      <div className="flex items-center mb-2 space-x-2">
        <CalendarIcon className="w-3 h-3 text-neutral-400" />
        <span className="text-xs text-neutral-400" suppressHydrationWarning>
          {parseIsoToMdy(data.createdAt)}
        </span>
      </div>
      <NextLink href={data.redirect ? data.redirect : `/blog/${data.slug}`} passHref>
        <Anchor className="flex before:inset-0 items-center space-x-2 before:content-[''] sm:before:absolute">
          <Icon className="w-3 h-3 text-neutral-400" />
          <span
            className={clsx(
              "text-xs hover:underline line-clamp-1 sm:group-hover:underline",
              data.redirect ? "text-blue-400" : "text-primary",
            )}
          >
            {data.redirect ? data.redirect : `/blog/${data.slug}`}
          </span>
        </Anchor>
      </NextLink>
    </li>
  );
}
