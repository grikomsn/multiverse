import type { PostFieldsFragment } from "__generated__/graphql";
import clsx from "clsx";
import { Calendar as CalendarIcon, Internet as ExternalIcon, Link as LinkIcon } from "iconoir-react";
import { Anchor } from "ui/core/anchor";
import { parseIsoToMdy } from "utils/date";

export interface PostItemProps {
  data: PostFieldsFragment;
}

export function PostItem({ data }: PostItemProps) {
  const Icon = data.redirect ? ExternalIcon : LinkIcon;
  return (
    <li className="group relative flex flex-col p-4 sm:rounded-xl sm:hover:bg-neutral-800">
      <h4 className="mb-2 text-lg font-bold line-clamp-3">{data.title}</h4>
      <p className="mb-4 max-w-2xl text-neutral-400 line-clamp-3">{data.description}</p>
      <div className="mb-2 flex items-center space-x-2">
        <CalendarIcon className="h-3 w-3 text-neutral-400" />
        <span className="text-xs text-neutral-400" suppressHydrationWarning>
          {parseIsoToMdy(data.createdAt)}
        </span>
      </div>
      <Anchor
        className="flex items-center space-x-2 before:inset-0 before:content-[''] sm:before:absolute"
        href={data.redirect || `/blog/${data.slug}`}
      >
        <Icon className="h-3 w-3 text-neutral-400" />
        <span
          className={clsx(
            "text-xs line-clamp-1 hover:underline sm:group-hover:underline",
            data.redirect ? "text-blue-400" : "text-primary-500",
          )}
        >
          {data.redirect ? data.redirect : `/blog/${data.slug}`}
        </span>
      </Anchor>
    </li>
  );
}
