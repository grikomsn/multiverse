/// <reference types="@project/types/vercel" />

require("cross-fetch/polyfill");
if (!process.env.VERCEL) require("dotenv").config();

const fs = require("fs/promises");
const path = require("path");

/**
 * @param {TemplateStringsArray} strs
 * @param  {any[]} args
 */
function gql(strs, ...args) {
  return strs.map((t, i) => [t, String(args[i] ?? "")].join("")).join("");
}

/**
 * @param {string} query
 * @param {any|undefined} variables
 */
async function rawRequest(query, variables) {
  const res = await fetch(process.env.GRAPHQL_ENDPOINT, {
    body: JSON.stringify({ query, variables }),
    headers: {
      Authorization: `Bearer ${process.env.GRAPHQL_TOKEN}`,
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
  /** @type {{route:{redirects:Record<string,string>;rewrites:Record<string,string>}}} */
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

void getRemoteRoutes();
