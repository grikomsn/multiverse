import { useSeo } from "hooks/use-seo";
import { Ticker as TimeTicker } from "store/time/ticker";
import { Zone } from "ui/time/zone";

export default function TimePage() {
  const { Seo } = useSeo({
    title: "Time",
    description: "Track what's my current time and somewhere else",
  });

  return (
    <section className="space-y-8 text-center">
      <Seo />
      <TimeTicker />

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
