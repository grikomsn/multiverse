const { GraphQLClient } = require("graphql-request");

const endpoint =
  process.env.NODE_ENV === "development"
    ? "https://graphql.datocms.com/preview"
    : "https://graphql.datocms.com/";

const client = new GraphQLClient(endpoint, {
  headers: {
    ["authorization"]: `Bearer ${process.env.DATOCMS_API_KEY}`,
  },
});

module.exports = {
  client,
};
