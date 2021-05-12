import cms from "~lib/cms";

import { createApiHandler } from "@grikomsn/shared/lib/next";

export default createApiHandler().get(async (req, res) => {
  const token = req.query.token as string;

  if (token != process.env.BUILD_TRIGGER_SECRET) {
    return res.status(401).send("401 Unauthorized");
  }

  const data = await cms().buildTriggerUrls();
  await Promise.allSettled(
    data.buildTrigger.webhookUrls.map(({ url }) => fetch(url)),
  );

  return res.status(200).send("200 OK");
});
