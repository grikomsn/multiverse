import { createApiHandler } from "@grikomsn/shared/lib/next";

export default createApiHandler().all((_, res) => {
  res.status(200).send("200 OK");
});
