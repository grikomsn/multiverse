// @ts-check

const { GraphQLClient } = require("graphql-request");

const DATOCMS_ENDPOINT =
  process.env.NODE_ENV == "production" ? "https://graphql.datocms.com/" : "https://graphql.datocms.com/preview";

const DATOCMS_HEADERS = {
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_DATOCMS_PUBLIC_API_KEY}`,
};

const client = new GraphQLClient(DATOCMS_ENDPOINT, {
  headers: DATOCMS_HEADERS,
});

module.exports = client;
