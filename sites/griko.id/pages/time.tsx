import * as React from "react";

import OpenGraph from "@/ui/seo/opengraph";
import { useSeo } from "@/utils/seo";
import { useCurrentTime } from "@/utils/time";

export default function TimePage() {
  const { Seo, title, description } = useSeo({
    title: "Time",
    description: "Track what's my current time and somewhere else",
  });

  return (
    <section className="p-4 text-center">
      <Seo />
      <OpenGraph query={{ title, description, path: "/time" }} />

      <div className="space-y-16">
        <Zone tz="Asia/Jakarta" />
        <Zone tz="EST" />
        <Zone tz="PST8PDT" />
      </div>
    </section>
  );
}

function Zone({ tz }: { tz: string }) {
  return (
    <div className="space-y-2 md:space-y-4">
      <h1 className="text-lg md:text-2xl text-neutral-500">Time in {tz} is</h1>
      <p className="text-2xl md:text-4xl font-bold" id="my-date">
        {useCurrentTime("PPPP", tz)}
      </p>
      <p className="font-mono text-2xl md:text-4xl font-bold" id="my-time">
        {useCurrentTime("HH:mm:ss zzz", tz)}
      </p>
    </div>
  );
}
