/* eslint-disable @next/next/no-server-import-in-page */

import { gql, rawRequest } from "lib/graphql.utils";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: "/:slug",
};

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const slug = String(nextUrl.pathname.split("/")[1]);

  if (!data) data = (await rawRequest(query)) as DataType;

  const redirect = data.route.redirects?.[slug];
  if (redirect) return NextResponse.redirect(redirect);
  const rewrite = data.route.rewrites?.[slug];
  if (rewrite) return NextResponse.rewrite(rewrite);
}

interface DataType {
  route: Record<string, Record<string, string>>;
}
const query = gql`
  {
    route {
      redirects
      rewrites
    }
  }
`;
let data: DataType;

/* eslint-enable @next/next/no-server-import-in-page */
