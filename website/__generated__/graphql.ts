// @ts-nocheck
/* eslint-disable */
import { fetchOptions } from "lib/graphql";
import { JsonValue } from "type-fest";
import { useQuery, UseQueryOptions } from "react-query";
export type Maybe<T> = T;
export type InputMaybe<T> = T;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Dictionary<T = unknown> = Record<string, T>;

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(process.env.GRAPHQL_ENDPOINT as string, {
      method: "POST",
      ...fetchOptions,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  };
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BooleanType: boolean;
  CustomData: Dictionary<string>;
  Date: string;
  DateTime: string;
  FloatType: number;
  IntType: number;
  ItemId: string;
  JsonField: JsonValue;
  MetaTagAttributes: Dictionary<string>;
  UploadId: string;
};

/** Specifies how to filter Boolean fields */
export type BooleanFilter = {
  /** Search for records with an exact match */
  eq: InputMaybe<Scalars["BooleanType"]>;
};

export type CollectionMetadata = {
  count: Scalars["IntType"];
};

export enum ColorBucketType {
  Black = "black",
  Blue = "blue",
  Brown = "brown",
  Cyan = "cyan",
  Green = "green",
  Grey = "grey",
  Orange = "orange",
  Pink = "pink",
  Purple = "purple",
  Red = "red",
  White = "white",
  Yellow = "yellow",
}

export type ColorField = {
  alpha: Scalars["IntType"];
  blue: Scalars["IntType"];
  green: Scalars["IntType"];
  hex: Scalars["String"];
  red: Scalars["IntType"];
};

/** Specifies how to filter by creation datetime */
export type CreatedAtFilter = {
  /** Filter records with a value that's within the specified minute range. Seconds and milliseconds are truncated from the argument. */
  eq: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Filter records with a value that's strictly greater than the one specified. Seconds and milliseconds are truncated from the argument. */
  gt: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's greater than or equal to than the one specified. Seconds and milliseconds are truncated from the argument. */
  gte: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's less than the one specified. Seconds and milliseconds are truncated from the argument. */
  lt: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's less or equal than the one specified. Seconds and milliseconds are truncated from the argument. */
  lte: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's outside the specified minute range. Seconds and milliseconds are truncated from the argument. */
  neq: InputMaybe<Scalars["DateTime"]>;
};

/** Specifies how to filter Date fields */
export type DateFilter = {
  /** Search for records with an exact match */
  eq: InputMaybe<Scalars["Date"]>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Filter records with a value that's strictly greater than the one specified */
  gt: InputMaybe<Scalars["Date"]>;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte: InputMaybe<Scalars["Date"]>;
  /** Filter records with a value that's less than the one specified */
  lt: InputMaybe<Scalars["Date"]>;
  /** Filter records with a value that's less or equal than the one specified */
  lte: InputMaybe<Scalars["Date"]>;
  /** Exclude records with an exact match */
  neq: InputMaybe<Scalars["Date"]>;
};

export enum FaviconType {
  AppleTouchIcon = "appleTouchIcon",
  Icon = "icon",
  MsApplication = "msApplication",
}

export type FileField = FileFieldInterface & {
  _createdAt: Scalars["DateTime"];
  _updatedAt: Scalars["DateTime"];
  alt: Maybe<Scalars["String"]>;
  author: Maybe<Scalars["String"]>;
  basename: Scalars["String"];
  blurUpThumb: Maybe<Scalars["String"]>;
  blurhash: Maybe<Scalars["String"]>;
  colors: Array<ColorField>;
  copyright: Maybe<Scalars["String"]>;
  customData: Scalars["CustomData"];
  exifInfo: Scalars["CustomData"];
  filename: Scalars["String"];
  focalPoint: Maybe<FocalPoint>;
  format: Scalars["String"];
  height: Maybe<Scalars["IntType"]>;
  id: Scalars["UploadId"];
  md5: Scalars["String"];
  mimeType: Scalars["String"];
  notes: Maybe<Scalars["String"]>;
  responsiveImage: Maybe<ResponsiveImage>;
  size: Scalars["IntType"];
  smartTags: Array<Scalars["String"]>;
  tags: Array<Scalars["String"]>;
  title: Maybe<Scalars["String"]>;
  url: Scalars["String"];
  video: Maybe<UploadVideoField>;
  width: Maybe<Scalars["IntType"]>;
};

export type FileFieldAltArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

export type FileFieldBlurUpThumbArgs = {
  imgixParams: InputMaybe<ImgixParams>;
  punch?: InputMaybe<Scalars["Float"]>;
  quality?: InputMaybe<Scalars["Int"]>;
  size?: InputMaybe<Scalars["Int"]>;
};

export type FileFieldCustomDataArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

export type FileFieldFocalPointArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

export type FileFieldResponsiveImageArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  imgixParams: InputMaybe<ImgixParams>;
  locale: InputMaybe<SiteLocale>;
  sizes: InputMaybe<Scalars["String"]>;
};

export type FileFieldTitleArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

export type FileFieldUrlArgs = {
  imgixParams: InputMaybe<ImgixParams>;
};

export type FileFieldInterface = {
  _createdAt: Scalars["DateTime"];
  _updatedAt: Scalars["DateTime"];
  alt: Maybe<Scalars["String"]>;
  author: Maybe<Scalars["String"]>;
  basename: Scalars["String"];
  blurUpThumb: Maybe<Scalars["String"]>;
  blurhash: Maybe<Scalars["String"]>;
  colors: Array<ColorField>;
  copyright: Maybe<Scalars["String"]>;
  customData: Scalars["CustomData"];
  exifInfo: Scalars["CustomData"];
  filename: Scalars["String"];
  focalPoint: Maybe<FocalPoint>;
  format: Scalars["String"];
  height: Maybe<Scalars["IntType"]>;
  id: Scalars["UploadId"];
  md5: Scalars["String"];
  mimeType: Scalars["String"];
  notes: Maybe<Scalars["String"]>;
  responsiveImage: Maybe<ResponsiveImage>;
  size: Scalars["IntType"];
  smartTags: Array<Scalars["String"]>;
  tags: Array<Scalars["String"]>;
  title: Maybe<Scalars["String"]>;
  url: Scalars["String"];
  video: Maybe<UploadVideoField>;
  width: Maybe<Scalars["IntType"]>;
};

export type FileFieldInterfaceAltArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

export type FileFieldInterfaceBlurUpThumbArgs = {
  imgixParams: InputMaybe<ImgixParams>;
  punch?: InputMaybe<Scalars["Float"]>;
  quality?: InputMaybe<Scalars["Int"]>;
  size?: InputMaybe<Scalars["Int"]>;
};

export type FileFieldInterfaceCustomDataArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

export type FileFieldInterfaceFocalPointArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

export type FileFieldInterfaceResponsiveImageArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  imgixParams: InputMaybe<ImgixParams>;
  locale: InputMaybe<SiteLocale>;
  sizes: InputMaybe<Scalars["String"]>;
};

export type FileFieldInterfaceTitleArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

export type FileFieldInterfaceUrlArgs = {
  imgixParams: InputMaybe<ImgixParams>;
};

/** Specifies how to filter Single-file/image fields */
export type FileFilter = {
  /** Search for records with an exact match. The specified value must be an Upload ID */
  eq: InputMaybe<Scalars["UploadId"]>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Filter records that have one of the specified uploads */
  in: InputMaybe<Array<InputMaybe<Scalars["UploadId"]>>>;
  /** Exclude records with an exact match. The specified value must be an Upload ID */
  neq: InputMaybe<Scalars["UploadId"]>;
  /** Filter records that do not have one of the specified uploads */
  notIn: InputMaybe<Array<InputMaybe<Scalars["UploadId"]>>>;
};

export type GlobalSeoField = {
  facebookPageUrl: Maybe<Scalars["String"]>;
  fallbackSeo: Maybe<SeoField>;
  siteName: Maybe<Scalars["String"]>;
  titleSuffix: Maybe<Scalars["String"]>;
  twitterAccount: Maybe<Scalars["String"]>;
};

/** Record of type Home Page (home_page) */
export type HomePageRecord = RecordInterface & {
  _createdAt: Scalars["DateTime"];
  _firstPublishedAt: Maybe<Scalars["DateTime"]>;
  _isValid: Scalars["BooleanType"];
  _modelApiKey: Scalars["String"];
  _publicationScheduledAt: Maybe<Scalars["DateTime"]>;
  _publishedAt: Maybe<Scalars["DateTime"]>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars["DateTime"]>;
  _updatedAt: Scalars["DateTime"];
  createdAt: Scalars["DateTime"];
  excerpt: Scalars["String"];
  id: Scalars["ItemId"];
  updatedAt: Scalars["DateTime"];
};

/** Record of type Home Page (home_page) */
export type HomePageRecord_SeoMetaTagsArgs = {
  locale: InputMaybe<SiteLocale>;
};

/** Record of type Home Page (home_page) */
export type HomePageRecordExcerptArgs = {
  markdown: InputMaybe<Scalars["Boolean"]>;
};

