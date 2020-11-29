export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /**
   * A date-time string at UTC, such as 2007-12-03T10:15:30Z,
   *     compliant with the 'date-time' format outlined in section 5.6 of
   *     the RFC 3339 profile of the ISO 8601 standard for representation
   *     of dates and times using the Gregorian calendar.
   */
  DateTime: any;
  /** The 'Dimension' type represents dimensions as whole numeric values between `1` and `4000`. */
  Dimension: any;
  /** The 'Quality' type represents quality as whole numeric values between `1` and `100`. */
  Quality: any;
  /** The 'HexColor' type represents color in `rgb:ffffff` string format. */
  HexColor: any;
};

export type Query = {
  __typename?: "Query";
  asset?: Maybe<Asset>;
  assetCollection?: Maybe<AssetCollection>;
  aboutPage?: Maybe<AboutPage>;
  aboutPageCollection?: Maybe<AboutPageCollection>;
  showcase?: Maybe<Showcase>;
  showcaseCollection?: Maybe<ShowcaseCollection>;
  appearance?: Maybe<Appearance>;
  appearanceCollection?: Maybe<AppearanceCollection>;
  blogPost?: Maybe<BlogPost>;
  blogPostCollection?: Maybe<BlogPostCollection>;
};

export type QueryAssetArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryAssetCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<AssetFilter>;
  order?: Maybe<Array<Maybe<AssetOrder>>>;
};

export type QueryAboutPageArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryAboutPageCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<AboutPageFilter>;
  order?: Maybe<Array<Maybe<AboutPageOrder>>>;
};

export type QueryShowcaseArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryShowcaseCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<ShowcaseFilter>;
  order?: Maybe<Array<Maybe<ShowcaseOrder>>>;
};

export type QueryAppearanceArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryAppearanceCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<AppearanceFilter>;
  order?: Maybe<Array<Maybe<AppearanceOrder>>>;
};

