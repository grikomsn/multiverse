// @ts-check

const copy = require("copy");

module.exports = async () => {
  copy("src/public/**/*", "public", () => {});
};
