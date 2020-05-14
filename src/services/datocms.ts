import { SiteConfig } from "@/types";
import { isDev } from "@/utils";
import { GraphQLClient } from "graphql-request";

const endpoint = isDev
  ? "https://graphql.datocms.com/preview"
  : "https://graphql.datocms.com/";

export const gql = (query: TemplateStringsArray, ...vars: string[]) => {
  const client = new GraphQLClient(endpoint, {
    headers: {
      ["authorization"]: `Bearer ${process.env.DATOCMS_API_KEY}`,
    },
  });

  let merged = "";
  for (let i = 0; i < vars.length; i++) {
    merged += query[i];
    merged += `${vars[i]}`;
  }
  merged += query[query.length - 1];

  return client.request<any>(merged);
};

export const fetchSiteConfig = async () => {
  const { siteConfig } = await gql`
    {
      siteConfig {
        title
        description
        url
        twitterUsername
        email
        links
        socials
      }
    }
  `;

  return siteConfig as SiteConfig;
};