export type QueryBlogPostArgs = {
  id: Scalars["String"];
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type QueryBlogPostCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
  where?: Maybe<BlogPostFilter>;
  order?: Maybe<Array<Maybe<BlogPostOrder>>>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type Asset = {
  __typename?: "Asset";
  sys: Sys;
  title?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
  contentType?: Maybe<Scalars["String"]>;
  fileName?: Maybe<Scalars["String"]>;
  size?: Maybe<Scalars["Int"]>;
  url?: Maybe<Scalars["String"]>;
  width?: Maybe<Scalars["Int"]>;
  height?: Maybe<Scalars["Int"]>;
  linkedFrom?: Maybe<AssetLinkingCollections>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetUrlArgs = {
  transform?: Maybe<ImageTransformOptions>;
};

/** Represents a binary file in a space. An asset can be any file type. */
export type AssetLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

export type Sys = {
  __typename?: "Sys";
  id: Scalars["String"];
  spaceId: Scalars["String"];
  environmentId: Scalars["String"];
  publishedAt?: Maybe<Scalars["DateTime"]>;
  firstPublishedAt?: Maybe<Scalars["DateTime"]>;
  publishedVersion?: Maybe<Scalars["Int"]>;
};

export type ImageTransformOptions = {
  /** Desired width in pixels. Defaults to the original image width. */
  width?: Maybe<Scalars["Dimension"]>;
  /** Desired height in pixels. Defaults to the original image height. */
  height?: Maybe<Scalars["Dimension"]>;
  /**
   * Desired quality of the image in percents.
   *         Used for `PNG8`, `JPG`, `JPG_PROGRESSIVE` and `WEBP` formats.
   */
  quality?: Maybe<Scalars["Quality"]>;
  /**
   * Desired corner radius in pixels.
   *         Results in an image with rounded corners (pass `-1` for a full circle/ellipse).
   *         Defaults to `0`. Uses desired background color as padding color,
   *         unless the format is `JPG` or `JPG_PROGRESSIVE` and resize strategy is `PAD`, then defaults to white.
   */
  cornerRadius?: Maybe<Scalars["Int"]>;
  /** Desired resize strategy. Defaults to `FIT`. */
  resizeStrategy?: Maybe<ImageResizeStrategy>;
  /** Desired resize focus area. Defaults to `CENTER`. */
  resizeFocus?: Maybe<ImageResizeFocus>;
  /**
   * Desired background color, used with corner radius or `PAD` resize strategy.
   *         Defaults to transparent (for `PNG`, `PNG8` and `WEBP`) or white (for `JPG` and `JPG_PROGRESSIVE`).
   */
  backgroundColor?: Maybe<Scalars["HexColor"]>;
  /** Desired image format. Defaults to the original image format. */
  format?: Maybe<ImageFormat>;
};

export enum ImageResizeStrategy {
  /** Resizes the image to fit into the specified dimensions. */
  Fit = "FIT",
  /**
   * Resizes the image to the specified dimensions, padding the image if needed.
   *         Uses desired background color as padding color.
   */
  Pad = "PAD",
  /** Resizes the image to the specified dimensions, cropping the image if needed. */
  Fill = "FILL",
  /** Resizes the image to the specified dimensions, changing the original aspect ratio if needed. */
  Scale = "SCALE",
  /** Crops a part of the original image to fit into the specified dimensions. */
  Crop = "CROP",
  /** Creates a thumbnail from the image. */
  Thumb = "THUMB",
}

export enum ImageResizeFocus {
  /** Focus the resizing on the center. */
  Center = "CENTER",
  /** Focus the resizing on the top. */
  Top = "TOP",
  /** Focus the resizing on the top right. */
  TopRight = "TOP_RIGHT",
  /** Focus the resizing on the right. */
  Right = "RIGHT",
  /** Focus the resizing on the bottom right. */
  BottomRight = "BOTTOM_RIGHT",
  /** Focus the resizing on the bottom. */
  Bottom = "BOTTOM",
  /** Focus the resizing on the bottom left. */
  BottomLeft = "BOTTOM_LEFT",
  /** Focus the resizing on the left. */
  Left = "LEFT",
  /** Focus the resizing on the top left. */
  TopLeft = "TOP_LEFT",
  /** Focus the resizing on the largest face. */
  Face = "FACE",
  /** Focus the resizing on the area containing all the faces. */
  Faces = "FACES",
}

export enum ImageFormat {
  /** JPG image format. */
  Jpg = "JPG",
  /**
   * Progressive JPG format stores multiple passes of an image in progressively higher detail.
   *         When a progressive image is loading, the viewer will first see a lower quality pixelated version which
   *         will gradually improve in detail, until the image is fully downloaded. This is to display an image as
   *         early as possible to make the layout look as designed.
   */
  JpgProgressive = "JPG_PROGRESSIVE",
  /** PNG image format */
  Png = "PNG",
  /**
   * 8-bit PNG images support up to 256 colors and weigh less than the standard 24-bit PNG equivalent.
   *         The 8-bit PNG format is mostly used for simple images, such as icons or logos.
   */
  Png8 = "PNG8",
  /** WebP image format. */
  Webp = "WEBP",
}

export type AssetLinkingCollections = {
  __typename?: "AssetLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
  aboutPageCollection?: Maybe<AboutPageCollection>;
  showcaseCollection?: Maybe<ShowcaseCollection>;
  blogPostCollection?: Maybe<BlogPostCollection>;
};

export type AssetLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetLinkingCollectionsAboutPageCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetLinkingCollectionsShowcaseCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetLinkingCollectionsBlogPostCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type EntryCollection = {
  __typename?: "EntryCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<Entry>>;
};

export type Entry = {
  sys: Sys;
};

export type AboutPageCollection = {
  __typename?: "AboutPageCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<AboutPage>>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/aboutPage) */
export type AboutPage = Entry & {
  __typename?: "AboutPage";
  sys: Sys;
  linkedFrom?: Maybe<AboutPageLinkingCollections>;
  title?: Maybe<Scalars["String"]>;
  avatar?: Maybe<Asset>;
  preface?: Maybe<Scalars["String"]>;
  knowledgeBase?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/aboutPage) */
export type AboutPageLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/aboutPage) */
export type AboutPageTitleArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/aboutPage) */
export type AboutPageAvatarArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/aboutPage) */
export type AboutPagePrefaceArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/aboutPage) */
export type AboutPageKnowledgeBaseArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type AboutPageLinkingCollections = {
  __typename?: "AboutPageLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type AboutPageLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type ShowcaseCollection = {
  __typename?: "ShowcaseCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<Showcase>>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/showcase) */
export type Showcase = Entry & {
  __typename?: "Showcase";
  sys: Sys;
  linkedFrom?: Maybe<ShowcaseLinkingCollections>;
  title?: Maybe<Scalars["String"]>;
  tech?: Maybe<Array<Maybe<Scalars["String"]>>>;
  image?: Maybe<Asset>;
  url?: Maybe<Scalars["String"]>;
  featuredOrder?: Maybe<Scalars["Int"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/showcase) */
export type ShowcaseLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/showcase) */
export type ShowcaseTitleArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/showcase) */
export type ShowcaseTechArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/showcase) */
export type ShowcaseImageArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/showcase) */
export type ShowcaseUrlArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/showcase) */
export type ShowcaseFeaturedOrderArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type ShowcaseLinkingCollections = {
  __typename?: "ShowcaseLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type ShowcaseLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type BlogPostCollection = {
  __typename?: "BlogPostCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<BlogPost>>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/blogPost) */
export type BlogPost = Entry & {
  __typename?: "BlogPost";
  sys: Sys;
  linkedFrom?: Maybe<BlogPostLinkingCollections>;
  image?: Maybe<Asset>;
  title?: Maybe<Scalars["String"]>;
  slug?: Maybe<Scalars["String"]>;
  subtitle?: Maybe<Scalars["String"]>;
  postedAt?: Maybe<Scalars["DateTime"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
  content?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/blogPost) */
export type BlogPostLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/blogPost) */
export type BlogPostImageArgs = {
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/blogPost) */
export type BlogPostTitleArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/blogPost) */
export type BlogPostSlugArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/blogPost) */
export type BlogPostSubtitleArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/blogPost) */
export type BlogPostPostedAtArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/blogPost) */
export type BlogPostTagsArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/blogPost) */
export type BlogPostContentArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type BlogPostLinkingCollections = {
  __typename?: "BlogPostLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type BlogPostLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AssetFilter = {
  sys?: Maybe<SysFilter>;
  title_exists?: Maybe<Scalars["Boolean"]>;
  title?: Maybe<Scalars["String"]>;
  title_not?: Maybe<Scalars["String"]>;
  title_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_contains?: Maybe<Scalars["String"]>;
  title_not_contains?: Maybe<Scalars["String"]>;
  description_exists?: Maybe<Scalars["Boolean"]>;
  description?: Maybe<Scalars["String"]>;
  description_not?: Maybe<Scalars["String"]>;
  description_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  description_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  description_contains?: Maybe<Scalars["String"]>;
  description_not_contains?: Maybe<Scalars["String"]>;
  url_exists?: Maybe<Scalars["Boolean"]>;
  url?: Maybe<Scalars["String"]>;
  url_not?: Maybe<Scalars["String"]>;
  url_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url_contains?: Maybe<Scalars["String"]>;
  url_not_contains?: Maybe<Scalars["String"]>;
  size_exists?: Maybe<Scalars["Boolean"]>;
  size?: Maybe<Scalars["Int"]>;
  size_not?: Maybe<Scalars["Int"]>;
  size_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  size_not_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  size_gt?: Maybe<Scalars["Int"]>;
  size_gte?: Maybe<Scalars["Int"]>;
  size_lt?: Maybe<Scalars["Int"]>;
  size_lte?: Maybe<Scalars["Int"]>;
  contentType_exists?: Maybe<Scalars["Boolean"]>;
  contentType?: Maybe<Scalars["String"]>;
  contentType_not?: Maybe<Scalars["String"]>;
  contentType_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  contentType_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  contentType_contains?: Maybe<Scalars["String"]>;
  contentType_not_contains?: Maybe<Scalars["String"]>;
  fileName_exists?: Maybe<Scalars["Boolean"]>;
  fileName?: Maybe<Scalars["String"]>;
  fileName_not?: Maybe<Scalars["String"]>;
  fileName_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  fileName_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  fileName_contains?: Maybe<Scalars["String"]>;
  fileName_not_contains?: Maybe<Scalars["String"]>;
  width_exists?: Maybe<Scalars["Boolean"]>;
  width?: Maybe<Scalars["Int"]>;
  width_not?: Maybe<Scalars["Int"]>;
  width_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  width_not_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  width_gt?: Maybe<Scalars["Int"]>;
  width_gte?: Maybe<Scalars["Int"]>;
  width_lt?: Maybe<Scalars["Int"]>;
  width_lte?: Maybe<Scalars["Int"]>;
  height_exists?: Maybe<Scalars["Boolean"]>;
  height?: Maybe<Scalars["Int"]>;
  height_not?: Maybe<Scalars["Int"]>;
  height_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  height_not_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  height_gt?: Maybe<Scalars["Int"]>;
  height_gte?: Maybe<Scalars["Int"]>;
  height_lt?: Maybe<Scalars["Int"]>;
  height_lte?: Maybe<Scalars["Int"]>;
  OR?: Maybe<Array<Maybe<AssetFilter>>>;
  AND?: Maybe<Array<Maybe<AssetFilter>>>;
};

