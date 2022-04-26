import type { GetTalksQuery } from "__generated__/graphql";
import { useGetTalksQuery } from "__generated__/graphql";
import { useSeo } from "hooks/use-seo";
import type { GetStaticProps } from "next";
import { PageHeader } from "ui/page/header";
import { TalkItem } from "ui/talk/item";

export interface TalkPageProps {
  query: GetTalksQuery;
}

export const getStaticProps: GetStaticProps<TalkPageProps> = async () => {
  return {
    props: {
      query: await useGetTalksQuery.fetcher()(),
    },
  };
};

export default function TalkPage({ query }: TalkPageProps) {
  const { Seo, title, description } = useSeo({
    title: "Recent Appearances",
    description: "Talks, meetups, and other appearances from various events",
  });
  return (
    <section className="space-y-8">
      <Seo />
      <PageHeader className="pt-[10vh] md:pt-[20vh]" description={description} title={title} />
      <hr className="border-neutral-500/50" />
      <ul className="grid grid-cols-1 gap-4 items-start -mx-4 sm:grid-cols-2">
        {query.allTalks.map((item) => (
          <TalkItem key={`talk-${item.id}`} data={item} />
        ))}
      </ul>{" "}
    </section>
  );
}
