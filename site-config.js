// @ts-check

const descriptionMd = `
  Remote software developer doing web dev things. [SurabayaJS](https://surabayajs.org) core organizer,
  [Deno Land Indonesia](https://denoland.id) and [Frontend Indonesia](https://feid.dev) contributor,
  and occasional [open sourcerer](https://github.com/grikomsn).
`;

const description = descriptionMd
  .replace(/\[([^\]]+)\](\([^)]+\)|\[[^\]]+\])/g, "$1")
  .replace(/\n/g, "")
  .replace(/\s{2,}/g, " ")
  .trim();

module.exports = {
  title: "Griko Nibras",
  descriptionMd,
  description,
  url: "https://griko.id",
  twitterUsername: "@griko_nibras",
  email: "hello@griko.id",
  socials: {
    GitHub: "https://github.com/grikomsn",
    LinkedIn: "https://linkedin.com/in/griko",
    Medium: "https://medium.com/@griko",
    Twitch: "https://twitch.tv/griko_nibras",
    Twitter: "https://twitter.com/griko_nibras",
  },
  themeColor: "#1A202C",
};