export type SysFilter = {
  id_exists?: Maybe<Scalars["Boolean"]>;
  id?: Maybe<Scalars["String"]>;
  id_not?: Maybe<Scalars["String"]>;
  id_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  id_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  id_contains?: Maybe<Scalars["String"]>;
  id_not_contains?: Maybe<Scalars["String"]>;
  publishedAt_exists?: Maybe<Scalars["Boolean"]>;
  publishedAt?: Maybe<Scalars["String"]>;
  publishedAt_not?: Maybe<Scalars["String"]>;
  publishedAt_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  publishedAt_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  publishedAt_contains?: Maybe<Scalars["String"]>;
  publishedAt_not_contains?: Maybe<Scalars["String"]>;
  firstPublishedAt_exists?: Maybe<Scalars["Boolean"]>;
  firstPublishedAt?: Maybe<Scalars["String"]>;
  firstPublishedAt_not?: Maybe<Scalars["String"]>;
  firstPublishedAt_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  firstPublishedAt_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  firstPublishedAt_contains?: Maybe<Scalars["String"]>;
  firstPublishedAt_not_contains?: Maybe<Scalars["String"]>;
  publishedVersion_exists?: Maybe<Scalars["Boolean"]>;
  publishedVersion?: Maybe<Scalars["String"]>;
  publishedVersion_not?: Maybe<Scalars["String"]>;
  publishedVersion_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  publishedVersion_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  publishedVersion_contains?: Maybe<Scalars["String"]>;
  publishedVersion_not_contains?: Maybe<Scalars["String"]>;
};

