import type { NextApiRequest, NextApiResponse } from "next";

import { createApolloServer } from "@/lib/apollo";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const server = await createApolloServer();

  const handler = server.createHandler({
    path: "/api/graphql",
  });

  return handler(req, res);
};
