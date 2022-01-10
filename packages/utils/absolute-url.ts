export function getAbsoluteUrl<T>(req?: T & import("http").IncomingMessage, defaultHost = "localhost:3000") {
  let host = defaultHost;

  if (req?.headers?.host) {
    host = req.headers.host;
  }
  if (typeof window != "undefined") {
    host = window.location.host;
  }
  if (typeof req?.headers["x-forwarded-host"] == "string") {
    host = req.headers["x-forwarded-host"];
  }

  let protocol = /^localhost(:\d+)?$/.test(host) ? "http:" : "https:";

  if (typeof req?.headers["x-forwarded-proto"] == "string") {
    protocol = `${req.headers["x-forwarded-proto"]}:`;
  }

  return {
    protocol,
    host,
    origin: `${protocol}//${host}`,
  };
}
