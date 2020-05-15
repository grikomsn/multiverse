import { ResponsiveImageType } from "react-datocms";

export interface DatoAsset {
  alt: string;
  author: string;
  basename: string;
  blurUpThumb: string;
  blurhash: string;
  colors: {
    alpha: number;
    blue: number;
    green: number;
    hex: string;
    red: number;
  };
  copyright: string;
  customData: any;
  exifInfo: any;
  filename: string;
  format: string;
  height: number;
  id: string;
  mimeType: string;
  notes: string;
  responsiveImage: ResponsiveImageType;
  size: number;
  smartTags: string[];
  tags: string[];
  title: string;
  url: string;
  video: {
    duration: number;
    framerate: number;
    mp4Url: string;
    muxAssetId: string;
    muxPlaybackId: string;
    streamingUrl: string;
    thumbnailUrl: string;
  };
  width: number;
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  twitterUsername: string;
  email: string;
  links: Record<string, string>;
  socials: Record<string, string>;
}

export interface BlogPost {
  cover: DatoAsset;
  title: string;
  slug: string;
  subtitle: string;
  postedAt: string;
  tags: string;
  markdown: string;
}

export type AppearanceCategory =
  | "talk"
  | "lightning-talk"
  | "podcast"
  | "workshop";

export interface Appearance {
  title: string;
  date: string;
  subtitle: string;
  url: string;
  tags: string[];
  category: AppearanceCategory;
}

export interface Showcase {
  title: string;
  tech: string;
  image: DatoAsset;
  url: string;
}

export interface AboutPageContent {
  portrait: DatoAsset;
  title: string;
  excerpt: string;
  knowledgeBase: {
    key: string;
    value: string[];
  }[];
}
