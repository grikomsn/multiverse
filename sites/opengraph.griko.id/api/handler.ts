import { VercelApiHandler } from "@vercel/node";
import chrome from "chrome-aws-lambda";
import { Browser } from "puppeteer-core";
import { URLSearchParams } from "url";

const isDev = process.env.NODE_ENV == "development";
const isVercel = Boolean(process.env.VERCEL);

let browser: Browser;

const handler: VercelApiHandler = async (req, res) => {
  try {
    const { type, ...query } = req.query;
    const pageQuery = new URLSearchParams(query).toString();
    const origin = isVercel ? "https://griko.id" : "http://localhost:3000";
    const url = `${origin}/_/opengraph/${type as ""}?${pageQuery}`;

    await chrome.font("/var/task/fonts/NotoColorEmoji.ttf");

    if (!browser) {
      browser = await chrome.puppeteer.launch({
        args: chrome.args,
        defaultViewport: chrome.defaultViewport,
        executablePath: await chrome.executablePath,
        headless: isDev ? true : chrome.headless,
        ignoreHTTPSErrors: true,
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

export default handler;
