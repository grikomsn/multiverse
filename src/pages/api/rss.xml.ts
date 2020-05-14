import { gql } from "@/services/datocms";
import { BlogPost, SiteConfig } from "@/types";
import { NextApiHandler } from "next";
import RSS from "rss";

type QueryResult = {
  blogPosts: BlogPost[];
  siteConfig: SiteConfig;
};

const handler: NextApiHandler = async (_, res) => {
  const { blogPosts, siteConfig }: QueryResult = await gql`
    {
      blogPosts: allBlogPosts(orderBy: postedAt_DESC) {
        title
        slug
        subtitle
        postedAt
        tags
      }
      siteConfig {
        title
        description
        url
      }
    }
  `;

  const { title, description, url } = siteConfig;

  const feed = new RSS({
    title: title,
    description: description,
    feed_url: `${url}/api/rss.xml`,
    site_url: url,
    managingEditor: title,
    webMaster: title,
    copyright: `CC BY-NC-SA 4.0 © ${new Date().getFullYear()} ${title}`,
    language: "en",
    generator: `${title} RSS API`,
  });

  for (const post of blogPosts) {
    feed.item({
      title: post.title,
      description: post.subtitle,
      url: `${url}/blog/${post.slug}`,
      categories: post.tags.split(",").map((t) => t.trim()),
      author: title,
      date: post.postedAt,
    });
  }

  const xml = feed.xml();

  res.setHeader("content-type", "application/xml");
  res.setHeader("content-length", xml.length);
  res.end(xml);
};

export default handler;
