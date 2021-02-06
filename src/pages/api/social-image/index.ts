import { absoluteUrl } from "@/utils";

import chrome from "chrome-aws-lambda";
import type { NextApiHandler } from "next";
import type { Browser } from "puppeteer";
import pptr from "puppeteer";
import qs from "querystring";

const isDev = process.env.NODE_ENV === "development";

const handler: NextApiHandler = async (req, res) => {
  let browser: Browser = null;

  try {
    const title = req.query.title as string;
    const description = req.query.description as string;
    const path = req.query.path as string;

    const { origin } = absoluteUrl(req);
    const query = qs.stringify({ title, description, path });
    const url = `${origin}/social-image?${query}`;

    browser = await chrome.puppeteer.launch({
      args: isDev ? [] : chrome.args,
      defaultViewport: chrome.defaultViewport,
      executablePath: isDev
        ? pptr.executablePath()
        : await chrome.executablePath,
      headless: isDev ? true : chrome.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();

    await page.setViewport({
      width: 1024,
      height: 512,
    });

    await page.goto(url, {
      waitUntil: "load",
    });

    const screenshot = await page.screenshot({
      encoding: "binary",
    });

    res.setHeader("content-type", "image/png");
    res.setHeader("cache-control", "public, max-age=604800");
    res.send(screenshot);
  } catch (error: unknown) {
    res.status(500).json({ error });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

export default handler;
