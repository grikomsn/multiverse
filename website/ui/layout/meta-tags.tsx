import metadataJson from "config/metadata";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";

export function MetaTags() {
  const router = useRouter();

  return (
    <DefaultSeo
      canonical={metadataJson.url + (router.asPath || "")}
      defaultTitle={metadataJson.name}
      description={metadataJson.description}
      openGraph={{
        title: metadataJson.name,
        description: metadataJson.description,
        type: "website",
        site_name: metadataJson.name,
        images: [{ url: `${metadataJson.url}/social.png` }],
      }}
      twitter={{
        cardType: "summary_large_image",
        handle: metadataJson.twitter.username,
        site: metadataJson.twitter.username,
      }}
    />
  );
}
