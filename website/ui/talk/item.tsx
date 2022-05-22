import type { TalkFieldsFragment } from "__generated__/graphql";
import { Calendar, ExternalLink } from "lucide-react";
import { Anchor } from "ui/core/anchor";
import { parseIsoToMdy } from "utils/date";

export interface TalkItemProps {
  data: TalkFieldsFragment;
}

export function TalkItem({ data }: TalkItemProps) {
  return (
    <li className="group flex relative flex-col p-4 sm:hover:bg-neutral-800 sm:rounded-xl">
      <h4 className="mb-2 text-lg font-bold line-clamp-3">{data.title}</h4>
      <p className="mb-4 max-w-2xl text-neutral-400 line-clamp-3">{data.description}</p>
      <div className="flex items-center mb-2 space-x-2">
        <Calendar className="w-3 h-3 text-neutral-400" />
        <span className="text-xs text-neutral-400" suppressHydrationWarning>
          {parseIsoToMdy(data.date)}
        </span>
      </div>
      <Anchor
        className="flex before:inset-0 items-center space-x-2 before:content-[''] sm:before:absolute"
        href={data.url}
      >
        <ExternalLink className="w-3 h-3 text-neutral-400" />
        <span className="text-xs text-primary-500 hover:underline line-clamp-1 sm:group-hover:underline">
          {data.url}
        </span>
      </Anchor>
    </li>
  );
}
