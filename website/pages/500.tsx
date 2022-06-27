import { Cancel } from "iconoir-react";
import { NextSeo } from "next-seo";
import { Anchor } from "ui/core/anchor";

export default function ServerErrorPage() {
  return (
    <section className="py-[5rem] space-y-8 md:py-[10rem]">
      <NextSeo title="Internal Server Error" />
      <Cancel className="m-auto w-24 h-24" />
      <article className=" text-center prose prose-invert ">
        <h1>500 Internal Server Error</h1>
        <p>
          Something went wrong. <Anchor href="/">Head back to home page.</Anchor>
        </p>
      </article>
    </section>
  );
}
