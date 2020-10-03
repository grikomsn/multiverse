const RSS = require("rss");

const fs = require("fs");
const path = require("path");

const siteConfig = require("../site-config");

module.exports = ({ posts }) => {
  const { title, description, url } = siteConfig;

  const feed = new RSS({
    title,
    description,
    feed_url: `${url}/rss.xml`,
    site_url: url,
    managingEditor: title,
    webMaster: title,
    copyright: `CC BY-NC-SA 4.0 © ${new Date().getFullYear()} ${title}`,
    language: "en",
    generator: `${title} RSS API`,
  });

  for (const post of posts) {
    feed.item({
      title: post.title,
      description: post.subtitle,
      url: `${url}/blog/${post.slug}`,
      categories: post.tags,
      author: title,
      date: post.postedAt,
    });
  }

  fs.writeFileSync(
    path.resolve(process.cwd(), "public", "rss.xml"),
    feed.xml(),
  );
};
