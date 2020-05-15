const { GraphQLClient } = require("graphql-request");

/**
 * @param {TemplateStringsArray} query
 * @param {string[]} vars
 * @returns {Promise<any>}
 */
const gql = async (query, ...vars) => {
  const endpoint =
    process.env.NODE_ENV === "development"
      ? "https://graphql.datocms.com/preview"
      : "https://graphql.datocms.com/";

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

  return client.request(merged);
};

module.exports = {
  gql,
};