export enum AssetOrder {
  UrlAsc = "url_ASC",
  UrlDesc = "url_DESC",
  SizeAsc = "size_ASC",
  SizeDesc = "size_DESC",
  ContentTypeAsc = "contentType_ASC",
  ContentTypeDesc = "contentType_DESC",
  FileNameAsc = "fileName_ASC",
  FileNameDesc = "fileName_DESC",
  WidthAsc = "width_ASC",
  WidthDesc = "width_DESC",
  HeightAsc = "height_ASC",
  HeightDesc = "height_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC",
}

export type AssetCollection = {
  __typename?: "AssetCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<Asset>>;
};

export type AboutPageFilter = {
  sys?: Maybe<SysFilter>;
  title_exists?: Maybe<Scalars["Boolean"]>;
  title?: Maybe<Scalars["String"]>;
  title_not?: Maybe<Scalars["String"]>;
  title_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_contains?: Maybe<Scalars["String"]>;
  title_not_contains?: Maybe<Scalars["String"]>;
  avatar_exists?: Maybe<Scalars["Boolean"]>;
  preface_exists?: Maybe<Scalars["Boolean"]>;
  preface?: Maybe<Scalars["String"]>;
  preface_not?: Maybe<Scalars["String"]>;
  preface_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  preface_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  preface_contains?: Maybe<Scalars["String"]>;
  preface_not_contains?: Maybe<Scalars["String"]>;
  knowledgeBase_exists?: Maybe<Scalars["Boolean"]>;
  knowledgeBase?: Maybe<Scalars["String"]>;
  knowledgeBase_not?: Maybe<Scalars["String"]>;
  knowledgeBase_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  knowledgeBase_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  knowledgeBase_contains?: Maybe<Scalars["String"]>;
  knowledgeBase_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<AboutPageFilter>>>;
  AND?: Maybe<Array<Maybe<AboutPageFilter>>>;
};

