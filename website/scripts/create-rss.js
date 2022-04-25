/// <reference types="@project/types/vercel" />

require("cross-fetch/polyfill");
if (!process.env.VERCEL) require("dotenv").config();

const { Feed } = require("feed");
const fs = require("fs/promises");
const path = require("path");

const metadataJson = require("../config/metadata.json");
const { gql, rawRequest } = require("../lib/graphql.utils");

function cwd(...args) {
  return path.resolve(process.cwd(), ...args);
}

async function createRss() {
  const feed = new Feed({
    title: metadataJson.name,
    description: metadataJson.description,
    id: metadataJson.url,
    link: metadataJson.url,
    language: "en",
    image: `${metadataJson.url}/icon.png`,
    favicon: `${metadataJson}/assets/favicon.ico`,
    copyright: `CC BY-NC-SA 4.0 ${new Date().getFullYear()} ${metadataJson.name}`,
    generator: "https://www.npmjs.com/package/feed",
    feedLinks: {
      atom: `${metadataJson.url}/blog/atom.xml`,
      json: `${metadataJson.url}/blog/feed.json`,
    },
    author: {
      name: metadataJson.name,
      email: metadataJson.email,
      link: metadataJson.url,
    },
  });
  const { allPosts } = await rawRequest(gql`
    {
      allPosts(orderBy: createdAt_DESC) {
        cover {
          url
        }
        title
        description
        slug
        content
        createdAt
      }
    }
  `);
  allPosts.forEach((post) => {
    feed.addItem({
      title: post.title,
      id: `${metadataJson.url}/blog/${post.slug}`,
      link: `${metadataJson.url}/blog/${post.slug}`,
      description: post.description,
      content: post.content,
      author: [{ name: metadataJson.name, email: metadataJson.email, link: metadataJson.url }],
      date: new Date(post.createdAt),
      image: post.cover ? post.cover.url : undefined,
    });
  });
  await Promise.all([
    fs.writeFile(cwd("public/blog/atom.xml"), feed.atom1(), { encoding: "utf-8" }),
    fs.writeFile(cwd("public/blog/feed.json"), feed.json1(), { encoding: "utf-8" }),
    fs.writeFile(cwd("public/blog/rss.xml"), feed.rss2(), { encoding: "utf-8" }),
  ]);
}

if (require.main === module) {
  void createRss();
}

module.exports = {
  createRss,
};
