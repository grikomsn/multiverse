const fs = require("fs/promises");
const path = require("path");

const client = require("../../shared/lib/datocms-client");

const Log = require("next/dist/build/output/log");

function cwd(...rest) {
  return path.join(__dirname, "..", ...rest);
}

(async () => {
  Log.wait("Prefetching meta values");

  const src = cwd("graphql/client/seo/queries.graphql");
  const query = await fs.readFile(src, { encoding: "utf-8" });
  const data = await client.request(query);
  const dest = cwd("generated/meta.json");

  await fs.writeFile(dest, `${JSON.stringify(data, null, 2)}\r\n`);
})();
