import { GraphQLClient } from "graphql-request";
import { getSdk } from "@/generated/graphql";

export const CMS_ENDPOINT = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

export const CMS_HEADERS = {
  Authorization: `Bearer ${process.env.CONTENTFUL_API_KEY}`,
};

export function cms() {
  return getSdk(new GraphQLClient(CMS_ENDPOINT, { headers: CMS_HEADERS }));
}
