const path = require("path");

/** @param {string[]} rest */
module.exports = function cwd(...rest) {
  return path.join(process.cwd(), ...rest);
};
