const { GraphQLClient, gql } = require("graphql-request");

const CMS_ENDPOINT = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;

const CMS_HEADERS = {
  Authorization: `Bearer ${process.env.CONTENTFUL_API_KEY}`,
};

const client = new GraphQLClient(CMS_ENDPOINT, { headers: CMS_HEADERS });

module.exports = {
  CMS_ENDPOINT,
  CMS_HEADERS,
  client,
  gql,
};
