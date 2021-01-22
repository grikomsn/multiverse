import type { NextApiRequest, NextApiResponse } from "next";

import { IS_NOT_PROD } from "@/utils";
import { createApolloServer } from "@/lib/apollo";

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
