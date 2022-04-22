import type { GetProjectsQuery } from "__generated__/graphql";
import { useGetProjectsQuery } from "__generated__/graphql";
import { useSeo } from "hooks/use-seo";
import type { GetStaticProps } from "next";
import { Anchor } from "ui/core/anchor";
import { PageHeader } from "ui/page/header";
import { WorkImage } from "ui/project/image";

export interface WorkPageProps {
  query: GetProjectsQuery;
}

export const getStaticProps: GetStaticProps<WorkPageProps> = async () => {
  return {
    props: {
      query: await useGetProjectsQuery.fetcher()(),
    },
  };
};

export default function WorkPage({ query }: WorkPageProps) {
  const { Seo, title, description } = useSeo({
    title: "Recent Projects",
    description: "Curated handcrafted projects I have made in the past",
  });
  return (
    <section className="space-y-8">
      <Seo />
      <PageHeader className="pt-[10vh] md:pt-[20vh]" description={description} title={title} />
      <ul className="grid grid-flow-row space-y-16">
        {query.allProjects.map((item) => (
          <li key={`work-${item.id}`} className="group grid relative grid-cols-1 gap-4 sm:grid-cols-2">
            <WorkImage alt={item.title} className="sm:order-last" src={item.image.url} />
            <div>
              <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
              <p className="mb-4 leading-relaxed text-neutral-400">{item.description}</p>
              <Anchor
                className="before:absolute before:inset-0 before:z-10 text-primary hover:underline before:content-['']"
                href={item.url}
              >
                Visit website &nbsp; →
              </Anchor>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
