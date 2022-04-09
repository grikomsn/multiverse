import * as React from "react";

import meta from "@/config/meta.json";
import { getQuery, MainOpengraphQuery } from "@/lib/opengraph";
import { withLayoutType } from "@/utils/layout";

import MyImage from "@packages/assets/me-2022.jpg";
import clsx from "clsx";
import { GetServerSideProps } from "next";
import Image from "next/image";

export const getServerSideProps: GetServerSideProps<MainOpengraphQuery> = async ({ query }) => {
  return {
    props: getQuery(query),
  };
};

function MainOpengraphPage({ title, description, path, modifier, image }: MainOpengraphQuery) {
  const isLarge = modifier == "larger";
  const isNormal = modifier == "normal";

  const hasNoImage = !image;
  const disableImage = image == "none";

  return (
    <>
      <section className="relative" id="frame">
        <div className="flex absolute inset-0 justify-center items-center p-24 space-x-8">
          {(hasNoImage || !disableImage) && (
            <div className="overflow-hidden w-[192px] min-w-[192px] h-[192px] min-h-[192px] rounded-full">
              <Image priority src={MyImage} />
            </div>
          )}
          <div className="flex flex-col space-y-4 w-full">
            <h1
              className={clsx("font-bold tracking-tighter", {
                "text-7xl": isLarge,
                "text-5xl": isNormal,
              })}
            >
              {title}
            </h1>
            <p
              className={clsx("max-w-2xl", {
                "text-2xl": isLarge,
                "text-xl": isNormal,
              })}
            >
              {description}
            </p>
            <br />
            <span className="opacity-50">
              {meta.url}
              {path}
            </span>
          </div>
        </div>
      </section>

      <style jsx>{`
        html,
        body,
        section {
          overflow: hidden;
          width: 1024px;
          height: 512px;
        }
      `}</style>
    </>
  );
}

export default withLayoutType(MainOpengraphPage, "empty");
