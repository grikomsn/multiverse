import { useGetSlugRedirectQuery } from "__generated__/graphql";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest, _ev: NextFetchEvent) {
  if (!req.page.params?.slug) return;
  const slug = req.page.params.slug as "";
  const query = await useGetSlugRedirectQuery.fetcher({ slug })();
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (query.post?.redirect) {
    return NextResponse.redirect(query.post.redirect);
  }
}
