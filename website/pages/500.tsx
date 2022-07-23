import { Cancel } from "iconoir-react";
import { NextSeo } from "next-seo";
import { Anchor } from "ui/core/anchor";

export default function ServerErrorPage() {
  return (
    <section className="space-y-8 py-[5rem] md:py-[10rem]">
      <NextSeo title="Internal Server Error" />
      <Cancel className="m-auto h-24 w-24" />
      <article className=" prose prose-invert text-center ">
        <h1>500 Internal Server Error</h1>
        <p>
          Something went wrong. <Anchor href="/">Head back to home page.</Anchor>
        </p>
      </article>
    </section>
  );
}
