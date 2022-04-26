import type { GetHomePageQuery } from "__generated__/graphql";
import { useGetHomePageQuery } from "__generated__/graphql";
import type { GetStaticProps } from "next";
import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote/dist/types";
import { serialize } from "next-mdx-remote/serialize";
import { PostItem } from "ui/blog/post-item";
import { Anchor } from "ui/core/anchor";
import { ProjectImage } from "ui/project/image";
import { TalkItem } from "ui/talk/item";

export interface HomePageProps {
  query: GetHomePageQuery;
  compiledExcerpt: MDXRemoteSerializeResult;
}

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const query = await useGetHomePageQuery.fetcher()();
  const compiledExcerpt = await serialize(query.homePage.excerpt);
  return {
    props: {
      query,
      compiledExcerpt,
    },
  };
};

export default function HomePage({ query, compiledExcerpt }: HomePageProps) {
  return (
    <section className="space-y-8">
      <div className="py-[10vh] prose prose-invert md:py-[20vh]">
        <MDXRemote {...compiledExcerpt} />
      </div>
      <h3 className="text-lg text-gray-400">Recent projects</h3>
      <ul className="grid grid-cols-1 -mx-4 md:grid-cols-2 not-prose">
        {query.allProjects.map((item) => (
          <li key={`recent-work-${item.id}`} className="group flex relative flex-col p-4 rounded">
            <ProjectImage alt={item.title} className="mb-4" src={item.image.url} />
            <h4 className="mb-2 text-lg font-bold">{item.title}</h4>
            <p className="flex-grow mb-4 text-neutral-400">{item.description}</p>
            <Anchor className="text-primary hover:underline sm:before:absolute sm:before:inset-0" href={item.url}>
              Visit website &nbsp; →
            </Anchor>
          </li>
        ))}
      </ul>
      <div className="!mb-24 text-right">
        <Anchor className="text-neutral-400 hover:text-primary hover:underline" href="/work">
          View all projects &nbsp; →
        </Anchor>
      </div>
      <h3 className="text-lg text-gray-400">Recent appearances</h3>
      <ul className="grid grid-cols-1 gap-4 items-start -mx-4 sm:grid-cols-2">
        {query.allTalks.map((item) => (
          <TalkItem key={`recent-post-${item.id}`} data={item} />
        ))}
      </ul>
      <div className="!mb-24 text-right">
        <Anchor className="text-neutral-400 hover:text-primary hover:underline" href="/talk">
          View all talks &nbsp; →
        </Anchor>
      </div>
      <h3 className="text-lg text-gray-400">Recent posts</h3>
      <ul className="-mx-4 space-y-4">
        {query.allPosts.map((item) => (
          <PostItem key={`recent-post-${item.id}`} data={item} />
        ))}
      </ul>
      <div className="text-right">
        <Anchor className="text-neutral-400 hover:text-primary hover:underline" href="/blog">
          View all posts &nbsp; →
        </Anchor>
      </div>
    </section>
  );
}
