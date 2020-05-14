const favicons = require("favicons");
const fs = require("fs");
const path = require("path");

const { GraphQLClient } = require("graphql-request");

async function build() {
  const endpoint =
    process.env.NODE_ENV === "development"
      ? "https://graphql.datocms.com/preview"
      : "https://graphql.datocms.com/";

  const client = new GraphQLClient(endpoint, {
    headers: {
      ["authorization"]: `Bearer ${process.env.DATOCMS_API_KEY}`,
    },
  });

  const { siteConfig, favicon } = await client.request(`
    {
      siteConfig {
        title
        description
        url
      }
      favicon: upload(filter: {notes: {matches: {pattern: "favicon"}}}) {
        url
      }
    }
  `);

  const data = await fetch(favicon.url);
  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const publicDir = path.resolve(process.cwd(), "public");
  const iconsDir = path.resolve(process.cwd(), "public/icons");

  fs.writeFileSync(path.resolve(publicDir, "favicon.png"), buffer);

  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir);
  }

  await new Promise((resolve, reject) => {
    favicons(
      path.join(process.cwd(), "src/assets/icon.png"),
      {
        path: "/icons/",
        appName: siteConfig.title,
        appShortName: siteConfig.title,
        appDescription: siteConfig.description,
        developerName: siteConfig.title,
        developerURL: siteConfig.url,
        background: "#333333",
        theme_color: "#333333",
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: false,
          windows: true,
          yandex: false,
        },
        logging: true,
      },
      (error, { files, images }) => {
        if (error) {
          reject(error);
        }

        images.forEach((image) => {
          fs.writeFile(
            path.resolve(iconsDir, image.name),
            image.contents,
            reject,
          );
        });

        files.forEach((file) => {
          fs.writeFile(
            path.resolve(publicDir, file.name),
            file.contents,
            reject,
          );
        });

        resolve();
      },
    );
  });
}

build();