export type ImgixParams = {
  /**
   * Aspect Ratio
   *
   * Specifies an aspect ratio to maintain when resizing and cropping the image
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/ar)
   */
  ar: InputMaybe<Scalars["String"]>;
  /**
   * Automatic
   *
   * Applies automatic enhancements to images.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/auto)
   */
  auto: InputMaybe<Array<ImgixParamsAuto>>;
  /**
   * Background Color
   *
   * Colors the background of padded and partially-transparent images.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/bg)
   */
  bg: InputMaybe<Scalars["String"]>;
  /**
   * Blend
   *
   * Specifies the location of the blend image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend)
   */
  blend: InputMaybe<Scalars["String"]>;
  /**
   * Blend Align
   *
   * Changes the blend alignment relative to the parent image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-align)
   */
  blendAlign: InputMaybe<Array<ImgixParamsBlendAlign>>;
  /**
   * Blend Alpha
   *
   * Changes the alpha of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-alpha)
   */
  blendAlpha: InputMaybe<Scalars["IntType"]>;
  /**
   * Blend Color
   *
   * Specifies a color to use when applying the blend.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-color)
   */
  blendColor: InputMaybe<Scalars["String"]>;
  /**
   * Blend Crop
   *
   * Specifies the type of crop for blend images.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-crop)
   */
  blendCrop: InputMaybe<Array<ImgixParamsBlendCrop>>;
  /**
   * Blend Fit
   *
   * Specifies the fit mode for blend images.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-fit)
   */
  blendFit: InputMaybe<ImgixParamsBlendFit>;
  /**
   * Blend Height
   *
   * Adjusts the height of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-h)
   */
  blendH: InputMaybe<Scalars["FloatType"]>;
  /**
   * Blend Mode
   *
   * Sets the blend mode for a blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-mode)
   */
  blendMode: InputMaybe<ImgixParamsBlendMode>;
  /**
   * Blend Padding
   *
   * Applies padding to the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-pad)
   */
  blendPad: InputMaybe<Scalars["IntType"]>;
  /**
   * Blend Size
   *
   * Adjusts the size of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-size)
   */
  blendSize: InputMaybe<ImgixParamsBlendSize>;
  /**
   * Blend Width
   *
   * Adjusts the width of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-w)
   */
  blendW: InputMaybe<Scalars["FloatType"]>;
  /**
   * Blend X Position
   *
   * Adjusts the x-offset of the blend image relative to its parent.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-x)
   */
  blendX: InputMaybe<Scalars["IntType"]>;
  /**
   * Blend Y Position
   *
   * Adjusts the y-offset of the blend image relative to its parent.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-y)
   */
  blendY: InputMaybe<Scalars["IntType"]>;
  /**
   * Gaussian Blur
   *
   * Applies a gaussian blur to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/blur)
   */
  blur: InputMaybe<Scalars["IntType"]>;
  /**
   * Border Size & Color
   *
   * Applies a border to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/border)
   */
  border: InputMaybe<Scalars["String"]>;
  /**
   * Border Bottom
   *
   * Sets bottom border of an image.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/border-bottom)
   */
  borderBottom: InputMaybe<Scalars["IntType"]>;
  /**
   * Border Left
   *
   * Sets left border of an image.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/border-left)
   */
  borderLeft: InputMaybe<Scalars["IntType"]>;
  /**
   * Outer Border Radius
   *
   * Sets the outer radius of the image's border in pixels.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/border-radius)
   */
  borderRadius: InputMaybe<Scalars["String"]>;
  /**
   * Inner Border Radius
   *
   * Sets the inner radius of the image's border in pixels.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/border-radius-inner)
   */
  borderRadiusInner: InputMaybe<Scalars["String"]>;
  /**
   * Border Right
   *
   * Sets right border of an image.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/border-right)
   */
  borderRight: InputMaybe<Scalars["IntType"]>;
  /**
   * Border Top
   *
   * Sets top border of an image.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/border-top)
   */
  borderTop: InputMaybe<Scalars["IntType"]>;
  /**
   * Brightness
   *
   * Adjusts the brightness of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/bri)
   */
  bri: InputMaybe<Scalars["IntType"]>;
  /**
   * Client Hints
   *
   * Sets one or more Client-Hints headers
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/ch)
   */
  ch: InputMaybe<Array<ImgixParamsCh>>;
  /**
   * Chroma Subsampling
   *
   * Specifies the output chroma subsampling rate.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/chromasub)
   */
  chromasub: InputMaybe<Scalars["IntType"]>;
  /**
   * Color Quantization
   *
   * Limits the number of unique colors in an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/colorquant)
   */
  colorquant: InputMaybe<Scalars["IntType"]>;
  /**
   * Palette Color Count
   *
   * Specifies how many colors to include in a palette-extraction response.
   *
   * Depends on: `palette`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/color-palette/colors)
   */
  colors: InputMaybe<Scalars["IntType"]>;
  /**
   * Contrast
   *
   * Adjusts the contrast of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/con)
   */
  con: InputMaybe<Scalars["IntType"]>;
  /**
   * Mask Corner Radius
   *
   * Specifies the radius value for a rounded corner mask.
   *
   * Depends on: `mask=corners`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/mask/corner-radius)
   */
  cornerRadius: InputMaybe<Scalars["String"]>;
  /**
   * Crop Mode
   *
   * Specifies how to crop an image.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/crop)
   */
  crop: InputMaybe<Array<ImgixParamsCrop>>;
  /**
   * Color Space
   *
   * Specifies the color space of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/cs)
   */
  cs: InputMaybe<ImgixParamsCs>;
  /**
   * Download
   *
   * Forces a URL to use send-file in its response.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/dl)
   */
  dl: InputMaybe<Scalars["String"]>;
  /**
   * Dots Per Inch
   *
   * Sets the DPI value in the EXIF header.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/dpi)
   */
  dpi: InputMaybe<Scalars["IntType"]>;
  /**
   * Device Pixel Ratio
   *
   * Adjusts the device-pixel ratio of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/dpr)
   */
  dpr: InputMaybe<Scalars["FloatType"]>;
  /**
   * Duotone
   *
   * Applies a duotone effect to the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/duotone)
   */
  duotone: InputMaybe<Scalars["String"]>;
  /**
   * Duotone Alpha
   *
   * Changes the alpha of the duotone effect atop the source image.
   *
   * Depends on: `duotone`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/duotone-alpha)
   */
  duotoneAlpha: InputMaybe<Scalars["IntType"]>;
  /**
   * Exposure
   *
   * Adjusts the exposure of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/exp)
   */
  exp: InputMaybe<Scalars["IntType"]>;
  /**
   * Url Expiration Timestamp
   *
   * A Unix timestamp specifying a UTC time. Requests made to this URL after that time will output a 404 status code.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/expires)
   */
  expires: InputMaybe<Scalars["IntType"]>;
  /**
   * Face Index
   *
   * Selects a face to crop to.
   *
   * Depends on: `fit=facearea`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/face-detection/faceindex)
   */
  faceindex: InputMaybe<Scalars["IntType"]>;
  /**
   * Face Padding
   *
   * Adjusts padding around a selected face.
   *
   * Depends on: `fit=facearea`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/face-detection/facepad)
   */
  facepad: InputMaybe<Scalars["FloatType"]>;
  /**
   * Json Face Data
   *
   * Specifies that face data should be included in output when combined with `fm=json`.
   *
   * Depends on: `fm=json`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/face-detection/faces)
   */
  faces: InputMaybe<Scalars["IntType"]>;
  /**
   * Fill Mode
   *
   * Determines how to fill in additional space created by the fit setting
   *
   * Depends on: `fit`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/fill/fill)
   */
  fill: InputMaybe<ImgixParamsFill>;
  /**
   * Fill Color
   *
   * Sets the fill color for images with additional space created by the fit setting
   *
   * Depends on: `fill=solid`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/fill/fill-color)
   */
  fillColor: InputMaybe<Scalars["String"]>;
  /**
   * Resize Fit Mode
   *
   * Specifies how to map the source image to the output image dimensions.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/fit)
   */
  fit: InputMaybe<ImgixParamsFit>;
  /**
   * Flip Axis
   *
   * Flips an image on a specified axis.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/rotation/flip)
   */
  flip: InputMaybe<ImgixParamsFlip>;
  /**
   * Output Format
   *
   * Changes the format of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/fm)
   */
  fm: InputMaybe<ImgixParamsFm>;
  /**
   * Focal Point Debug
   *
   * Displays crosshairs identifying the location of the set focal point
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/focalpoint-crop/fp-debug)
   */
  fpDebug: InputMaybe<Scalars["BooleanType"]>;
  /**
   * Focal Point X Position
   *
   * Sets the relative horizontal value for the focal point of an image
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/focalpoint-crop/fp-x)
   */
  fpX: InputMaybe<Scalars["FloatType"]>;
  /**
   * Focal Point Y Position
   *
   * Sets the relative vertical value for the focal point of an image
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/focalpoint-crop/fp-y)
   */
  fpY: InputMaybe<Scalars["FloatType"]>;
  /**
   * Focal Point Zoom
   *
   * Sets the relative zoom value for the focal point of an image
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/focalpoint-crop/fp-z)
   */
  fpZ: InputMaybe<Scalars["FloatType"]>;
  /**
   * Gamma
   *
   * Adjusts the gamma of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/gam)
   */
  gam: InputMaybe<Scalars["IntType"]>;
  /**
   * Grid Colors
   *
   * Sets grid colors for the transparency checkerboard grid.
   *
   * Depends on: `transparency`
   */
  gridColors: InputMaybe<Scalars["String"]>;
  /**
   * Grid Size
   *
   * Sets grid size for the transparency checkerboard grid.
   *
   * Depends on: `transparency`
   */
  gridSize: InputMaybe<Scalars["IntType"]>;
  /**
   * Image Height
   *
   * Adjusts the height of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/h)
   */
  h: InputMaybe<Scalars["FloatType"]>;
  /**
   * Highlight
   *
   * Adjusts the highlights of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/high)
   */
  high: InputMaybe<Scalars["IntType"]>;
  /**
   * Halftone
   *
   * Applies a half-tone effect to the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/htn)
   */
  htn: InputMaybe<Scalars["IntType"]>;
  /**
   * Hue Shift
   *
   * Adjusts the hue of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/hue)
   */
  hue: InputMaybe<Scalars["IntType"]>;
  /**
   * Invert
   *
   * Inverts the colors on the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/invert)
   */
  invert: InputMaybe<Scalars["BooleanType"]>;
  /**
   * Iptc Passthrough
   *
   * Determine if IPTC data should be passed for JPEG images.
   */
  iptc: InputMaybe<ImgixParamsIptc>;
  /**
   * Lossless Compression
   *
   * Specifies that the output image should be a lossless variant.
   *
   * Depends on: `fm=webp`, `fm=jxr`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/lossless)
   */
  lossless: InputMaybe<Scalars["BooleanType"]>;
  /**
   * Watermark Image Url
   *
   * Specifies the location of the watermark image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark)
   */
  mark: InputMaybe<Scalars["String"]>;
  /**
   * Watermark Alignment Mode
   *
   * Changes the watermark alignment relative to the parent image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-align)
   */
  markAlign: InputMaybe<Array<ImgixParamsMarkAlign>>;
  /**
   * Watermark Alpha
   *
   * Changes the alpha of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-alpha)
   */
  markAlpha: InputMaybe<Scalars["IntType"]>;
  /**
   * Watermark Base Url
   *
   * Changes base URL of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-base)
   */
  markBase: InputMaybe<Scalars["String"]>;
  /**
   * Watermark Fit Mode
   *
   * Specifies the fit mode for watermark images.
   *
   * Depends on: `mark`, `markw`, `markh`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-fit)
   */
  markFit: InputMaybe<ImgixParamsMarkFit>;
  /**
   * Watermark Height
   *
   * Adjusts the height of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-h)
   */
  markH: InputMaybe<Scalars["FloatType"]>;
  /**
   * Watermark Padding
   *
   * Applies padding to the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-pad)
   */
  markPad: InputMaybe<Scalars["IntType"]>;
  /**
   * Watermark Rotation
   *
   * Rotates a watermark or tiled watermarks by a specified number of degrees.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-rot)
   */
  markRot: InputMaybe<Scalars["FloatType"]>;
  /**
   * Watermark Scale
   *
   * Adjusts the scale of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-scale)
   */
  markScale: InputMaybe<Scalars["IntType"]>;
  /**
   * Watermark Tile
   *
   * Adds tiled watermark.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-tile)
   */
  markTile: InputMaybe<ImgixParamsMarkTile>;
  /**
   * Watermark Width
   *
   * Adjusts the width of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-w)
   */
  markW: InputMaybe<Scalars["FloatType"]>;
  /**
   * Watermark X Position
   *
   * Adjusts the x-offset of the watermark image relative to its parent.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-x)
   */
  markX: InputMaybe<Scalars["IntType"]>;
  /**
   * Watermark Y Position
   *
   * Adjusts the y-offset of the watermark image relative to its parent.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-y)
   */
  markY: InputMaybe<Scalars["IntType"]>;
  /**
   * Mask Type
   *
   * Defines the type of mask and specifies the URL if that type is selected.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/mask)
   */
  mask: InputMaybe<Scalars["String"]>;
  /**
   * Mask Background Color
   *
   * Colors the background of the transparent mask area of images
   *
   * Depends on: `mask`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/mask/mask-bg)
   */
  maskBg: InputMaybe<Scalars["String"]>;
  /**
   * Maximum Height
   *
   * Specifies the maximum height of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/max-height)
   */
  maxH: InputMaybe<Scalars["IntType"]>;
  /**
   * Maximum Width
   *
   * Specifies the maximum width of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/max-width)
   */
  maxW: InputMaybe<Scalars["IntType"]>;
  /**
   * Minimum Height
   *
   * Specifies the minimum height of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/min-height)
   */
  minH: InputMaybe<Scalars["IntType"]>;
  /**
   * Minimum Width
   *
   * Specifies the minimum width of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/min-width)
   */
  minW: InputMaybe<Scalars["IntType"]>;
  /**
   * Monochrome
   *
   * Applies a monochrome effect to the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/monochrome)
   */
  monochrome: InputMaybe<Scalars["String"]>;
  /**
   * Noise Reduction Bound
   *
   * Reduces the noise in an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/noise-reduction/nr)
   */
  nr: InputMaybe<Scalars["IntType"]>;
  /**
   * Noise Reduction Sharpen
   *
   * Provides a threshold by which to sharpen an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/noise-reduction/nrs)
   */
  nrs: InputMaybe<Scalars["IntType"]>;
  /**
   * Orientation
   *
   * Changes the image orientation.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/rotation/orient)
   */
  orient: InputMaybe<Scalars["IntType"]>;
  /**
   * Padding
   *
   * Pads an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/pad)
   */
  pad: InputMaybe<Scalars["IntType"]>;
  /**
   * Padding Bottom
   *
   * Sets bottom padding of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/pad-bottom)
   */
  padBottom: InputMaybe<Scalars["IntType"]>;
  /**
   * Padding Left
   *
   * Sets left padding of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/pad-left)
   */
  padLeft: InputMaybe<Scalars["IntType"]>;
  /**
   * Padding Right
   *
   * Sets right padding of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/pad-right)
   */
  padRight: InputMaybe<Scalars["IntType"]>;
  /**
   * Padding Top
   *
   * Sets top padding of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/pad-top)
   */
  padTop: InputMaybe<Scalars["IntType"]>;
  /**
   * Pdf Page Number
   *
   * Selects a page from a PDF for display.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/pdf/page)
   */
  page: InputMaybe<Scalars["IntType"]>;
  /**
   * Color Palette Extraction
   *
   * Specifies an output format for palette-extraction.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/color-palette/palette)
   */
  palette: InputMaybe<ImgixParamsPalette>;
  /**
   * Pdf Annotation
   *
   * Enables or disables PDF annotation.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/pdf/pdf-annotation)
   */
  pdfAnnotation: InputMaybe<Scalars["BooleanType"]>;
  /**
   * Css Prefix
   *
   * Specifies a CSS prefix for all classes in palette-extraction.
   *
   * Depends on: `palette=css`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/color-palette/prefix)
   */
  prefix: InputMaybe<Scalars["String"]>;
  /**
   * Pixellate
   *
   * Applies a pixelation effect to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/px)
   */
  px: InputMaybe<Scalars["IntType"]>;
  /**
   * Output Quality
   *
   * Adjusts the quality of an output image.
   *
   * Depends on: `fm=jpg`, `fm=pjpg`, `fm=webp`, `fm=jxr`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/q)
   */
  q: InputMaybe<Scalars["IntType"]>;
  /**
   * Source Rectangle Region
   *
   * Crops an image to a specified rectangle.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/rect)
   */
  rect: InputMaybe<Scalars["String"]>;
  /**
   * Rotation
   *
   * Rotates an image by a specified number of degrees.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/rotation/rot)
   */
  rot: InputMaybe<Scalars["FloatType"]>;
  /**
   * Saturation
   *
   * Adjusts the saturation of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/sat)
   */
  sat: InputMaybe<Scalars["IntType"]>;
  /**
   * Sepia Tone
   *
   * Applies a sepia effect to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/sepia)
   */
  sepia: InputMaybe<Scalars["IntType"]>;
  /**
   * Shadow
   *
   * Adjusts the highlights of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/shad)
   */
  shad: InputMaybe<Scalars["FloatType"]>;
  /**
   * Sharpen
   *
   * Adjusts the sharpness of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/sharp)
   */
  sharp: InputMaybe<Scalars["FloatType"]>;
  /**
   * Transparency
   *
   * Adds checkerboard behind images which support transparency.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/fill/transparency)
   */
  transparency: InputMaybe<ImgixParamsTransparency>;
  /**
   * Trim Image
   *
   * Trims the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim)
   */
  trim: InputMaybe<ImgixParamsTrim>;
  /**
   * Trim Color
   *
   * Specifies a trim color on a trim operation.
   *
   * Depends on: `trim=color`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim-color)
   */
  trimColor: InputMaybe<Scalars["String"]>;
  /**
   * Trim Mean Difference
   *
   * Specifies the mean difference on a trim operation.
   *
   * Depends on: `trim=auto`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim-md)
   */
  trimMd: InputMaybe<Scalars["FloatType"]>;
  /**
   * Trim Padding
   *
   * Pads the area of the source image before trimming.
   *
   * Depends on: `trim`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim-pad)
   */
  trimPad: InputMaybe<Scalars["IntType"]>;
  /**
   * Trim Standard Deviation
   *
   * Specifies the standard deviation on a trim operation.
   *
   * Depends on: `trim=auto`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim-sd)
   */
  trimSd: InputMaybe<Scalars["FloatType"]>;
  /**
   * Trim Tolerance
   *
   * Specifies the tolerance on a trim operation.
   *
   * Depends on: `trim=color`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim-tol)
   */
  trimTol: InputMaybe<Scalars["FloatType"]>;
  /**
   * Text String
   *
   * Sets the text string to render.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt)
   */
  txt: InputMaybe<Scalars["String"]>;
  /**
   * Text Align
   *
   * Sets the vertical and horizontal alignment of rendered text relative to the base image.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-align)
   */
  txtAlign: InputMaybe<Array<ImgixParamsTxtAlign>>;
  /**
   * Text Clipping Mode
   *
   * Sets the clipping properties of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-clip)
   */
  txtClip: InputMaybe<Array<ImgixParamsTxtClip>>;
  /**
   * Text Color
   *
   * Specifies the color of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-color)
   */
  txtColor: InputMaybe<Scalars["String"]>;
  /**
   * Text Fit Mode
   *
   * Specifies the fit approach for rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-fit)
   */
  txtFit: InputMaybe<ImgixParamsTxtFit>;
  /**
   * Text Font
   *
   * Selects a font for rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-font)
   */
  txtFont: InputMaybe<Scalars["String"]>;
  /**
   * Text Leading
   *
   * Sets the leading (line spacing) for rendered text. Only works on the multi-line text endpoint.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/typesetting/txt-lead)
   */
  txtLead: InputMaybe<Scalars["IntType"]>;
  /**
   * Text Ligatures
   *
   * Controls the level of ligature substitution
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-lig)
   */
  txtLig: InputMaybe<Scalars["IntType"]>;
  /**
   * Text Outline
   *
   * Outlines the rendered text with a specified color.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-line)
   */
  txtLine: InputMaybe<Scalars["IntType"]>;
  /**
   * Text Outline Color
   *
   * Specifies a text outline color.
   *
   * Depends on: `txt`, `txtline`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-line-color)
   */
  txtLineColor: InputMaybe<Scalars["String"]>;
  /**
   * Text Padding
   *
   * Specifies the padding (in device-independent pixels) between a textbox and the edges of the base image.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-pad)
   */
  txtPad: InputMaybe<Scalars["IntType"]>;
  /**
   * Text Shadow
   *
   * Applies a shadow to rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-shad)
   */
  txtShad: InputMaybe<Scalars["FloatType"]>;
  /**
   * Text Font Size
   *
   * Sets the font size of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-size)
   */
  txtSize: InputMaybe<Scalars["IntType"]>;
  /**
   * Text Tracking
   *
   * Sets the tracking (letter spacing) for rendered text. Only works on the multi-line text endpoint.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/typesetting/txt-track)
   */
  txtTrack: InputMaybe<Scalars["IntType"]>;
  /**
   * Text Width
   *
   * Sets the width of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-width)
   */
  txtWidth: InputMaybe<Scalars["IntType"]>;
  /**
   * Text X Position
   *
   * Sets the horizontal (x) position of the text in pixels relative to the left edge of the base image.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-x)
   */
  txtX: InputMaybe<Scalars["IntType"]>;
  /**
   * Text Y Position
   *
   * Sets the vertical (y) position of the text in pixels relative to the top edge of the base image.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-y)
   */
  txtY: InputMaybe<Scalars["IntType"]>;
  /**
   * Unsharp Mask
   *
   * Sharpens the source image using an unsharp mask.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/usm)
   */
  usm: InputMaybe<Scalars["IntType"]>;
  /**
   * Unsharp Mask Radius
   *
   * Specifies the radius for an unsharp mask operation.
   *
   * Depends on: `usm`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/usmrad)
   */
  usmrad: InputMaybe<Scalars["FloatType"]>;
  /**
   * Vibrance
   *
   * Adjusts the vibrance of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/vib)
   */
  vib: InputMaybe<Scalars["IntType"]>;
  /**
   * Image Width
   *
   * Adjusts the width of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/w)
   */
  w: InputMaybe<Scalars["FloatType"]>;
};

