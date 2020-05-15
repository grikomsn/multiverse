const path = require("path");

const resolveCwd = (...strings) => path.resolve(process.cwd(), ...strings);

module.exports = {
  resolveCwd,

  publicDir: resolveCwd("public"),
  iconsDir: resolveCwd("public/icons"),
};
