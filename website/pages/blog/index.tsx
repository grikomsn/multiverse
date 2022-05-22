import type { GetBlogPostsQuery } from "__generated__/graphql";
import { useGetBlogPostsQuery } from "__generated__/graphql";
import { useSeo } from "hooks/use-seo";
import type { GetStaticProps } from "next";
import { PostItem } from "ui/blog/post-item";
import { Anchor } from "ui/core/anchor";
import { PageHeader } from "ui/page/header";

export interface BlogPageProps {
  query: GetBlogPostsQuery;
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const query = await useGetBlogPostsQuery.fetcher()();
  return {
    props: {
      query,
    },
  };
};

export default function BlogPage({ query }: BlogPageProps) {
  const { Seo, title, description } = useSeo({
    title: "Writings",
    description: "My blog posts covering web development, personal thoughts, and various things",
  });
  return (
    <section className="space-y-8">
      <Seo />
      <PageHeader className="pt-[10vh] md:pt-[20vh]" description={description} title={title} />
      <div className="flex items-center space-x-2 text-xs sm:space-x-4">
        <hr className="flex-grow border-neutral-500/50" />
        <Anchor className="text-primary-500 hover:underline" external href="/blog/atom.xml">
          atom.xml
        </Anchor>
        <Anchor className="text-primary-500 hover:underline" external href="/blog/feed.json">
          feed.json
        </Anchor>
        <Anchor className="text-primary-500 hover:underline" external href="/blog/rss.xml">
          rss.xml
        </Anchor>
      </div>
      <ul className="-mx-4 space-y-4">
        {query.allPosts.map((item) => (
          <PostItem key={`recent-post-${item.id}`} data={item} />
        ))}
      </ul>
    </section>
  );
}