export enum ImgixParamsAuto {
  Compress = "compress",
  Enhance = "enhance",
  Format = "format",
  Redeye = "redeye",
}

export enum ImgixParamsBlendAlign {
  Bottom = "bottom",
  Center = "center",
  Left = "left",
  Middle = "middle",
  Right = "right",
  Top = "top",
}

export enum ImgixParamsBlendCrop {
  Bottom = "bottom",
  Faces = "faces",
  Left = "left",
  Right = "right",
  Top = "top",
}

export enum ImgixParamsBlendFit {
  Clamp = "clamp",
  Clip = "clip",
  Crop = "crop",
  Max = "max",
  Scale = "scale",
}

export enum ImgixParamsBlendMode {
  Burn = "burn",
  Color = "color",
  Darken = "darken",
  Difference = "difference",
  Dodge = "dodge",
  Exclusion = "exclusion",
  Hardlight = "hardlight",
  Hue = "hue",
  Lighten = "lighten",
  Luminosity = "luminosity",
  Multiply = "multiply",
  Normal = "normal",
  Overlay = "overlay",
  Saturation = "saturation",
  Screen = "screen",
  Softlight = "softlight",
}

export enum ImgixParamsBlendSize {
  Inherit = "inherit",
}

export enum ImgixParamsCh {
  Dpr = "dpr",
  SaveData = "saveData",
  Width = "width",
}

export enum ImgixParamsCrop {
  Bottom = "bottom",
  Edges = "edges",
  Entropy = "entropy",
  Faces = "faces",
  Focalpoint = "focalpoint",
  Left = "left",
  Right = "right",
  Top = "top",
}

export enum ImgixParamsCs {
  Adobergb1998 = "adobergb1998",
  Srgb = "srgb",
  Strip = "strip",
  Tinysrgb = "tinysrgb",
}

export enum ImgixParamsFill {
  Blur = "blur",
  Solid = "solid",
}

export enum ImgixParamsFit {
  Clamp = "clamp",
  Clip = "clip",
  Crop = "crop",
  Facearea = "facearea",
  Fill = "fill",
  Fillmax = "fillmax",
  Max = "max",
  Min = "min",
  Scale = "scale",
}

export enum ImgixParamsFlip {
  H = "h",
  Hv = "hv",
  V = "v",
}

export enum ImgixParamsFm {
  Avif = "avif",
  Blurhash = "blurhash",
  Gif = "gif",
  Jp2 = "jp2",
  Jpg = "jpg",
  Json = "json",
  Jxr = "jxr",
  Mp4 = "mp4",
  Pjpg = "pjpg",
  Png = "png",
  Png8 = "png8",
  Png32 = "png32",
  Webm = "webm",
  Webp = "webp",
}

export enum ImgixParamsIptc {
  Allow = "allow",
  Block = "block",
}

export enum ImgixParamsMarkAlign {
  Bottom = "bottom",
  Center = "center",
  Left = "left",
  Middle = "middle",
  Right = "right",
  Top = "top",
}

export enum ImgixParamsMarkFit {
  Clip = "clip",
  Crop = "crop",
  Fill = "fill",
  Max = "max",
  Scale = "scale",
}

export enum ImgixParamsMarkTile {
  Grid = "grid",
}

export enum ImgixParamsPalette {
  Css = "css",
  Json = "json",
}

export enum ImgixParamsTransparency {
  Grid = "grid",
}

export enum ImgixParamsTrim {
  Auto = "auto",
  Color = "color",
}

export enum ImgixParamsTxtAlign {
  Bottom = "bottom",
  Center = "center",
  Left = "left",
  Middle = "middle",
  Right = "right",
  Top = "top",
}

export enum ImgixParamsTxtClip {
  Ellipsis = "ellipsis",
  End = "end",
  Middle = "middle",
  Start = "start",
}

export enum ImgixParamsTxtFit {
  Max = "max",
}

/** Specifies how to filter by usage */
export type InUseFilter = {
  /** Search uploads that are currently used by some record or not */
  eq: InputMaybe<Scalars["BooleanType"]>;
};

/** Specifies how to filter by ID */
export type ItemIdFilter = {
  /** Search the record with the specified ID */
  eq: InputMaybe<Scalars["ItemId"]>;
  /** Search records with the specified IDs */
  in: InputMaybe<Array<InputMaybe<Scalars["ItemId"]>>>;
  /** Exclude the record with the specified ID */
  neq: InputMaybe<Scalars["ItemId"]>;
  /** Search records that do not have the specified IDs */
  notIn: InputMaybe<Array<InputMaybe<Scalars["ItemId"]>>>;
};

