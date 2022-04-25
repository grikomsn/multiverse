const { createRss } = require("./create-rss");
const { getRemoteRoutes } = require("./get-remote-routes");

function prebuild() {
  return Promise.all([createRss(), getRemoteRoutes()]);
}

if (require.main === module) {
  void prebuild();
}

module.exports = {
  prebuild,
};