export enum AboutPageOrder {
  TitleAsc = "title_ASC",
  TitleDesc = "title_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC",
}

export type ShowcaseFilter = {
  sys?: Maybe<SysFilter>;
  title_exists?: Maybe<Scalars["Boolean"]>;
  title?: Maybe<Scalars["String"]>;
  title_not?: Maybe<Scalars["String"]>;
  title_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_contains?: Maybe<Scalars["String"]>;
  title_not_contains?: Maybe<Scalars["String"]>;
  tech_exists?: Maybe<Scalars["Boolean"]>;
  tech_contains_all?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tech_contains_some?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tech_contains_none?: Maybe<Array<Maybe<Scalars["String"]>>>;
  image_exists?: Maybe<Scalars["Boolean"]>;
  url_exists?: Maybe<Scalars["Boolean"]>;
  url?: Maybe<Scalars["String"]>;
  url_not?: Maybe<Scalars["String"]>;
  url_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url_contains?: Maybe<Scalars["String"]>;
  url_not_contains?: Maybe<Scalars["String"]>;
  featuredOrder_exists?: Maybe<Scalars["Boolean"]>;
  featuredOrder?: Maybe<Scalars["Int"]>;
  featuredOrder_not?: Maybe<Scalars["Int"]>;
  featuredOrder_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  featuredOrder_not_in?: Maybe<Array<Maybe<Scalars["Int"]>>>;
  featuredOrder_gt?: Maybe<Scalars["Int"]>;
  featuredOrder_gte?: Maybe<Scalars["Int"]>;
  featuredOrder_lt?: Maybe<Scalars["Int"]>;
  featuredOrder_lte?: Maybe<Scalars["Int"]>;
  OR?: Maybe<Array<Maybe<ShowcaseFilter>>>;
  AND?: Maybe<Array<Maybe<ShowcaseFilter>>>;
};

export enum ShowcaseOrder {
  TitleAsc = "title_ASC",
  TitleDesc = "title_DESC",
  UrlAsc = "url_ASC",
  UrlDesc = "url_DESC",
  FeaturedOrderAsc = "featuredOrder_ASC",
  FeaturedOrderDesc = "featuredOrder_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC",
}

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/appearance) */
export type Appearance = Entry & {
  __typename?: "Appearance";
  sys: Sys;
  linkedFrom?: Maybe<AppearanceLinkingCollections>;
  title?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["DateTime"]>;
  subtitle?: Maybe<Scalars["String"]>;
  url?: Maybe<Scalars["String"]>;
  tags?: Maybe<Array<Maybe<Scalars["String"]>>>;
  category?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/appearance) */
