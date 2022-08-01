import { useSeo } from "hooks/use-seo";
import { Anchor } from "ui/core/anchor";
import { PageHeader } from "ui/page/header";

export default function Sponsors() {
  const { Seo, title, description } = useSeo({
    title: "Sponsors and Backers",
    description: "Huge thanks to my sponsors and backers both on GitHub and Patreon",
  });
  return (
    <section className="space-y-8 text-center">
      <Seo />
      <PageHeader className="pt-[10vh] md:pt-[20vh]" description={description} title={title} />
      <img
        alt="sponsors"
        className="mx-auto rounded-lg border border-neutral-800 py-4"
        src="https://static.griko.id/sponsors.svg"
      />
      <div className="flex items-center justify-center space-x-4 text-xs">
        <Anchor className="text-primary-500 hover:underline" href="https://github.com/sponsors/grikomsn">
          GitHub sponsors
        </Anchor>
        <Anchor className="text-primary-500 hover:underline" href="https://patreon.com/grikomsn">
          Patreon backers
        </Anchor>
      </div>
    </section>
  );
}
