import type { GetBlogPostsQuery } from "__generated__/graphql";
import { useGetBlogPostsQuery } from "__generated__/graphql";
import { useSeo } from "hooks/use-seo";
import type { GetStaticProps } from "next";
import { PostItem } from "ui/blog/post-item";
import { PageHeader } from "ui/page/header";
import { DURATION_FIVE_MINUTES } from "utils/constants";

export interface BlogPageProps {
  query: GetBlogPostsQuery;
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const query = await useGetBlogPostsQuery.fetcher()();
  return {
    props: {
      query,
    },
    revalidate: DURATION_FIVE_MINUTES,
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
      <PageHeader className="pt-[5rem] md:pt-[10rem]" description={description} title={title} />
      <ul className="-mx-4 space-y-4">
        {query.allPosts.map((item) => (
          <PostItem key={`recent-post-${item.id}`} data={item} />
        ))}
      </ul>
    </section>
  );
}
