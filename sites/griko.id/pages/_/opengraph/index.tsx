import * as React from "react";

import { RegisterMediumZoom, useMediumZoom } from "@/lib/medium-zoom";
import { MainOpengraphQuery, MODIFIERS, TYPES } from "@/lib/opengraph";
import { A } from "@/ui/core/anchor";
import Prose from "@/ui/core/prose";
import OpenGraph from "@/ui/seo/opengraph";
import { useSeo } from "@/utils/seo";

import { useDebouncedValue } from "@mantine/hooks";
import { GetServerSideProps } from "next";
import { useForm } from "react-hook-form";

type OpenGraphPlaygroundPageProps = {
  initialQuery: Record<string, unknown>;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {
      initialQuery: query,
    },
  };
};

export default function OpenGraphPlaygroundPage({ initialQuery }: OpenGraphPlaygroundPageProps) {
  const { Seo, title, description } = useSeo({
    title: "OpenGraph Playground",
    description: "Helper playground to create and preview opengraph images",
  });

  const { handleSubmit, register, watch } = useForm<MainOpengraphQuery & { type: string }>({
    defaultValues: {
      type: "main",
      title: "",
      description: "",
      path: "/",
      modifier: "normal",
      ...initialQuery,
    },
  });

  const { type, ...query } = watch();
  const pageQuery = new URLSearchParams(query as {}).toString();

  const layoutUrl = `/_/opengraph/${type}?${pageQuery}`;
  const imageUrl = `/api/opengraph/main?${pageQuery}`;
  const [debouncedImageUrl] = useDebouncedValue(imageUrl, 200);

  const attach = useMediumZoom([debouncedImageUrl]);

  return (
    <section>
      <RegisterMediumZoom />
      <Seo />
      <OpenGraph query={{ title, description }} />

      <Prose>
        <h1>{title}</h1>
        <p className="lead">{description}</p>
      </Prose>

      <form className="grid md:grid-cols-2 grid-rows-2 md:grid-rows-1" onSubmit={handleSubmit(() => {})}>
        <div className="p-4 space-y-4">
          <label className="block space-y-2">
            <span>Type</span>
            <select className="block w-full bg-transparent rounded" disabled {...register("type")}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span>Title</span>
            <input
              className="block w-full bg-transparent rounded"
              placeholder="Hello, world!"
              type="text"
              {...register("title")}
            />
          </label>

          <label className="block space-y-2">
            <span>Description</span>
            <input
              className="block w-full bg-transparent rounded"
              placeholder="This is an example description."
              type="text"
              {...register("description")}
            />
          </label>

          <label className="block space-y-2">
            <span>Path</span>
            <input
              className="block w-full bg-transparent rounded"
              placeholder="/writings/hello-world"
              {...register("path")}
              type="text"
            />
          </label>

          <label className="block space-y-2">
            <span>Modifier</span>
            <select className="block w-full bg-transparent rounded" {...register("modifier")}>
              {MODIFIERS.map((modifier) => (
                <option key={modifier} value={modifier}>
                  {modifier}
                </option>
              ))}
            </select>
          </label>

          <button className="hidden" type="submit" />
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <span>Image Result (click image to zoom)</span>
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <img alt={query.title} className="rounded" ref={attach} src={debouncedImageUrl} />
          </div>

          <div className="space-y-2">
            <span>Rendered Image URL</span>
            <A className="block text-primary underline break-all" href={debouncedImageUrl}>
              {debouncedImageUrl}
            </A>
          </div>

          <div className="space-y-2">
            <span>Layout URL</span>
            <A className="block text-primary underline break-all" href={layoutUrl}>
              {layoutUrl}
            </A>
          </div>
        </div>
      </form>
    </section>
  );
}
