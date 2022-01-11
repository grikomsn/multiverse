import * as React from "react";

import OpenGraph from "@/ui/seo/opengraph";
import { useSeo } from "@/utils/seo";
import { useCurrentTime } from "@/utils/time";

import { useHash } from "@mantine/hooks";
import slugify from "@sindresorhus/slugify";
import clsx from "classnames";

export default function TimePage() {
  const { Seo, title, description } = useSeo({
    title: "Time",
    description: "Track what's my current time and somewhere else",
  });

  return (
    <section className="p-4 text-center">
      <Seo />
      <OpenGraph query={{ title, description, path: "/time" }} />

      <div className="space-y-8">
        <Zone tz="Asia/Jakarta" />
        <Zone tz="CET" />
        <Zone tz="EST" />
        <Zone tz="CST6CDT" />
        <Zone tz="PST8PDT" />
      </div>
    </section>
  );
}

function Zone({ tz }: { tz: string }) {
  const id = slugify(tz);
  const [hash] = useHash();

  const hasHash = typeof hash == "string" && hash.length > 0;
  const isCurrentHash = hash == `#${id}`;

  return (
    <div
      className={clsx(
        "py-8 space-y-2 md:space-y-4 transition",
        "rounded border-2 border-transparent target:border-neutral-500",
        { "opacity-50": hasHash && !isCurrentHash },
      )}
      id={id}
    >
      <a className="text-lg md:text-2xl text-neutral-500 hover:underline" href={`#${id}`}>
        Time in {tz} is
      </a>
      <p className="text-2xl md:text-4xl font-bold" id={`date-${id}`} suppressHydrationWarning>
        {useCurrentTime("PPPP", tz)}
      </p>
      <p className="font-mono text-2xl md:text-4xl font-bold" id={`time-${id}`} suppressHydrationWarning>
        {useCurrentTime("HH:mm:ss zzz", tz)}
      </p>
    </div>
  );
}
