import { NextApiRequest as BaseNextApiRequest } from "next";

export type NextApiRequest<
  T extends Record<string, unknown> = { [k: string]: unknown },
> = BaseNextApiRequest & T;
