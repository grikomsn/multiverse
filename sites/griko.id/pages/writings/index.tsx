import * as React from "react";

import { FrontmatterEntry } from "@/lib/mdx/types";
import { loadPostFrontmatterEntries } from "@/lib/writing.mjs";
import Anchor from "@/ui/core/anchor";
import Prose from "@/ui/core/prose";
import { useSeo } from "@/utils/seo";

import clsx from "classnames";
import format from "date-fns/format";
import { useKBar } from "kbar";
import * as Lucide from "lucide-react";
import { GetStaticProps } from "next";
import { useRouter } from "next/router";

type WritingsPageProps = {
  posts: FrontmatterEntry[];
};

export default function WritingsPage({ posts }: WritingsPageProps) {
  const { Seo, title, description } = useSeo({
    title: "Writings",
    description: "My blog posts covering web development, personal thoughts, and various things",
  });

  return (
    <section>
      <Seo />
      <RegisterSearchAction posts={posts} />

      <Prose>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </Prose>

      <div className="flex justify-center md:justify-end p-4">
        <SearchButton />
      </div>

      <ul className="p-4 space-y-4">
        {posts.map(([slug, post]) => (
          <li
            key={slug}
            className="relative p-4 space-y-2 bg-neutral-500 bg-opacity-0 md:hover:bg-opacity-10 rounded md:hover:shadow-lg md:transition -mx-4 md:hover:-translate-y-1"
          >
            <span className="float-right mb-2 ml-4 text-sm text-right text-neutral-500">
              {format(post.date, "PPP")}
            </span>
            <Anchor className="before:absolute before:inset-0" href={post.redirect ?? `/writings/${slug}`}>
              <h3 className="max-w-xl text-2xl font-bold tracking-tighter line-clamp-2">{post.title}</h3>
            </Anchor>{" "}
            <p className="max-w-xl text-neutral-400 line-clamp-2">{post.description}</p>
            <div
              className={clsx("flex items-center pt-2 space-x-2 text-sm opacity-50 pointer-events-none", {
                "text-primary": Boolean(post.redirect),
              })}
            >
              {post.redirect ? <Lucide.ExternalLink size={16} /> : <Lucide.Link size={16} />}
              <span className="line-clamp-1">{post.redirect ?? `/writings/${slug}`}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export const getStaticProps: GetStaticProps<WritingsPageProps> = async () => {
  const posts = await loadPostFrontmatterEntries();
  return {
    props: {
      posts,
    },
  };
};

function RegisterSearchAction({ posts }: { posts: FrontmatterEntry[] }) {
  const kbar = useKBar();
  const router = useRouter();

  React.useEffect(() => {
    kbar.query.registerActions([
      {
        id: "search-posts",
        name: "Search Posts",
        icon: <Lucide.Search size={16} />,
      },
      ...posts.map(([slug, fm]) => ({
        id: `post-${slug}`,
        name: fm.title,
        subtitle: fm.description.length > 60 ? `${fm.description.slice(0, 60)}...` : fm.description,
        perform: () => router.push(`/writings/${slug}`),
        parent: "search-posts",
      })),
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

function SearchButton() {
  const kbar = useKBar();

  const handleSearch = React.useCallback(() => {
    kbar.query.setCurrentRootAction("search-posts");
    kbar.query.toggle();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      className="flex items-center py-2 px-3 space-x-3 w-full max-w-xs text-neutral-400 bg-neutral-500 bg-opacity-20 hover:bg-opacity-30 rounded transition"
      onClick={handleSearch}
    >
      <Lucide.Search size={20} />
      <span>Search posts</span>
    </button>
  );
}
