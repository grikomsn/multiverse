import type { NextApiHandler } from "next";
import SocialImageFn from "@/pages/api/social-image";
import { contentful } from "@/cms";

const handler: NextApiHandler = async (req, res) => {
  const [, slug] = /^([^.]+)(\.png)?$/.exec(req.query.slug as string);

  const gqlQuery = /* GraphQL */ `
    query BlogPost($slug: String!) {
      post: blogPostCollection(limit: 1, where: { slug: $slug }) {
        items {
          title
          subtitle
        }
      }
    }
  `;

  const data = await contentful().request(gqlQuery, { slug });
  const post = data.post.items[0] ?? null;

  if (post) {
    req.query.title = post.title;
    req.query.description = post.subtitle;
    req.query.path = `/blog/${slug}`;

    return SocialImageFn(req, res);
  }

  return res.redirect("/404").end();
};

export default handler;