export type AppearanceLinkedFromArgs = {
  allowedLocales?: Maybe<Array<Maybe<Scalars["String"]>>>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/appearance) */
export type AppearanceTitleArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/appearance) */
export type AppearanceDateArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/appearance) */
export type AppearanceSubtitleArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/appearance) */
export type AppearanceUrlArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/appearance) */
export type AppearanceTagsArgs = {
  locale?: Maybe<Scalars["String"]>;
};

/** [See type definition](https://app.contentful.com/spaces/kve0ex6jlycb/content_types/appearance) */
export type AppearanceCategoryArgs = {
  locale?: Maybe<Scalars["String"]>;
};

export type AppearanceLinkingCollections = {
  __typename?: "AppearanceLinkingCollections";
  entryCollection?: Maybe<EntryCollection>;
};

export type AppearanceLinkingCollectionsEntryCollectionArgs = {
  skip?: Maybe<Scalars["Int"]>;
  limit?: Maybe<Scalars["Int"]>;
  preview?: Maybe<Scalars["Boolean"]>;
  locale?: Maybe<Scalars["String"]>;
};

export type AppearanceFilter = {
  sys?: Maybe<SysFilter>;
  title_exists?: Maybe<Scalars["Boolean"]>;
  title?: Maybe<Scalars["String"]>;
  title_not?: Maybe<Scalars["String"]>;
  title_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_contains?: Maybe<Scalars["String"]>;
  title_not_contains?: Maybe<Scalars["String"]>;
  date_exists?: Maybe<Scalars["Boolean"]>;
  date?: Maybe<Scalars["DateTime"]>;
  date_not?: Maybe<Scalars["DateTime"]>;
  date_in?: Maybe<Array<Maybe<Scalars["DateTime"]>>>;
  date_not_in?: Maybe<Array<Maybe<Scalars["DateTime"]>>>;
  date_gt?: Maybe<Scalars["DateTime"]>;
  date_gte?: Maybe<Scalars["DateTime"]>;
  date_lt?: Maybe<Scalars["DateTime"]>;
  date_lte?: Maybe<Scalars["DateTime"]>;
  subtitle_exists?: Maybe<Scalars["Boolean"]>;
  subtitle?: Maybe<Scalars["String"]>;
  subtitle_not?: Maybe<Scalars["String"]>;
  subtitle_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subtitle_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subtitle_contains?: Maybe<Scalars["String"]>;
  subtitle_not_contains?: Maybe<Scalars["String"]>;
  url_exists?: Maybe<Scalars["Boolean"]>;
  url?: Maybe<Scalars["String"]>;
  url_not?: Maybe<Scalars["String"]>;
  url_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  url_contains?: Maybe<Scalars["String"]>;
  url_not_contains?: Maybe<Scalars["String"]>;
  tags_exists?: Maybe<Scalars["Boolean"]>;
  tags_contains_all?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tags_contains_some?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tags_contains_none?: Maybe<Array<Maybe<Scalars["String"]>>>;
  category_exists?: Maybe<Scalars["Boolean"]>;
  category?: Maybe<Scalars["String"]>;
  category_not?: Maybe<Scalars["String"]>;
  category_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  category_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  category_contains?: Maybe<Scalars["String"]>;
  category_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<AppearanceFilter>>>;
  AND?: Maybe<Array<Maybe<AppearanceFilter>>>;
};

export enum AppearanceOrder {
  TitleAsc = "title_ASC",
  TitleDesc = "title_DESC",
  DateAsc = "date_ASC",
  DateDesc = "date_DESC",
  SubtitleAsc = "subtitle_ASC",
  SubtitleDesc = "subtitle_DESC",
  UrlAsc = "url_ASC",
  UrlDesc = "url_DESC",
  CategoryAsc = "category_ASC",
  CategoryDesc = "category_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC",
}

