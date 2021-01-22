import type { NextApiHandler } from "next";
import { cms } from "@/lib/cms";
import socialImageFn from "@/pages/api/social-image";

const handler: NextApiHandler = async (req, res) => {
  const [, slug] = /^([^.]+)(\.png)?$/.exec(req.query.slug as string);

  const data = await cms().blogSocialImage({ slug });
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
