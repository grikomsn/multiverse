import getAbsoluteUrl from "@/utils/api";

import chrome from "chrome-aws-lambda";
import { NextApiHandler } from "next";
import { Browser, Page } from "puppeteer-core";
import { URLSearchParams } from "url";

let browser: Browser;
let page: Page;

const handler: NextApiHandler = async (req, res) => {
  try {
    const { type, ...query } = req.query;
    const pageQuery = new URLSearchParams(query).toString();
    const { origin } = getAbsoluteUrl(req);
    const url = `${origin}/_/opengraph/${type as ""}?${pageQuery}`;

    await chrome.font("https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf");

    if (!browser) {
      browser = await chrome.puppeteer.launch({
        args: chrome.args,
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: __DEV__ ? true : chrome.headless,
        ignoreHTTPSErrors: true,
      });
    }

    if (!page) {
      page = await browser.newPage();
    }

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

    res.setHeader("content-type", "image/png");
    res.setHeader("cache-control", "public, max-age=604800");
    res.send(screenshot);
  } catch (error: unknown) {
    res.status(500).json({ error });
  }
};

export default handler;
