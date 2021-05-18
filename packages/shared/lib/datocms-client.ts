import { GraphQLClient } from "graphql-request";

export const DATOCMS_ENDPOINT =
  process.env.NODE_ENV == "production"
    ? "https://graphql.datocms.com"
    : "https://graphql.datocms.com/preview";

export const DATOCMS_HEADERS = {
  Authorization: process.env.NEXT_PUBLIC_DATOCMS_PUBLIC_API_KEY,
};

const client = new GraphQLClient(DATOCMS_ENDPOINT, {
  headers: DATOCMS_HEADERS,
});

export default client;