export enum ItemStatus {
  Draft = "draft",
  Published = "published",
  Updated = "updated",
}

export enum MuxThumbnailFormatType {
  Gif = "gif",
  Jpg = "jpg",
  Png = "png",
}

/** Specifies how to filter by image orientation */
export type OrientationFilter = {
  /** Search uploads with the specified orientation */
  eq: InputMaybe<UploadOrientation>;
  /** Exclude uploads with the specified orientation */
  neq: InputMaybe<UploadOrientation>;
};

export type PageModelFilter = {
  OR: InputMaybe<Array<InputMaybe<PageModelFilter>>>;
  _createdAt: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt: InputMaybe<PublishedAtFilter>;
  _isValid: InputMaybe<BooleanFilter>;
  _publicationScheduledAt: InputMaybe<PublishedAtFilter>;
  _publishedAt: InputMaybe<PublishedAtFilter>;
  _status: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt: InputMaybe<PublishedAtFilter>;
  _updatedAt: InputMaybe<UpdatedAtFilter>;
  content: InputMaybe<TextFilter>;
  cover: InputMaybe<FileFilter>;
  createdAt: InputMaybe<CreatedAtFilter>;
  description: InputMaybe<StringFilter>;
  id: InputMaybe<ItemIdFilter>;
  showHeader: InputMaybe<BooleanFilter>;
  slug: InputMaybe<SlugFilter>;
  title: InputMaybe<StringFilter>;
  updatedAt: InputMaybe<UpdatedAtFilter>;
};

export enum PageModelOrderBy {
  CreatedAtAsc = "_createdAt_ASC",
  CreatedAtDesc = "_createdAt_DESC",
  FirstPublishedAtAsc = "_firstPublishedAt_ASC",
  FirstPublishedAtDesc = "_firstPublishedAt_DESC",
  IsValidAsc = "_isValid_ASC",
  IsValidDesc = "_isValid_DESC",
  PublicationScheduledAtAsc = "_publicationScheduledAt_ASC",
  PublicationScheduledAtDesc = "_publicationScheduledAt_DESC",
  PublishedAtAsc = "_publishedAt_ASC",
  PublishedAtDesc = "_publishedAt_DESC",
  StatusAsc = "_status_ASC",
  StatusDesc = "_status_DESC",
  UnpublishingScheduledAtAsc = "_unpublishingScheduledAt_ASC",
  UnpublishingScheduledAtDesc = "_unpublishingScheduledAt_DESC",
  UpdatedAtAsc = "_updatedAt_ASC",
  UpdatedAtDesc = "_updatedAt_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  DescriptionAsc = "description_ASC",
  DescriptionDesc = "description_DESC",
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  ShowHeaderAsc = "showHeader_ASC",
  ShowHeaderDesc = "showHeader_DESC",
  TitleAsc = "title_ASC",
  TitleDesc = "title_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC",
}

/** Record of type Page (page) */
export type PageRecord = RecordInterface & {
  _createdAt: Scalars["DateTime"];
  _firstPublishedAt: Maybe<Scalars["DateTime"]>;
  _isValid: Scalars["BooleanType"];
  _modelApiKey: Scalars["String"];
  _publicationScheduledAt: Maybe<Scalars["DateTime"]>;
  _publishedAt: Maybe<Scalars["DateTime"]>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars["DateTime"]>;
  _updatedAt: Scalars["DateTime"];
  content: Maybe<Scalars["String"]>;
  cover: Maybe<FileField>;
  createdAt: Scalars["DateTime"];
  description: Scalars["String"];
  id: Scalars["ItemId"];
  showHeader: Maybe<Scalars["BooleanType"]>;
  slug: Scalars["String"];
  title: Scalars["String"];
  updatedAt: Scalars["DateTime"];
};

/** Record of type Page (page) */
export type PageRecord_SeoMetaTagsArgs = {
  locale: InputMaybe<SiteLocale>;
};

/** Record of type Page (page) */
export type PageRecordContentArgs = {
  markdown: InputMaybe<Scalars["Boolean"]>;
};

/** Specifies how to filter by position (sorted and tree-like collections) */
export type PositionFilter = {
  /** Search for records with an exact match */
  eq: InputMaybe<Scalars["IntType"]>;
  /** Filter records with a value that's strictly greater than the one specified */
  gt: InputMaybe<Scalars["IntType"]>;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte: InputMaybe<Scalars["IntType"]>;
  /** Filter records with a value that's less than the one specified */
  lt: InputMaybe<Scalars["IntType"]>;
  /** Filter records with a value that's less or equal than the one specified */
  lte: InputMaybe<Scalars["IntType"]>;
  /** Exclude records with an exact match */
  neq: InputMaybe<Scalars["IntType"]>;
};

export type PostModelFilter = {
  OR: InputMaybe<Array<InputMaybe<PostModelFilter>>>;
  _createdAt: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt: InputMaybe<PublishedAtFilter>;
  _isValid: InputMaybe<BooleanFilter>;
  _publicationScheduledAt: InputMaybe<PublishedAtFilter>;
  _publishedAt: InputMaybe<PublishedAtFilter>;
  _status: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt: InputMaybe<PublishedAtFilter>;
  _updatedAt: InputMaybe<UpdatedAtFilter>;
  content: InputMaybe<TextFilter>;
  cover: InputMaybe<FileFilter>;
  createdAt: InputMaybe<CreatedAtFilter>;
  description: InputMaybe<StringFilter>;
  id: InputMaybe<ItemIdFilter>;
  redirect: InputMaybe<StringFilter>;
  slug: InputMaybe<SlugFilter>;
  title: InputMaybe<StringFilter>;
  updatedAt: InputMaybe<UpdatedAtFilter>;
};

export enum PostModelOrderBy {
  CreatedAtAsc = "_createdAt_ASC",
  CreatedAtDesc = "_createdAt_DESC",
  FirstPublishedAtAsc = "_firstPublishedAt_ASC",
  FirstPublishedAtDesc = "_firstPublishedAt_DESC",
  IsValidAsc = "_isValid_ASC",
  IsValidDesc = "_isValid_DESC",
  PublicationScheduledAtAsc = "_publicationScheduledAt_ASC",
  PublicationScheduledAtDesc = "_publicationScheduledAt_DESC",
  PublishedAtAsc = "_publishedAt_ASC",
  PublishedAtDesc = "_publishedAt_DESC",
  StatusAsc = "_status_ASC",
  StatusDesc = "_status_DESC",
  UnpublishingScheduledAtAsc = "_unpublishingScheduledAt_ASC",
  UnpublishingScheduledAtDesc = "_unpublishingScheduledAt_DESC",
  UpdatedAtAsc = "_updatedAt_ASC",
  UpdatedAtDesc = "_updatedAt_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  DescriptionAsc = "description_ASC",
  DescriptionDesc = "description_DESC",
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  RedirectAsc = "redirect_ASC",
  RedirectDesc = "redirect_DESC",
  TitleAsc = "title_ASC",
  TitleDesc = "title_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC",
}

/** Record of type Post (post) */
export type PostRecord = RecordInterface & {
  _createdAt: Scalars["DateTime"];
  _firstPublishedAt: Maybe<Scalars["DateTime"]>;
  _isValid: Scalars["BooleanType"];
  _modelApiKey: Scalars["String"];
  _publicationScheduledAt: Maybe<Scalars["DateTime"]>;
  _publishedAt: Maybe<Scalars["DateTime"]>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars["DateTime"]>;
  _updatedAt: Scalars["DateTime"];
  content: Maybe<Scalars["String"]>;
  cover: Maybe<FileField>;
  createdAt: Scalars["DateTime"];
  description: Scalars["String"];
  id: Scalars["ItemId"];
  redirect: Maybe<Scalars["String"]>;
  slug: Scalars["String"];
  title: Scalars["String"];
  updatedAt: Scalars["DateTime"];
};

/** Record of type Post (post) */
export type PostRecord_SeoMetaTagsArgs = {
  locale: InputMaybe<SiteLocale>;
};

/** Record of type Post (post) */
export type PostRecordContentArgs = {
  markdown: InputMaybe<Scalars["Boolean"]>;
};

export type ProjectModelFilter = {
  OR: InputMaybe<Array<InputMaybe<ProjectModelFilter>>>;
  _createdAt: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt: InputMaybe<PublishedAtFilter>;
  _isValid: InputMaybe<BooleanFilter>;
  _publicationScheduledAt: InputMaybe<PublishedAtFilter>;
  _publishedAt: InputMaybe<PublishedAtFilter>;
  _status: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt: InputMaybe<PublishedAtFilter>;
  _updatedAt: InputMaybe<UpdatedAtFilter>;
  createdAt: InputMaybe<CreatedAtFilter>;
  description: InputMaybe<StringFilter>;
  featured: InputMaybe<BooleanFilter>;
  id: InputMaybe<ItemIdFilter>;
  image: InputMaybe<FileFilter>;
  position: InputMaybe<PositionFilter>;
  title: InputMaybe<StringFilter>;
  updatedAt: InputMaybe<UpdatedAtFilter>;
  url: InputMaybe<StringFilter>;
};

export enum ProjectModelOrderBy {
  CreatedAtAsc = "_createdAt_ASC",
  CreatedAtDesc = "_createdAt_DESC",
  FirstPublishedAtAsc = "_firstPublishedAt_ASC",
  FirstPublishedAtDesc = "_firstPublishedAt_DESC",
  IsValidAsc = "_isValid_ASC",
  IsValidDesc = "_isValid_DESC",
  PublicationScheduledAtAsc = "_publicationScheduledAt_ASC",
  PublicationScheduledAtDesc = "_publicationScheduledAt_DESC",
  PublishedAtAsc = "_publishedAt_ASC",
  PublishedAtDesc = "_publishedAt_DESC",
  StatusAsc = "_status_ASC",
  StatusDesc = "_status_DESC",
  UnpublishingScheduledAtAsc = "_unpublishingScheduledAt_ASC",
  UnpublishingScheduledAtDesc = "_unpublishingScheduledAt_DESC",
  UpdatedAtAsc = "_updatedAt_ASC",
  UpdatedAtDesc = "_updatedAt_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  DescriptionAsc = "description_ASC",
  DescriptionDesc = "description_DESC",
  FeaturedAsc = "featured_ASC",
  FeaturedDesc = "featured_DESC",
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  PositionAsc = "position_ASC",
  PositionDesc = "position_DESC",
  TitleAsc = "title_ASC",
  TitleDesc = "title_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC",
  UrlAsc = "url_ASC",
  UrlDesc = "url_DESC",
}

/** Record of type Project (project) */
export type ProjectRecord = RecordInterface & {
  _createdAt: Scalars["DateTime"];
  _firstPublishedAt: Maybe<Scalars["DateTime"]>;
  _isValid: Scalars["BooleanType"];
  _modelApiKey: Scalars["String"];
  _publicationScheduledAt: Maybe<Scalars["DateTime"]>;
  _publishedAt: Maybe<Scalars["DateTime"]>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars["DateTime"]>;
  _updatedAt: Scalars["DateTime"];
  createdAt: Scalars["DateTime"];
  description: Scalars["String"];
  featured: Maybe<Scalars["BooleanType"]>;
  id: Scalars["ItemId"];
  image: FileField;
  position: Maybe<Scalars["IntType"]>;
  title: Scalars["String"];
  updatedAt: Scalars["DateTime"];
  url: Maybe<Scalars["String"]>;
};

/** Record of type Project (project) */
export type ProjectRecord_SeoMetaTagsArgs = {
  locale: InputMaybe<SiteLocale>;
};

/** Specifies how to filter by publication datetime */
export type PublishedAtFilter = {
  /** Filter records with a value that's within the specified minute range. Seconds and milliseconds are truncated from the argument. */
  eq: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Filter records with a value that's strictly greater than the one specified. Seconds and milliseconds are truncated from the argument. */
  gt: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's greater than or equal to than the one specified. Seconds and milliseconds are truncated from the argument. */
  gte: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's less than the one specified. Seconds and milliseconds are truncated from the argument. */
  lt: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's less or equal than the one specified. Seconds and milliseconds are truncated from the argument. */
  lte: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's outside the specified minute range. Seconds and milliseconds are truncated from the argument. */
  neq: InputMaybe<Scalars["DateTime"]>;
};

