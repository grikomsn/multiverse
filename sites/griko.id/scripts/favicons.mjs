// @ts-check

import meta from "../config/meta.cjs";

import cwd from "@packages/utils/cwd.cjs";
import favicons from "favicons";
import fs from "fs/promises";
import log from "next/dist/build/output/log.js";
import { performance } from "perf_hooks";

(async () => {
  const t0 = performance.now();

  log.wait("generating favicon assets...");
  const { files, images, html } = await favicons(cwd("./public/icon.png"), {
    path: "/assets/",
    appName: meta.name,
    appShortName: meta.name,
    appDescription: meta.description,
    developerName: meta.name,
    developerURL: meta.url,
    background: "#171717",
    theme_color: "#171717",
    icons: { android: true, appleIcon: true, appleStartup: true, favicons: true, windows: true },
  });

  await Promise.all([
    ...[...files, ...images].map(({ contents, name }) => {
      return fs.writeFile(cwd("./public/assets", name), contents);
    }),
    fs.writeFile(
      cwd("./generated/favicon-meta-tags.jsx"),
      `export default function FaviconMetaTags() { return <>${html.map((h) => h.replace(/>$/, " />")).join(" ")}</>; }`,
    ),
  ]);

  const t1 = performance.now();
  log.ready(`generated favicon assets in ${t1 - t0}ms`);
})();
