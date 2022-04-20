import { XCircle } from "lucide-react";
import { NextSeo } from "next-seo";
import { Anchor } from "ui/core/anchor";

export default function NotFoundPage() {
  return (
    <section className="py-[5rem] space-y-8 md:py-[10rem]">
      <NextSeo title="Not Found" />
      <XCircle className="m-auto w-24 h-24" />
      <article className=" text-center prose prose-invert ">
        <h1>404 Not Found</h1>
        <p>
          The current page you are accessing is not available. <Anchor href="/">Head back to home page.</Anchor>
        </p>
      </article>
    </section>
  );
}
