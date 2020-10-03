const copy = require("copy");

module.exports = () => {
  copy("src/public/**/*", "public", () => {});
};
