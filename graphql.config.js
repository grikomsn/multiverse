// https://github.com/graphql/vscode-graphql/pull/267#issuecomment-843622797
require("dotenv").config({ path: require("path").resolve("./website/.env") });

/** @type {import("graphql-config").IGraphQLConfig} */
const graphqlConfig = {
  documents: ["./website/graphql/**/*.graphql"],
  schema: ["./website/schema.graphql"],
  extensions: {
    endpoints: {
      default: {
        url: process.env.GRAPHQL_ENDPOINT,
        headers: {
          Authorization: process.env.GRAPHQL_TOKEN,
        },
      },
    },
  },
};

module.exports = graphqlConfig;
