import { CMS_ENDPOINT, CMS_HEADERS } from "@/lib/cms-client";
import { IS_NOT_PROD } from "@/utils";

import { ApolloServer } from "apollo-server-micro";
import { print } from "graphql";
import type { AsyncExecutor } from "graphql-tools";
import { introspectSchema, makeRemoteExecutableSchema } from "graphql-tools";

export const executor: AsyncExecutor = async ({ document, variables }) => {
  const query = print(document);

  const response = await fetch(CMS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(IS_NOT_PROD ? CMS_HEADERS : {}),
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
};

export async function createSchema() {
  return makeRemoteExecutableSchema({
    executor,
    schema: await introspectSchema(executor),
  });
}

export async function createApolloServer() {
  return new ApolloServer({
    debug: IS_NOT_PROD,
    introspection: IS_NOT_PROD,
    playground: {
      settings: {
        "request.credentials": "include",
      },
    },
    schema: await createSchema(),
    tracing: IS_NOT_PROD,
  });
}
