import { createApolloServer } from "@/lib/apollo";
import { IS_NOT_PROD } from "@/utils";

import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (IS_NOT_PROD) {
    const server = await createApolloServer();

    const handler = server.createHandler({
      path: "/api/graphql",
    });

    return handler(req, res);
  }

  return res.status(401).json({ haha: "no" });
};
