import meta from "@/config/meta.cjs";

import _getAbsoluteUrl from "@packages/utils/absolute-url.cjs";

export function getAbsoluteUrl<T>(req?: T & import("http").IncomingMessage) {
  if (__PROD__) {
    return _getAbsoluteUrl(req, meta.domain);
  }
  return _getAbsoluteUrl(req);
}
