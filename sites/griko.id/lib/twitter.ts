/** @see https://developer.twitter.com/en/docs/twitter-for-websites/tweet-button/guides/web-intent */
export type TwitterIntentQuery = Partial<{
  text: string;
  url: string;
  hashtags: string;
  via: string;
  related: string;
  in_reply_to: string;
}>;

export function createTwitterIntent(query: TwitterIntentQuery) {
  const parsedQuery = new URLSearchParams(query).toString();
  return `https://twitter.com/intent/tweet?${parsedQuery}`;
}
