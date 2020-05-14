import { fetchSiteConfig, gql } from "@/services/datocms";
import { BlogPost } from "@/types";
import { NextApiHandler } from "next";
import { SitemapStream, streamToPromise } from "sitemap";

type QueryResult = {
  blogPosts: BlogPost[];
};

const handler: NextApiHandler = async (_, res) => {
  const siteConfig = await fetchSiteConfig();

  const smStream = new SitemapStream({
    hostname: siteConfig.url,
  });

  const { blogPosts }: QueryResult = await gql`
    {
      blogPosts: allBlogPosts(orderBy: postedAt_DESC) {
        slug
      }
    }
  `;

  const routes = [
    "/",
    "/about",
    "/appearances",
    "/blog",
    "/projects",
    ...blogPosts.map(({ slug }) => `/blog/${slug}`),
  ];

  for (const route of routes) {
    smStream.write({
      url: route,
      changeFreq: "weekly",
      priority: 0.9,
    });
  }

  smStream.end();

  const sitemap = (await streamToPromise(smStream)).toString();

  res.setHeader("content-type", "application/xml");
  res.setHeader("content-length", sitemap.length);
  res.end(sitemap);
};

export default handler;
