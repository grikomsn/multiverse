// tsc --allowJs -d --emitDeclarationOnly --removeComments lib/graphql.utils.js

/** @param {TemplateStringsArray} strs */
function gql(strs, ...args) {
  return strs.map((t, i) => [t, String(args[i] ?? "")].join("")).join("");
}

async function rawRequest(query = "{}", variables = {}) {
  const res = await fetch(process.env.GRAPHQL_ENDPOINT, {
    body: JSON.stringify({ query, variables }),
    headers: {
      Authorization: process.env.GRAPHQL_TOKEN,
    },
    method: "POST",
  });
  const json = await res.json();
  if (json.errors) {
    const { message } = json.errors[0];
    throw new Error(message);
  }
  return json.data;
}

module.exports = {
  gql,
  rawRequest,
};
