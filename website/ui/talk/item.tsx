import type { TalkFieldsFragment } from "__generated__/graphql";
import { Calendar, Internet as ExternalLink } from "iconoir-react";
import { Anchor } from "ui/core/anchor";
import { parseIsoToMdy } from "utils/date";

export interface TalkItemProps {
  data: TalkFieldsFragment;
}

export function TalkItem({ data }: TalkItemProps) {
  return (
    <li className="group relative flex flex-col p-4 sm:rounded-xl sm:hover:bg-neutral-800">
      <h4 className="mb-2 text-lg font-bold line-clamp-3">{data.title}</h4>
      <p className="mb-4 max-w-2xl text-neutral-400 line-clamp-3">{data.description}</p>
      <div className="mb-2 flex items-center space-x-2">
        <Calendar className="h-3 w-3 text-neutral-400" />
        <span className="text-xs text-neutral-400" suppressHydrationWarning>
          {parseIsoToMdy(data.date)}
        </span>
      </div>
      <Anchor
        className="flex items-center space-x-2 before:inset-0 before:content-[''] sm:before:absolute"
        href={data.url}
      >
        <ExternalLink className="h-3 w-3 text-neutral-400" />
        <span className="text-xs text-primary-500 line-clamp-1 hover:underline sm:group-hover:underline">
          {data.url}
        </span>
      </Anchor>
    </li>
  );
}
