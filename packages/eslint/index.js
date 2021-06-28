const nonReact = require("./base");

module.exports = {
  ...nonReact,

  extends: [
    ...nonReact.extends,
    "kentcdodds/react",
    "kentcdodds/jsx-a11y",
    //
  ],

  rules: {
    ...nonReact.rules,

    // react rules
    "jsx-a11y/accessible-emoji": "off",
    "react/jsx-sort-props": [
      "warn",
      {
        reservedFirst: ["key"],
      },
    ],
  },
};
