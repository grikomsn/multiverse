//@ts-check

/**
 * https://nextjs.org/docs/api-reference/next.config.js/headers
 *
 * @type {import("next/dist/next-server/server/config-shared").NextConfig["headers"]}
 */
async function headers() {
  return [
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, s-maxage=1, stale-while-revalidate=59",
        },
      ],
    },
  ];
}

module.exports = headers;
