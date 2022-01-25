function getAbsoluteUrl<T>(
  req?: T & import("http").IncomingMessage,
  defaultHost?: string,
): {
  protocol: string;
  host: string;
  origin: string;
};
export default getAbsoluteUrl;
