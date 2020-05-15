const RSS = require("rss");
const fs = require("fs");
const { publicDir, resolveCwd } = require("./utils");

const buildRss = async ({ blogPosts, siteConfig }) => {
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

  fs.writeFileSync(resolveCwd(publicDir, "rss.xml"), xml);
};

module.exports = buildRss;