/** The query root for this schema */
export type Query = {
  /** Returns meta information regarding a record collection */
  _allPagesMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allPostsMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allProjectsMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allTalksMeta: CollectionMetadata;
  /** Returns meta information regarding an assets collection */
  _allUploadsMeta: Maybe<CollectionMetadata>;
  /** Returns the single instance record */
  _site: Site;
  /** Returns a collection of records */
  allPages: Array<PageRecord>;
  /** Returns a collection of records */
  allPosts: Array<PostRecord>;
  /** Returns a collection of records */
  allProjects: Array<ProjectRecord>;
  /** Returns a collection of records */
  allTalks: Array<TalkRecord>;
  /** Returns a collection of assets */
  allUploads: Array<FileField>;
  /** Returns the single instance record */
  homePage: Maybe<HomePageRecord>;
  /** Returns a specific record */
  page: Maybe<PageRecord>;
  /** Returns a specific record */
  post: Maybe<PostRecord>;
  /** Returns a specific record */
  project: Maybe<ProjectRecord>;
  /** Returns the single instance record */
  route: Maybe<RouteRecord>;
  /** Returns a specific record */
  talk: Maybe<TalkRecord>;
  /** Returns a specific asset */
  upload: Maybe<FileField>;
};

/** The query root for this schema */
export type Query_AllPagesMetaArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<PageModelFilter>;
  locale: InputMaybe<SiteLocale>;
};

/** The query root for this schema */
export type Query_AllPostsMetaArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<PostModelFilter>;
  locale: InputMaybe<SiteLocale>;
};

/** The query root for this schema */
export type Query_AllProjectsMetaArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<ProjectModelFilter>;
  locale: InputMaybe<SiteLocale>;
};

/** The query root for this schema */
export type Query_AllTalksMetaArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<TalkModelFilter>;
  locale: InputMaybe<SiteLocale>;
};

/** The query root for this schema */
export type Query_AllUploadsMetaArgs = {
  filter: InputMaybe<UploadFilter>;
  locale: InputMaybe<SiteLocale>;
};

/** The query root for this schema */
export type Query_SiteArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

/** The query root for this schema */
export type QueryAllPagesArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<PageModelFilter>;
  first?: InputMaybe<Scalars["IntType"]>;
  locale: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<PageModelOrderBy>>>;
  skip: InputMaybe<Scalars["IntType"]>;
};

/** The query root for this schema */
export type QueryAllPostsArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<PostModelFilter>;
  first?: InputMaybe<Scalars["IntType"]>;
  locale: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<PostModelOrderBy>>>;
  skip: InputMaybe<Scalars["IntType"]>;
};

/** The query root for this schema */
export type QueryAllProjectsArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<ProjectModelFilter>;
  first?: InputMaybe<Scalars["IntType"]>;
  locale: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<ProjectModelOrderBy>>>;
  skip: InputMaybe<Scalars["IntType"]>;
};

/** The query root for this schema */
export type QueryAllTalksArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<TalkModelFilter>;
  first?: InputMaybe<Scalars["IntType"]>;
  locale: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<TalkModelOrderBy>>>;
  skip: InputMaybe<Scalars["IntType"]>;
};

/** The query root for this schema */
export type QueryAllUploadsArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<UploadFilter>;
  first?: InputMaybe<Scalars["IntType"]>;
  locale: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<UploadOrderBy>>>;
  skip: InputMaybe<Scalars["IntType"]>;
};

/** The query root for this schema */
export type QueryHomePageArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

/** The query root for this schema */
export type QueryPageArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<PageModelFilter>;
  locale: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<PageModelOrderBy>>>;
};

/** The query root for this schema */
export type QueryPostArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<PostModelFilter>;
  locale: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<PostModelOrderBy>>>;
};

/** The query root for this schema */
export type QueryProjectArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<ProjectModelFilter>;
  locale: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<ProjectModelOrderBy>>>;
};

/** The query root for this schema */
export type QueryRouteArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

/** The query root for this schema */
export type QueryTalkArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<TalkModelFilter>;
  locale: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<TalkModelOrderBy>>>;
};

/** The query root for this schema */
export type QueryUploadArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  filter: InputMaybe<UploadFilter>;
  locale: InputMaybe<SiteLocale>;
  orderBy?: InputMaybe<Array<InputMaybe<UploadOrderBy>>>;
};

export type RecordInterface = {
  _createdAt: Scalars["DateTime"];
  _firstPublishedAt: Maybe<Scalars["DateTime"]>;
  _isValid: Scalars["BooleanType"];
  _modelApiKey: Scalars["String"];
  _publicationScheduledAt: Maybe<Scalars["DateTime"]>;
  _publishedAt: Maybe<Scalars["DateTime"]>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars["DateTime"]>;
  _updatedAt: Scalars["DateTime"];
  id: Scalars["ItemId"];
};

export type RecordInterface_SeoMetaTagsArgs = {
  locale: InputMaybe<SiteLocale>;
};

/** Specifies how to filter by upload type */
export type ResolutionFilter = {
  /** Search uploads with the specified resolution */
  eq: InputMaybe<ResolutionType>;
  /** Search uploads with the specified resolutions */
  in: InputMaybe<Array<InputMaybe<ResolutionType>>>;
  /** Exclude uploads with the specified resolution */
  neq: InputMaybe<ResolutionType>;
  /** Search uploads without the specified resolutions */
  notIn: InputMaybe<Array<InputMaybe<ResolutionType>>>;
};

export enum ResolutionType {
  Icon = "icon",
  Large = "large",
  Medium = "medium",
  Small = "small",
}

export type ResponsiveImage = {
  alt: Maybe<Scalars["String"]>;
  aspectRatio: Scalars["FloatType"];
  base64: Maybe<Scalars["String"]>;
  bgColor: Maybe<Scalars["String"]>;
  height: Scalars["IntType"];
  sizes: Scalars["String"];
  src: Scalars["String"];
  srcSet: Scalars["String"];
  title: Maybe<Scalars["String"]>;
  webpSrcSet: Scalars["String"];
  width: Scalars["IntType"];
};

/** Record of type Route (route) */
export type RouteRecord = RecordInterface & {
  _createdAt: Scalars["DateTime"];
  _firstPublishedAt: Maybe<Scalars["DateTime"]>;
  _isValid: Scalars["BooleanType"];
  _modelApiKey: Scalars["String"];
  _publicationScheduledAt: Maybe<Scalars["DateTime"]>;
  _publishedAt: Maybe<Scalars["DateTime"]>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars["DateTime"]>;
  _updatedAt: Scalars["DateTime"];
  createdAt: Scalars["DateTime"];
  id: Scalars["ItemId"];
  redirects: Maybe<Scalars["JsonField"]>;
  rewrites: Maybe<Scalars["JsonField"]>;
  updatedAt: Scalars["DateTime"];
};

/** Record of type Route (route) */
export type RouteRecord_SeoMetaTagsArgs = {
  locale: InputMaybe<SiteLocale>;
};

export type SeoField = {
  description: Maybe<Scalars["String"]>;
  image: Maybe<FileField>;
  title: Maybe<Scalars["String"]>;
  twitterCard: Maybe<Scalars["String"]>;
};

export type Site = {
  favicon: Maybe<FileField>;
  faviconMetaTags: Array<Tag>;
  globalSeo: Maybe<GlobalSeoField>;
  locales: Array<SiteLocale>;
};

export type SiteFaviconMetaTagsArgs = {
  variants?: InputMaybe<Array<InputMaybe<FaviconType>>>;
};

export type SiteGlobalSeoArgs = {
  fallbackLocales: InputMaybe<Array<SiteLocale>>;
  locale: InputMaybe<SiteLocale>;
};

export enum SiteLocale {
  En = "en",
}

