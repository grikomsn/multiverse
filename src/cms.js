const { GraphQLClient } = require("graphql-request");

module.exports = {
  contentful: () =>
    new GraphQLClient(
      `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_API_KEY}`,
        },
      },
    ),
  datocms: () =>
    new GraphQLClient(
      process.env.NODE_ENV === "development"
        ? "https://graphql.datocms.com/preview"
        : "https://graphql.datocms.com/",
      {
        headers: {
          Authorization: `Bearer ${process.env.DATOCMS_API_KEY}`,
        },
      },
    ),
};
