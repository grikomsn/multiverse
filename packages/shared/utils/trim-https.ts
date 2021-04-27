export default function trimHttps(url: string): string {
  return url.replace(/https?:\/\//, "");
}
