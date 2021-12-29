import meta from "@/config/meta.cjs";

import { Feed } from "feed";
import { NextApiHandler } from "next";

let feed: Feed;

const handler: NextApiHandler = async (_, res) => {
  if (!feed) {
    feed = new Feed({
      title: meta.name,
      description: meta.description,
      id: meta.url,
      link: meta.url,
      image: `${meta.url}/icon.png`,
      favicon: `${meta.url}/assets/favicon.ico`,
      copyright: `MIT License © ${new Date().getFullYear()} ${meta.name}`,
      author: {
        name: meta.name,
        email: meta.email,
        link: meta.url,
      },
    });
  }

  // TODO: process posts
  // [].forEach(([_slug, _post]: FrontmatterEntry) => {
  //   feed.addItem({
  //     title: post.title,
  //     id: `${meta.url}/writings/${slug}`,
  //     link: `${meta.url}/writings/${slug}`,
  //     description: post.description
  //   });
  // });

  res.setHeader("Content-Type", "application/rss+xml");
  res.send(feed.rss2());
};

export default handler;
