import type { BlogPostCollection } from "@/generated/graphql";
import type { NextApiHandler } from "next";
import { contentful } from "@/cms";
import socialImageFn from "@/pages/api/social-image";

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

  type QueryResult = {
    post: BlogPostCollection;
  };

  const data = await contentful().request<QueryResult>(gqlQuery, { slug });
  const post = data.post.items[0] ?? null;

  if (post) {
    req.query.title = post.title;
    req.query.description = post.subtitle;
    req.query.path = `/blog/${slug}`;

    return socialImageFn(req, res);
  }

  return res.redirect("/404").end();
};

export default handler;
