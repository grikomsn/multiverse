import { getLayoutedElements } from "@/lib/lockfile-trace";

import { NextApiHandler } from "next";

const handler: NextApiHandler = async ({ query }, res) => {
  res.setHeader("Cache-Control", "public, s-maxage=86400");
  res.json(getLayoutedElements(query));
};

export default handler;
