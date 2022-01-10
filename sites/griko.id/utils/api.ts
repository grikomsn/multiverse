import meta from "@/config/meta.cjs";

import { getAbsoluteUrl as _getAbsoluteUrl } from "@packages/utils/absolute-url";

export function getAbsoluteUrl<T>(req?: T & import("http").IncomingMessage) {
  if (__PROD__) {
    return _getAbsoluteUrl(req, meta.domain);
  }
  return _getAbsoluteUrl(req);
}
