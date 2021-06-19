//@ts-check

/**
 * https://nextjs.org/docs/api-reference/next.config.js/redirects
 *
 * @type {import("next/dist/next-server/server/config-shared").NextConfig["redirects"]}
 */
async function redirects() {
  return [
    // {
    //   source: "/blog/:path*",
    //   destination: "/blog",
    //   permanent: false,
    // },
  ];
}

module.exports = redirects;
