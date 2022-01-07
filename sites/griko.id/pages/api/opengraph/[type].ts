import { getAbsoluteUrl } from "@/utils/api";

import { withSentry } from "@sentry/nextjs";
import { NextApiHandler } from "next";
import puppeteer, { Browser } from "puppeteer-core";
import { URLSearchParams } from "url";

let browser: Browser;

const handler: NextApiHandler = async (req, res) => {
  try {
    const { type, ...query } = req.query;
    const pageQuery = new URLSearchParams(query).toString();
    const { origin } = getAbsoluteUrl(req);
    const url = `${origin}/_/opengraph/${type as ""}?${pageQuery}`;

    if (!browser) {
      browser = await puppeteer.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_TOKEN}`,
      });
    }

    const page = await browser.newPage();

    await page.setViewport({
      width: 1024,
      height: 512,
      deviceScaleFactor: 2,
    });

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    const screenshot = await page.screenshot({
      encoding: "binary",
    });

    void page.close();

    res.setHeader("content-type", "image/png");
    res.setHeader("cache-control", "public, s-maxage=604800, immutable");
    res.send(screenshot);
  } catch (error: unknown) {
    res.status(500).json({ error });
  } finally {
    // await browser?.close();
  }
};

export default withSentry(handler);
