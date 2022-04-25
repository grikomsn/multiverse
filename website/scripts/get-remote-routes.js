/// <reference types="@project/types/vercel" />

require("cross-fetch/polyfill");
if (!process.env.VERCEL) require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");

const { gql, rawRequest } = require("../lib/graphql.utils");

/**
 * @param {any} data
 * @param {Record<string,any>} extras
 */
function transformRoutes(data, extras = {}) {
  const entries = Object.entries(data);
  const transformed = entries.map(([slug, destination]) => ({ source: `/${slug}`, destination, ...extras }));
  return JSON.stringify(transformed, null, 2);
}

function cwd(...args) {
  return path.resolve(process.cwd(), ...args);
}

async function getRemoteRoutes() {
  const { route } = await rawRequest(gql`
    {
      route {
        redirects
        rewrites
      }
    }
  `);
  const redirectsJsonPath = cwd("__generated__/redirects.json");
  const rewritesJsonPath = cwd("__generated__/rewrites.json");
  await Promise.all([
    fs.writeFile(redirectsJsonPath, transformRoutes(route.redirects, { permanent: false }), { encoding: "utf-8" }),
    fs.writeFile(rewritesJsonPath, transformRoutes(route.rewrites), { encoding: "utf-8" }),
  ]);
}

if (require.main === module) {
  void getRemoteRoutes();
}

module.exports = {
  getRemoteRoutes,
};
