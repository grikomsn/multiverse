import { NextApiRequest } from "../types/next";

import { NextApiResponse } from "next";
import nc, { Options as NextConnectOptions } from "next-connect";

/**
 * Helper function to create API handlers.
 *
 * @param options handler creation options
 */
export function createApiHandler(
  options?: NextConnectOptions<NextApiRequest, NextApiResponse>,
) {
  return nc<NextApiRequest, NextApiResponse>(options);
}