/** Specifies how to filter Slug fields */
export type SlugFilter = {
  /** Search for records with an exact match */
  eq: InputMaybe<Scalars["String"]>;
  /** Filter records that have one of the specified slugs */
  in: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Exclude records with an exact match */
  neq: InputMaybe<Scalars["String"]>;
  /** Filter records that do have one of the specified slugs */
  notIn: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** Specifies how to filter by status */
export type StatusFilter = {
  /** Search the record with the specified status */
  eq: InputMaybe<ItemStatus>;
  /** Search records with the specified statuses */
  in: InputMaybe<Array<InputMaybe<ItemStatus>>>;
  /** Exclude the record with the specified status */
  neq: InputMaybe<ItemStatus>;
  /** Search records without the specified statuses */
  notIn: InputMaybe<Array<InputMaybe<ItemStatus>>>;
};

/** Specifies how to filter Single-line string fields */
export type StringFilter = {
  /** Search for records with an exact match */
  eq: InputMaybe<Scalars["String"]>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Filter records that equal one of the specified values */
  in: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Filter records with the specified field set as blank (null or empty string) */
  isBlank: InputMaybe<Scalars["BooleanType"]>;
  /** Filter records based on a regular expression */
  matches: InputMaybe<StringMatchesFilter>;
  /** Exclude records with an exact match */
  neq: InputMaybe<Scalars["String"]>;
  /** Filter records that do not equal one of the specified values */
  notIn: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Exclude records based on a regular expression */
  notMatches: InputMaybe<StringMatchesFilter>;
};

export type StringMatchesFilter = {
  caseSensitive: InputMaybe<Scalars["BooleanType"]>;
  pattern: Scalars["String"];
  regexp: InputMaybe<Scalars["BooleanType"]>;
};

export type Tag = {
  attributes: Maybe<Scalars["MetaTagAttributes"]>;
  content: Maybe<Scalars["String"]>;
  tag: Scalars["String"];
};

export type TalkModelFilter = {
  OR: InputMaybe<Array<InputMaybe<TalkModelFilter>>>;
  _createdAt: InputMaybe<CreatedAtFilter>;
  _firstPublishedAt: InputMaybe<PublishedAtFilter>;
  _isValid: InputMaybe<BooleanFilter>;
  _publicationScheduledAt: InputMaybe<PublishedAtFilter>;
  _publishedAt: InputMaybe<PublishedAtFilter>;
  _status: InputMaybe<StatusFilter>;
  _unpublishingScheduledAt: InputMaybe<PublishedAtFilter>;
  _updatedAt: InputMaybe<UpdatedAtFilter>;
  createdAt: InputMaybe<CreatedAtFilter>;
  date: InputMaybe<DateFilter>;
  description: InputMaybe<StringFilter>;
  id: InputMaybe<ItemIdFilter>;
  title: InputMaybe<StringFilter>;
  updatedAt: InputMaybe<UpdatedAtFilter>;
  url: InputMaybe<StringFilter>;
};

export enum TalkModelOrderBy {
  CreatedAtAsc = "_createdAt_ASC",
  CreatedAtDesc = "_createdAt_DESC",
  FirstPublishedAtAsc = "_firstPublishedAt_ASC",
  FirstPublishedAtDesc = "_firstPublishedAt_DESC",
  IsValidAsc = "_isValid_ASC",
  IsValidDesc = "_isValid_DESC",
  PublicationScheduledAtAsc = "_publicationScheduledAt_ASC",
  PublicationScheduledAtDesc = "_publicationScheduledAt_DESC",
  PublishedAtAsc = "_publishedAt_ASC",
  PublishedAtDesc = "_publishedAt_DESC",
  StatusAsc = "_status_ASC",
  StatusDesc = "_status_DESC",
  UnpublishingScheduledAtAsc = "_unpublishingScheduledAt_ASC",
  UnpublishingScheduledAtDesc = "_unpublishingScheduledAt_DESC",
  UpdatedAtAsc = "_updatedAt_ASC",
  UpdatedAtDesc = "_updatedAt_DESC",
  CreatedAtAsc = "createdAt_ASC",
  CreatedAtDesc = "createdAt_DESC",
  DateAsc = "date_ASC",
  DateDesc = "date_DESC",
  DescriptionAsc = "description_ASC",
  DescriptionDesc = "description_DESC",
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  TitleAsc = "title_ASC",
  TitleDesc = "title_DESC",
  UpdatedAtAsc = "updatedAt_ASC",
  UpdatedAtDesc = "updatedAt_DESC",
  UrlAsc = "url_ASC",
  UrlDesc = "url_DESC",
}

/** Record of type Talk (talk) */
export type TalkRecord = RecordInterface & {
  _createdAt: Scalars["DateTime"];
  _firstPublishedAt: Maybe<Scalars["DateTime"]>;
  _isValid: Scalars["BooleanType"];
  _modelApiKey: Scalars["String"];
  _publicationScheduledAt: Maybe<Scalars["DateTime"]>;
  _publishedAt: Maybe<Scalars["DateTime"]>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars["DateTime"]>;
  _updatedAt: Scalars["DateTime"];
  createdAt: Scalars["DateTime"];
  date: Scalars["Date"];
  description: Scalars["String"];
  id: Scalars["ItemId"];
  title: Scalars["String"];
  updatedAt: Scalars["DateTime"];
  url: Scalars["String"];
};

/** Record of type Talk (talk) */
export type TalkRecord_SeoMetaTagsArgs = {
  locale: InputMaybe<SiteLocale>;
};

/** Specifies how to filter text fields */
export type TextFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Filter records with the specified field set as blank (null or empty string) */
  isBlank: InputMaybe<Scalars["BooleanType"]>;
  /** Filter records based on a regular expression */
  matches: InputMaybe<StringMatchesFilter>;
  /** Exclude records based on a regular expression */
  notMatches: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by upload type */
export type TypeFilter = {
  /** Search uploads with the specified type */
  eq: InputMaybe<UploadType>;
  /** Search uploads with the specified types */
  in: InputMaybe<Array<InputMaybe<UploadType>>>;
  /** Exclude uploads with the specified type */
  neq: InputMaybe<UploadType>;
  /** Search uploads without the specified types */
  notIn: InputMaybe<Array<InputMaybe<UploadType>>>;
};

/** Specifies how to filter by update datetime */
export type UpdatedAtFilter = {
  /** Filter records with a value that's within the specified minute range. Seconds and milliseconds are truncated from the argument. */
  eq: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Filter records with a value that's strictly greater than the one specified. Seconds and milliseconds are truncated from the argument. */
  gt: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's greater than or equal to than the one specified. Seconds and milliseconds are truncated from the argument. */
  gte: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's less than the one specified. Seconds and milliseconds are truncated from the argument. */
  lt: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's less or equal than the one specified. Seconds and milliseconds are truncated from the argument. */
  lte: InputMaybe<Scalars["DateTime"]>;
  /** Filter records with a value that's outside the specified minute range. Seconds and milliseconds are truncated from the argument. */
  neq: InputMaybe<Scalars["DateTime"]>;
};

/** Specifies how to filter by default alt */
export type UploadAltFilter = {
  /** Search the uploads with the specified alt */
  eq: InputMaybe<Scalars["String"]>;
  /** Filter uploads with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Search uploads with the specified values as default alt */
  in: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Filter uploads based on a regular expression */
  matches: InputMaybe<StringMatchesFilter>;
  /** Exclude the uploads with the specified alt */
  neq: InputMaybe<Scalars["String"]>;
  /** Search uploads that do not have the specified values as default alt */
  notIn: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Exclude uploads based on a regular expression */
  notMatches: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by auhtor */
export type UploadAuthorFilter = {
  /** Filter uploads with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Filter uploads based on a regular expression */
  matches: InputMaybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by basename */
export type UploadBasenameFilter = {
  /** Filter uploads based on a regular expression */
  matches: InputMaybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by colors */
export type UploadColorsFilter = {
  /** Filter uploads that have all of the specified colors */
  allIn: InputMaybe<Array<InputMaybe<ColorBucketType>>>;
  /** Filter uploads that have at least one of the specified colors */
  anyIn: InputMaybe<Array<InputMaybe<ColorBucketType>>>;
  /** Filter uploads that have the specified colors */
  contains: InputMaybe<ColorBucketType>;
  /** Search for uploads with an exact match */
  eq: InputMaybe<Array<InputMaybe<ColorBucketType>>>;
  /** Filter uploads that do not have any of the specified colors */
  notIn: InputMaybe<Array<InputMaybe<ColorBucketType>>>;
};

/** Specifies how to filter by copyright */
export type UploadCopyrightFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Filter uploads based on a regular expression */
  matches: InputMaybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by creation datetime */
export type UploadCreatedAtFilter = {
  /** Search for uploads with an exact match */
  eq: InputMaybe<Scalars["DateTime"]>;
  /** Filter uploads with a value that's strictly greater than the one specified */
  gt: InputMaybe<Scalars["DateTime"]>;
  /** Filter uploads with a value that's greater than or equal to the one specified */
  gte: InputMaybe<Scalars["DateTime"]>;
  /** Filter uploads with a value that's less than the one specified */
  lt: InputMaybe<Scalars["DateTime"]>;
  /** Filter uploads with a value that's less or equal than the one specified */
  lte: InputMaybe<Scalars["DateTime"]>;
  /** Exclude uploads with an exact match */
  neq: InputMaybe<Scalars["DateTime"]>;
};

/** Specifies how to filter by filename */
export type UploadFilenameFilter = {
  /** Filter uploads based on a regular expression */
  matches: InputMaybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: InputMaybe<StringMatchesFilter>;
};

export type UploadFilter = {
  OR: InputMaybe<Array<InputMaybe<UploadFilter>>>;
  _createdAt: InputMaybe<UploadCreatedAtFilter>;
  _updatedAt: InputMaybe<UploadUpdatedAtFilter>;
  alt: InputMaybe<UploadAltFilter>;
  author: InputMaybe<UploadAuthorFilter>;
  basename: InputMaybe<UploadBasenameFilter>;
  colors: InputMaybe<UploadColorsFilter>;
  copyright: InputMaybe<UploadCopyrightFilter>;
  filename: InputMaybe<UploadFilenameFilter>;
  format: InputMaybe<UploadFormatFilter>;
  height: InputMaybe<UploadHeightFilter>;
  id: InputMaybe<UploadIdFilter>;
  inUse: InputMaybe<InUseFilter>;
  md5: InputMaybe<UploadMd5Filter>;
  mimeType: InputMaybe<UploadMimeTypeFilter>;
  notes: InputMaybe<UploadNotesFilter>;
  orientation: InputMaybe<OrientationFilter>;
  resolution: InputMaybe<ResolutionFilter>;
  size: InputMaybe<UploadSizeFilter>;
  smartTags: InputMaybe<UploadTagsFilter>;
  tags: InputMaybe<UploadTagsFilter>;
  title: InputMaybe<UploadTitleFilter>;
  type: InputMaybe<TypeFilter>;
  width: InputMaybe<UploadWidthFilter>;
};

/** Specifies how to filter by format */
export type UploadFormatFilter = {
  /** Search the asset with the specified format */
  eq: InputMaybe<Scalars["String"]>;
  /** Search assets with the specified formats */
  in: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Exclude the asset with the specified format */
  neq: InputMaybe<Scalars["String"]>;
  /** Search assets that do not have the specified formats */
  notIn: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** Specifies how to filter by height */
export type UploadHeightFilter = {
  /** Search assets with the specified height */
  eq: InputMaybe<Scalars["IntType"]>;
  /** Search all assets larger than the specified height */
  gt: InputMaybe<Scalars["IntType"]>;
  /** Search all assets larger or equal to the specified height */
  gte: InputMaybe<Scalars["IntType"]>;
  /** Search all assets smaller than the specified height */
  lt: InputMaybe<Scalars["IntType"]>;
  /** Search all assets larger or equal to the specified height */
  lte: InputMaybe<Scalars["IntType"]>;
  /** Search assets that do not have the specified height */
  neq: InputMaybe<Scalars["IntType"]>;
};

/** Specifies how to filter by ID */
export type UploadIdFilter = {
  /** Search the asset with the specified ID */
  eq: InputMaybe<Scalars["UploadId"]>;
  /** Search assets with the specified IDs */
  in: InputMaybe<Array<InputMaybe<Scalars["UploadId"]>>>;
  /** Exclude the asset with the specified ID */
  neq: InputMaybe<Scalars["UploadId"]>;
  /** Search assets that do not have the specified IDs */
  notIn: InputMaybe<Array<InputMaybe<Scalars["UploadId"]>>>;
};

/** Specifies how to filter by MD5 */
export type UploadMd5Filter = {
  /** Search the asset with the specified MD5 */
  eq: InputMaybe<Scalars["String"]>;
  /** Search assets with the specified MD5s */
  in: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Exclude the asset with the specified MD5 */
  neq: InputMaybe<Scalars["String"]>;
  /** Search assets that do not have the specified MD5s */
  notIn: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
};

/** Specifies how to filter by mime type */
export type UploadMimeTypeFilter = {
  /** Search the asset with the specified mime type */
  eq: InputMaybe<Scalars["String"]>;
  /** Search assets with the specified mime types */
  in: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Filter uploads based on a regular expression */
  matches: InputMaybe<StringMatchesFilter>;
  /** Exclude the asset with the specified mime type */
  neq: InputMaybe<Scalars["String"]>;
  /** Search assets that do not have the specified mime types */
  notIn: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Exclude uploads based on a regular expression */
  notMatches: InputMaybe<StringMatchesFilter>;
};

/** Specifies how to filter by notes */
export type UploadNotesFilter = {
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Filter uploads based on a regular expression */
  matches: InputMaybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: InputMaybe<StringMatchesFilter>;
};

export enum UploadOrderBy {
  CreatedAtAsc = "_createdAt_ASC",
  CreatedAtDesc = "_createdAt_DESC",
  UpdatedAtAsc = "_updatedAt_ASC",
  UpdatedAtDesc = "_updatedAt_DESC",
  BasenameAsc = "basename_ASC",
  BasenameDesc = "basename_DESC",
  FilenameAsc = "filename_ASC",
  FilenameDesc = "filename_DESC",
  FormatAsc = "format_ASC",
  FormatDesc = "format_DESC",
  IdAsc = "id_ASC",
  IdDesc = "id_DESC",
  MimeTypeAsc = "mimeType_ASC",
  MimeTypeDesc = "mimeType_DESC",
  ResolutionAsc = "resolution_ASC",
  ResolutionDesc = "resolution_DESC",
  SizeAsc = "size_ASC",
  SizeDesc = "size_DESC",
}

export enum UploadOrientation {
  Landscape = "landscape",
  Portrait = "portrait",
  Square = "square",
}

/** Specifies how to filter by size */
export type UploadSizeFilter = {
  /** Search assets with the specified size (in bytes) */
  eq: InputMaybe<Scalars["IntType"]>;
  /** Search all assets larger than the specified size (in bytes) */
  gt: InputMaybe<Scalars["IntType"]>;
  /** Search all assets larger or equal to the specified size (in bytes) */
  gte: InputMaybe<Scalars["IntType"]>;
  /** Search all assets smaller than the specified size (in bytes) */
  lt: InputMaybe<Scalars["IntType"]>;
  /** Search all assets larger or equal to the specified size (in bytes) */
  lte: InputMaybe<Scalars["IntType"]>;
  /** Search assets that do not have the specified size (in bytes) */
  neq: InputMaybe<Scalars["IntType"]>;
};

/** Specifies how to filter by tags */
export type UploadTagsFilter = {
  /** Filter uploads linked to all of the specified tags */
  allIn: InputMaybe<Array<Scalars["String"]>>;
  /** Filter uploads linked to at least one of the specified tags */
  anyIn: InputMaybe<Array<Scalars["String"]>>;
  /** Filter uploads linked to the specified tag */
  contains: InputMaybe<Scalars["String"]>;
  /** Search for uploads with an exact match */
  eq: InputMaybe<Array<Scalars["String"]>>;
  /** Filter uploads not linked to any of the specified tags */
  notIn: InputMaybe<Array<Scalars["String"]>>;
};

/** Specifies how to filter by default title */
export type UploadTitleFilter = {
  /** Search the asset with the specified title */
  eq: InputMaybe<Scalars["String"]>;
  /** Filter assets with the specified field defined (i.e. with any value) or not */
  exists: InputMaybe<Scalars["BooleanType"]>;
  /** Search assets with the specified as default title */
  in: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Filter uploads based on a regular expression */
  matches: InputMaybe<StringMatchesFilter>;
  /** Exclude the asset with the specified title */
  neq: InputMaybe<Scalars["String"]>;
  /** Search assets that do not have the specified as default title */
  notIn: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  /** Exclude uploads based on a regular expression */
  notMatches: InputMaybe<StringMatchesFilter>;
};

export enum UploadType {
  Archive = "archive",
  Audio = "audio",
  Image = "image",
  Pdfdocument = "pdfdocument",
  Presentation = "presentation",
  Richtext = "richtext",
  Spreadsheet = "spreadsheet",
  Video = "video",
}

/** Specifies how to filter by update datetime */
export type UploadUpdatedAtFilter = {
  /** Search for uploads with an exact match */
  eq: InputMaybe<Scalars["DateTime"]>;
  /** Filter uploads with a value that's strictly greater than the one specified */
  gt: InputMaybe<Scalars["DateTime"]>;
  /** Filter uploads with a value that's greater than or equal to the one specified */
  gte: InputMaybe<Scalars["DateTime"]>;
  /** Filter uploads with a value that's less than the one specified */
  lt: InputMaybe<Scalars["DateTime"]>;
  /** Filter uploads with a value that's less or equal than the one specified */
  lte: InputMaybe<Scalars["DateTime"]>;
  /** Exclude uploads with an exact match */
  neq: InputMaybe<Scalars["DateTime"]>;
};

export type UploadVideoField = {
  duration: Maybe<Scalars["Int"]>;
  framerate: Maybe<Scalars["Int"]>;
  mp4Url: Maybe<Scalars["String"]>;
  muxAssetId: Scalars["String"];
  muxPlaybackId: Scalars["String"];
  streamingUrl: Scalars["String"];
  thumbnailUrl: Scalars["String"];
};

export type UploadVideoFieldMp4UrlArgs = {
  exactRes: InputMaybe<VideoMp4Res>;
  res: InputMaybe<VideoMp4Res>;
};

export type UploadVideoFieldThumbnailUrlArgs = {
  format?: InputMaybe<MuxThumbnailFormatType>;
};

/** Specifies how to filter by width */
export type UploadWidthFilter = {
  /** Search assets with the specified width */
  eq: InputMaybe<Scalars["IntType"]>;
  /** Search all assets larger than the specified width */
  gt: InputMaybe<Scalars["IntType"]>;
  /** Search all assets larger or equal to the specified width */
  gte: InputMaybe<Scalars["IntType"]>;
  /** Search all assets smaller than the specified width */
  lt: InputMaybe<Scalars["IntType"]>;
  /** Search all assets larger or equal to the specified width */
  lte: InputMaybe<Scalars["IntType"]>;
  /** Search assets that do not have the specified width */
  neq: InputMaybe<Scalars["IntType"]>;
};

export enum VideoMp4Res {
  High = "high",
  Low = "low",
  Medium = "medium",
}

export type FocalPoint = {
  x: Scalars["FloatType"];
  y: Scalars["FloatType"];
};

export type CustomPageFieldsFragment = {
  title: string;
  description: string;
  slug: string;
  content: string;
  showHeader: boolean;
  cover: { url: string };
};

export type PostFieldsFragment = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  slug: string;
  redirect: string;
  cover: { url: string };
};

export type PostFieldsWithContentFragment = {
  content: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  slug: string;
  redirect: string;
  cover: { url: string };
};

export type ProjectFieldsFragment = {
  id: string;
  title: string;
  description: string;
  url: string;
  image: { blurUpThumb: string; url: string };
};

export type TalkFieldsFragment = { id: string; title: string; description: string; date: string; url: string };

export type GetResumeUrlQueryVariables = Exact<{ [key: string]: never }>;

export type GetResumeUrlQuery = { upload: { url: string } };

export type GetCustomPageQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type GetCustomPageQuery = {
  page: {
    title: string;
    description: string;
    slug: string;
    content: string;
    showHeader: boolean;
    cover: { url: string };
  };
};

export type GetCustomPageSlugsQueryVariables = Exact<{ [key: string]: never }>;

export type GetCustomPageSlugsQuery = { allPages: Array<{ slug: string }> };

export type GetHomePageQueryVariables = Exact<{ [key: string]: never }>;

export type GetHomePageQuery = {
  homePage: { excerpt: string };
  allProjects: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    image: { blurUpThumb: string; url: string };
  }>;
  allTalks: Array<{ id: string; title: string; description: string; date: string; url: string }>;
  allPosts: Array<{
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    slug: string;
    redirect: string;
    cover: { url: string };
  }>;
};

export type GetBlogPostsQueryVariables = Exact<{ [key: string]: never }>;

export type GetBlogPostsQuery = {
  allPosts: Array<{
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    slug: string;
    redirect: string;
    cover: { url: string };
  }>;
};

export type GetBlogPostQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type GetBlogPostQuery = {
  post: {
    content: string;
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    slug: string;
    redirect: string;
    cover: { url: string };
  };
};

export type GetBlogPostSlugsQueryVariables = Exact<{ [key: string]: never }>;

export type GetBlogPostSlugsQuery = { allPosts: Array<{ slug: string }> };

export type GetSlugRedirectQueryVariables = Exact<{
  slug: Scalars["String"];
}>;

export type GetSlugRedirectQuery = { post: { redirect: string } };

export type GetProjectsQueryVariables = Exact<{ [key: string]: never }>;

export type GetProjectsQuery = {
  allProjects: Array<{
    id: string;
    title: string;
    description: string;
    url: string;
    image: { blurUpThumb: string; url: string };
  }>;
};

export type GetRedirectsQueryVariables = Exact<{ [key: string]: never }>;

export type GetRedirectsQuery = { route: { redirects: JsonValue } };

export type GetRewritesQueryVariables = Exact<{ [key: string]: never }>;

export type GetRewritesQuery = { route: { rewrites: JsonValue } };

export type GetRoutesQueryVariables = Exact<{ [key: string]: never }>;

export type GetRoutesQuery = { route: { redirects: JsonValue; rewrites: JsonValue } };

export type GetSeoDataQueryVariables = Exact<{ [key: string]: never }>;

export type GetSeoDataQuery = {
  _site: {
    favicon: { url: string };
    faviconMetaTags: Array<{ tag: string; attributes: Dictionary<string>; content: string }>;
  };
};

export type GetTalksQueryVariables = Exact<{ [key: string]: never }>;

export type GetTalksQuery = {
  allTalks: Array<{ id: string; title: string; description: string; date: string; url: string }>;
};

export const CustomPageFieldsFragmentDoc = /*#__PURE__*/ `
    fragment CustomPageFields on PageRecord {
  cover {
    url
  }
  title
  description
  slug
  content
  showHeader
}
    `;
export const PostFieldsFragmentDoc = /*#__PURE__*/ `
    fragment PostFields on PostRecord {
  id
  createdAt
  updatedAt
  cover {
    url
  }
  title
  description
  slug
  redirect
}
    `;
export const PostFieldsWithContentFragmentDoc = /*#__PURE__*/ `
    fragment PostFieldsWithContent on PostRecord {
  ...PostFields
  content
}
    `;
export const ProjectFieldsFragmentDoc = /*#__PURE__*/ `
    fragment ProjectFields on ProjectRecord {
  id
  title
  description
  url
  image {
    blurUpThumb
    url
  }
}
    `;
export const TalkFieldsFragmentDoc = /*#__PURE__*/ `
    fragment TalkFields on TalkRecord {
  id
  title
  description
  date
  url
}
    `;
export const GetResumeUrlDocument = /*#__PURE__*/ `
    query getResumeUrl {
  upload(filter: {filename: {matches: {pattern: "resume\\\\.pdf"}}}) {
    url
  }
}
    `;
export const useGetResumeUrlQuery = <TData = GetResumeUrlQuery, TError = unknown>(
  variables?: GetResumeUrlQueryVariables,
  options?: UseQueryOptions<GetResumeUrlQuery, TError, TData>,
) =>
  useQuery<GetResumeUrlQuery, TError, TData>(
    variables === undefined ? ["getResumeUrl"] : ["getResumeUrl", variables],
    fetcher<GetResumeUrlQuery, GetResumeUrlQueryVariables>(GetResumeUrlDocument, variables),
    options,
  );
useGetResumeUrlQuery.document = GetResumeUrlDocument;

useGetResumeUrlQuery.getKey = (variables?: GetResumeUrlQueryVariables) =>
  variables === undefined ? ["getResumeUrl"] : ["getResumeUrl", variables];
useGetResumeUrlQuery.fetcher = (variables?: GetResumeUrlQueryVariables) =>
  fetcher<GetResumeUrlQuery, GetResumeUrlQueryVariables>(GetResumeUrlDocument, variables);
export const GetCustomPageDocument = /*#__PURE__*/ `
    query getCustomPage($slug: String!) {
  page(filter: {slug: {eq: $slug}}) {
    ...CustomPageFields
  }
}
    ${CustomPageFieldsFragmentDoc}`;
export const useGetCustomPageQuery = <TData = GetCustomPageQuery, TError = unknown>(
  variables: GetCustomPageQueryVariables,
  options?: UseQueryOptions<GetCustomPageQuery, TError, TData>,
) =>
  useQuery<GetCustomPageQuery, TError, TData>(
    ["getCustomPage", variables],
    fetcher<GetCustomPageQuery, GetCustomPageQueryVariables>(GetCustomPageDocument, variables),
    options,
  );
useGetCustomPageQuery.document = GetCustomPageDocument;

useGetCustomPageQuery.getKey = (variables: GetCustomPageQueryVariables) => ["getCustomPage", variables];
useGetCustomPageQuery.fetcher = (variables: GetCustomPageQueryVariables) =>
  fetcher<GetCustomPageQuery, GetCustomPageQueryVariables>(GetCustomPageDocument, variables);
export const GetCustomPageSlugsDocument = /*#__PURE__*/ `
    query getCustomPageSlugs {
  allPages {
    slug
  }
}
    `;
export const useGetCustomPageSlugsQuery = <TData = GetCustomPageSlugsQuery, TError = unknown>(
  variables?: GetCustomPageSlugsQueryVariables,
  options?: UseQueryOptions<GetCustomPageSlugsQuery, TError, TData>,
) =>
  useQuery<GetCustomPageSlugsQuery, TError, TData>(
    variables === undefined ? ["getCustomPageSlugs"] : ["getCustomPageSlugs", variables],
    fetcher<GetCustomPageSlugsQuery, GetCustomPageSlugsQueryVariables>(GetCustomPageSlugsDocument, variables),
    options,
  );
useGetCustomPageSlugsQuery.document = GetCustomPageSlugsDocument;

useGetCustomPageSlugsQuery.getKey = (variables?: GetCustomPageSlugsQueryVariables) =>
  variables === undefined ? ["getCustomPageSlugs"] : ["getCustomPageSlugs", variables];
useGetCustomPageSlugsQuery.fetcher = (variables?: GetCustomPageSlugsQueryVariables) =>
  fetcher<GetCustomPageSlugsQuery, GetCustomPageSlugsQueryVariables>(GetCustomPageSlugsDocument, variables);
export const GetHomePageDocument = /*#__PURE__*/ `
    query getHomePage {
  homePage {
    excerpt
  }
  allProjects(first: 4) {
    ...ProjectFields
  }
  allTalks(first: 4, orderBy: date_DESC) {
    ...TalkFields
  }
  allPosts(first: 4, orderBy: createdAt_DESC) {
    ...PostFields
  }
}
    ${ProjectFieldsFragmentDoc}
${TalkFieldsFragmentDoc}
${PostFieldsFragmentDoc}`;
export const useGetHomePageQuery = <TData = GetHomePageQuery, TError = unknown>(
  variables?: GetHomePageQueryVariables,
  options?: UseQueryOptions<GetHomePageQuery, TError, TData>,
) =>
  useQuery<GetHomePageQuery, TError, TData>(
    variables === undefined ? ["getHomePage"] : ["getHomePage", variables],
    fetcher<GetHomePageQuery, GetHomePageQueryVariables>(GetHomePageDocument, variables),
    options,
  );
useGetHomePageQuery.document = GetHomePageDocument;

useGetHomePageQuery.getKey = (variables?: GetHomePageQueryVariables) =>
  variables === undefined ? ["getHomePage"] : ["getHomePage", variables];
useGetHomePageQuery.fetcher = (variables?: GetHomePageQueryVariables) =>
  fetcher<GetHomePageQuery, GetHomePageQueryVariables>(GetHomePageDocument, variables);
export const GetBlogPostsDocument = /*#__PURE__*/ `
    query getBlogPosts {
  allPosts(orderBy: createdAt_DESC) {
    ...PostFields
  }
}
    ${PostFieldsFragmentDoc}`;
export const useGetBlogPostsQuery = <TData = GetBlogPostsQuery, TError = unknown>(
  variables?: GetBlogPostsQueryVariables,
  options?: UseQueryOptions<GetBlogPostsQuery, TError, TData>,
) =>
  useQuery<GetBlogPostsQuery, TError, TData>(
    variables === undefined ? ["getBlogPosts"] : ["getBlogPosts", variables],
    fetcher<GetBlogPostsQuery, GetBlogPostsQueryVariables>(GetBlogPostsDocument, variables),
    options,
  );
useGetBlogPostsQuery.document = GetBlogPostsDocument;

useGetBlogPostsQuery.getKey = (variables?: GetBlogPostsQueryVariables) =>
  variables === undefined ? ["getBlogPosts"] : ["getBlogPosts", variables];
useGetBlogPostsQuery.fetcher = (variables?: GetBlogPostsQueryVariables) =>
  fetcher<GetBlogPostsQuery, GetBlogPostsQueryVariables>(GetBlogPostsDocument, variables);
export const GetBlogPostDocument = /*#__PURE__*/ `
    query getBlogPost($slug: String!) {
  post(filter: {slug: {eq: $slug}}) {
    ...PostFieldsWithContent
  }
}
    ${PostFieldsWithContentFragmentDoc}
${PostFieldsFragmentDoc}`;
export const useGetBlogPostQuery = <TData = GetBlogPostQuery, TError = unknown>(
  variables: GetBlogPostQueryVariables,
  options?: UseQueryOptions<GetBlogPostQuery, TError, TData>,
) =>
  useQuery<GetBlogPostQuery, TError, TData>(
    ["getBlogPost", variables],
    fetcher<GetBlogPostQuery, GetBlogPostQueryVariables>(GetBlogPostDocument, variables),
    options,
  );
useGetBlogPostQuery.document = GetBlogPostDocument;

useGetBlogPostQuery.getKey = (variables: GetBlogPostQueryVariables) => ["getBlogPost", variables];
useGetBlogPostQuery.fetcher = (variables: GetBlogPostQueryVariables) =>
  fetcher<GetBlogPostQuery, GetBlogPostQueryVariables>(GetBlogPostDocument, variables);
export const GetBlogPostSlugsDocument = /*#__PURE__*/ `
    query getBlogPostSlugs {
  allPosts {
    slug
  }
}
    `;
export const useGetBlogPostSlugsQuery = <TData = GetBlogPostSlugsQuery, TError = unknown>(
  variables?: GetBlogPostSlugsQueryVariables,
  options?: UseQueryOptions<GetBlogPostSlugsQuery, TError, TData>,
) =>
  useQuery<GetBlogPostSlugsQuery, TError, TData>(
    variables === undefined ? ["getBlogPostSlugs"] : ["getBlogPostSlugs", variables],
    fetcher<GetBlogPostSlugsQuery, GetBlogPostSlugsQueryVariables>(GetBlogPostSlugsDocument, variables),
    options,
  );
useGetBlogPostSlugsQuery.document = GetBlogPostSlugsDocument;

useGetBlogPostSlugsQuery.getKey = (variables?: GetBlogPostSlugsQueryVariables) =>
  variables === undefined ? ["getBlogPostSlugs"] : ["getBlogPostSlugs", variables];
useGetBlogPostSlugsQuery.fetcher = (variables?: GetBlogPostSlugsQueryVariables) =>
  fetcher<GetBlogPostSlugsQuery, GetBlogPostSlugsQueryVariables>(GetBlogPostSlugsDocument, variables);
export const GetSlugRedirectDocument = /*#__PURE__*/ `
    query getSlugRedirect($slug: String!) {
  post(filter: {slug: {eq: $slug}}) {
    redirect
  }
}
    `;
export const useGetSlugRedirectQuery = <TData = GetSlugRedirectQuery, TError = unknown>(
  variables: GetSlugRedirectQueryVariables,
  options?: UseQueryOptions<GetSlugRedirectQuery, TError, TData>,
) =>
  useQuery<GetSlugRedirectQuery, TError, TData>(
    ["getSlugRedirect", variables],
    fetcher<GetSlugRedirectQuery, GetSlugRedirectQueryVariables>(GetSlugRedirectDocument, variables),
    options,
  );
useGetSlugRedirectQuery.document = GetSlugRedirectDocument;

useGetSlugRedirectQuery.getKey = (variables: GetSlugRedirectQueryVariables) => ["getSlugRedirect", variables];
useGetSlugRedirectQuery.fetcher = (variables: GetSlugRedirectQueryVariables) =>
  fetcher<GetSlugRedirectQuery, GetSlugRedirectQueryVariables>(GetSlugRedirectDocument, variables);
export const GetProjectsDocument = /*#__PURE__*/ `
    query getProjects {
  allProjects {
    ...ProjectFields
  }
}
    ${ProjectFieldsFragmentDoc}`;
export const useGetProjectsQuery = <TData = GetProjectsQuery, TError = unknown>(
  variables?: GetProjectsQueryVariables,
  options?: UseQueryOptions<GetProjectsQuery, TError, TData>,
) =>
  useQuery<GetProjectsQuery, TError, TData>(
    variables === undefined ? ["getProjects"] : ["getProjects", variables],
    fetcher<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, variables),
    options,
  );
useGetProjectsQuery.document = GetProjectsDocument;

useGetProjectsQuery.getKey = (variables?: GetProjectsQueryVariables) =>
  variables === undefined ? ["getProjects"] : ["getProjects", variables];
useGetProjectsQuery.fetcher = (variables?: GetProjectsQueryVariables) =>
  fetcher<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, variables);
export const GetRedirectsDocument = /*#__PURE__*/ `
    query getRedirects {
  route {
    redirects
  }
}
    `;
export const useGetRedirectsQuery = <TData = GetRedirectsQuery, TError = unknown>(
  variables?: GetRedirectsQueryVariables,
  options?: UseQueryOptions<GetRedirectsQuery, TError, TData>,
) =>
  useQuery<GetRedirectsQuery, TError, TData>(
    variables === undefined ? ["getRedirects"] : ["getRedirects", variables],
    fetcher<GetRedirectsQuery, GetRedirectsQueryVariables>(GetRedirectsDocument, variables),
    options,
  );
useGetRedirectsQuery.document = GetRedirectsDocument;

useGetRedirectsQuery.getKey = (variables?: GetRedirectsQueryVariables) =>
  variables === undefined ? ["getRedirects"] : ["getRedirects", variables];
useGetRedirectsQuery.fetcher = (variables?: GetRedirectsQueryVariables) =>
  fetcher<GetRedirectsQuery, GetRedirectsQueryVariables>(GetRedirectsDocument, variables);
export const GetRewritesDocument = /*#__PURE__*/ `
    query getRewrites {
  route {
    rewrites
  }
}
    `;
export const useGetRewritesQuery = <TData = GetRewritesQuery, TError = unknown>(
  variables?: GetRewritesQueryVariables,
  options?: UseQueryOptions<GetRewritesQuery, TError, TData>,
) =>
  useQuery<GetRewritesQuery, TError, TData>(
    variables === undefined ? ["getRewrites"] : ["getRewrites", variables],
    fetcher<GetRewritesQuery, GetRewritesQueryVariables>(GetRewritesDocument, variables),
    options,
  );
useGetRewritesQuery.document = GetRewritesDocument;

useGetRewritesQuery.getKey = (variables?: GetRewritesQueryVariables) =>
  variables === undefined ? ["getRewrites"] : ["getRewrites", variables];
useGetRewritesQuery.fetcher = (variables?: GetRewritesQueryVariables) =>
  fetcher<GetRewritesQuery, GetRewritesQueryVariables>(GetRewritesDocument, variables);
export const GetRoutesDocument = /*#__PURE__*/ `
    query getRoutes {
  route {
    redirects
    rewrites
  }
}
    `;
export const useGetRoutesQuery = <TData = GetRoutesQuery, TError = unknown>(
  variables?: GetRoutesQueryVariables,
  options?: UseQueryOptions<GetRoutesQuery, TError, TData>,
) =>
  useQuery<GetRoutesQuery, TError, TData>(
    variables === undefined ? ["getRoutes"] : ["getRoutes", variables],
    fetcher<GetRoutesQuery, GetRoutesQueryVariables>(GetRoutesDocument, variables),
    options,
  );
useGetRoutesQuery.document = GetRoutesDocument;

useGetRoutesQuery.getKey = (variables?: GetRoutesQueryVariables) =>
  variables === undefined ? ["getRoutes"] : ["getRoutes", variables];
useGetRoutesQuery.fetcher = (variables?: GetRoutesQueryVariables) =>
  fetcher<GetRoutesQuery, GetRoutesQueryVariables>(GetRoutesDocument, variables);
export const GetSeoDataDocument = /*#__PURE__*/ `
    query getSeoData {
  _site {
    favicon {
      url
    }
    faviconMetaTags {
      tag
      attributes
      content
    }
  }
}
    `;
export const useGetSeoDataQuery = <TData = GetSeoDataQuery, TError = unknown>(
  variables?: GetSeoDataQueryVariables,
  options?: UseQueryOptions<GetSeoDataQuery, TError, TData>,
) =>
  useQuery<GetSeoDataQuery, TError, TData>(
    variables === undefined ? ["getSeoData"] : ["getSeoData", variables],
    fetcher<GetSeoDataQuery, GetSeoDataQueryVariables>(GetSeoDataDocument, variables),
    options,
  );
useGetSeoDataQuery.document = GetSeoDataDocument;

useGetSeoDataQuery.getKey = (variables?: GetSeoDataQueryVariables) =>
  variables === undefined ? ["getSeoData"] : ["getSeoData", variables];
useGetSeoDataQuery.fetcher = (variables?: GetSeoDataQueryVariables) =>
  fetcher<GetSeoDataQuery, GetSeoDataQueryVariables>(GetSeoDataDocument, variables);
export const GetTalksDocument = /*#__PURE__*/ `
    query getTalks {
  allTalks(orderBy: date_DESC) {
    ...TalkFields
  }
}
    ${TalkFieldsFragmentDoc}`;
export const useGetTalksQuery = <TData = GetTalksQuery, TError = unknown>(
  variables?: GetTalksQueryVariables,
  options?: UseQueryOptions<GetTalksQuery, TError, TData>,
) =>
  useQuery<GetTalksQuery, TError, TData>(
    variables === undefined ? ["getTalks"] : ["getTalks", variables],
    fetcher<GetTalksQuery, GetTalksQueryVariables>(GetTalksDocument, variables),
    options,
  );
useGetTalksQuery.document = GetTalksDocument;

useGetTalksQuery.getKey = (variables?: GetTalksQueryVariables) =>
  variables === undefined ? ["getTalks"] : ["getTalks", variables];
useGetTalksQuery.fetcher = (variables?: GetTalksQueryVariables) =>
  fetcher<GetTalksQuery, GetTalksQueryVariables>(GetTalksDocument, variables);