export type AppearanceCollection = {
  __typename?: "AppearanceCollection";
  total: Scalars["Int"];
  skip: Scalars["Int"];
  limit: Scalars["Int"];
  items: Array<Maybe<Appearance>>;
};

export type BlogPostFilter = {
  sys?: Maybe<SysFilter>;
  image_exists?: Maybe<Scalars["Boolean"]>;
  title_exists?: Maybe<Scalars["Boolean"]>;
  title?: Maybe<Scalars["String"]>;
  title_not?: Maybe<Scalars["String"]>;
  title_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  title_contains?: Maybe<Scalars["String"]>;
  title_not_contains?: Maybe<Scalars["String"]>;
  slug_exists?: Maybe<Scalars["Boolean"]>;
  slug?: Maybe<Scalars["String"]>;
  slug_not?: Maybe<Scalars["String"]>;
  slug_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  slug_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  slug_contains?: Maybe<Scalars["String"]>;
  slug_not_contains?: Maybe<Scalars["String"]>;
  subtitle_exists?: Maybe<Scalars["Boolean"]>;
  subtitle?: Maybe<Scalars["String"]>;
  subtitle_not?: Maybe<Scalars["String"]>;
  subtitle_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subtitle_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  subtitle_contains?: Maybe<Scalars["String"]>;
  subtitle_not_contains?: Maybe<Scalars["String"]>;
  postedAt_exists?: Maybe<Scalars["Boolean"]>;
  postedAt?: Maybe<Scalars["DateTime"]>;
  postedAt_not?: Maybe<Scalars["DateTime"]>;
  postedAt_in?: Maybe<Array<Maybe<Scalars["DateTime"]>>>;
  postedAt_not_in?: Maybe<Array<Maybe<Scalars["DateTime"]>>>;
  postedAt_gt?: Maybe<Scalars["DateTime"]>;
  postedAt_gte?: Maybe<Scalars["DateTime"]>;
  postedAt_lt?: Maybe<Scalars["DateTime"]>;
  postedAt_lte?: Maybe<Scalars["DateTime"]>;
  tags_exists?: Maybe<Scalars["Boolean"]>;
  tags_contains_all?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tags_contains_some?: Maybe<Array<Maybe<Scalars["String"]>>>;
  tags_contains_none?: Maybe<Array<Maybe<Scalars["String"]>>>;
  content_exists?: Maybe<Scalars["Boolean"]>;
  content?: Maybe<Scalars["String"]>;
  content_not?: Maybe<Scalars["String"]>;
  content_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  content_not_in?: Maybe<Array<Maybe<Scalars["String"]>>>;
  content_contains?: Maybe<Scalars["String"]>;
  content_not_contains?: Maybe<Scalars["String"]>;
  OR?: Maybe<Array<Maybe<BlogPostFilter>>>;
  AND?: Maybe<Array<Maybe<BlogPostFilter>>>;
};

export enum BlogPostOrder {
  TitleAsc = "title_ASC",
  TitleDesc = "title_DESC",
  SlugAsc = "slug_ASC",
  SlugDesc = "slug_DESC",
  SubtitleAsc = "subtitle_ASC",
  SubtitleDesc = "subtitle_DESC",
  PostedAtAsc = "postedAt_ASC",
  PostedAtDesc = "postedAt_DESC",
  SysIdAsc = "sys_id_ASC",
  SysIdDesc = "sys_id_DESC",
  SysPublishedAtAsc = "sys_publishedAt_ASC",
  SysPublishedAtDesc = "sys_publishedAt_DESC",
  SysFirstPublishedAtAsc = "sys_firstPublishedAt_ASC",
  SysFirstPublishedAtDesc = "sys_firstPublishedAt_DESC",
  SysPublishedVersionAsc = "sys_publishedVersion_ASC",
  SysPublishedVersionDesc = "sys_publishedVersion_DESC",
}
