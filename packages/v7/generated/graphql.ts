//@ts-nocheck
/* eslint-disable */
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** Represents `true` or `false` values. */
  BooleanType: any;
  CustomData: any;
  /** A ISO 8601 compliant date value */
  Date: any;
  /** A ISO 8601 compliant datetime value */
  DateTime: any;
  /** Represents signed double-precision fractional values as specified by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point). */
  FloatType: any;
  /** Represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. */
  IntType: any;
  ItemId: any;
  JsonField: any;
  MetaTagAttributes: any;
  UploadId: any;
};

/** Record of type About (about) */
export type AboutRecord = {
  _createdAt: Scalars['DateTime'];
  _firstPublishedAt: Maybe<Scalars['DateTime']>;
  _isValid: Scalars['BooleanType'];
  _modelApiKey: Scalars['String'];
  _publicationScheduledAt: Maybe<Scalars['DateTime']>;
  _publishedAt: Maybe<Scalars['DateTime']>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars['DateTime']>;
  _updatedAt: Scalars['DateTime'];
  coverImage: Maybe<FileField>;
  createdAt: Scalars['DateTime'];
  email: Maybe<Scalars['String']>;
  id: Scalars['ItemId'];
  knowledgeBases: Maybe<Array<Maybe<EntryRecord>>>;
  preface: Maybe<Scalars['String']>;
  socialsJson: Maybe<Scalars['JsonField']>;
  updatedAt: Scalars['DateTime'];
};


/** Record of type About (about) */
export type AboutRecord_SeoMetaTagsArgs = {
  locale: Maybe<SiteLocale>;
};


/** Record of type About (about) */
export type AboutRecordPrefaceArgs = {
  markdown: Maybe<Scalars['Boolean']>;
};

export type AppearanceModelFilter = {
  _createdAt: Maybe<CreatedAtFilter>;
  createdAt: Maybe<CreatedAtFilter>;
  id: Maybe<ItemIdFilter>;
  _firstPublishedAt: Maybe<PublishedAtFilter>;
  _publicationScheduledAt: Maybe<PublishedAtFilter>;
  _unpublishingScheduledAt: Maybe<PublishedAtFilter>;
  _publishedAt: Maybe<PublishedAtFilter>;
  _status: Maybe<StatusFilter>;
  _updatedAt: Maybe<UpdatedAtFilter>;
  updatedAt: Maybe<UpdatedAtFilter>;
  _isValid: Maybe<BooleanFilter>;
  category: Maybe<StringFilter>;
  tags: Maybe<LinksFilter>;
  url: Maybe<StringFilter>;
  subtitle: Maybe<StringFilter>;
  date: Maybe<DateFilter>;
  title: Maybe<StringFilter>;
  OR: Maybe<Array<Maybe<AppearanceModelFilter>>>;
};

export enum AppearanceModelOrderBy {
  CreatedAtAsc = '_createdAt_ASC',
  CreatedAtDesc = '_createdAt_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  FirstPublishedAtAsc = '_firstPublishedAt_ASC',
  FirstPublishedAtDesc = '_firstPublishedAt_DESC',
  PublicationScheduledAtAsc = '_publicationScheduledAt_ASC',
  PublicationScheduledAtDesc = '_publicationScheduledAt_DESC',
  UnpublishingScheduledAtAsc = '_unpublishingScheduledAt_ASC',
  UnpublishingScheduledAtDesc = '_unpublishingScheduledAt_DESC',
  PublishedAtAsc = '_publishedAt_ASC',
  PublishedAtDesc = '_publishedAt_DESC',
  StatusAsc = '_status_ASC',
  StatusDesc = '_status_DESC',
  UpdatedAtAsc = '_updatedAt_ASC',
  UpdatedAtDesc = '_updatedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  IsValidAsc = '_isValid_ASC',
  IsValidDesc = '_isValid_DESC',
  CategoryAsc = 'category_ASC',
  CategoryDesc = 'category_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
  SubtitleAsc = 'subtitle_ASC',
  SubtitleDesc = 'subtitle_DESC',
  DateAsc = 'date_ASC',
  DateDesc = 'date_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC'
}

/** Record of type Appearance (appearance) */
export type AppearanceRecord = {
  _createdAt: Scalars['DateTime'];
  _firstPublishedAt: Maybe<Scalars['DateTime']>;
  _isValid: Scalars['BooleanType'];
  _modelApiKey: Scalars['String'];
  _publicationScheduledAt: Maybe<Scalars['DateTime']>;
  _publishedAt: Maybe<Scalars['DateTime']>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars['DateTime']>;
  _updatedAt: Scalars['DateTime'];
  category: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  date: Maybe<Scalars['Date']>;
  id: Scalars['ItemId'];
  subtitle: Maybe<Scalars['String']>;
  tags: Array<TagRecord>;
  title: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  url: Maybe<Scalars['String']>;
};


/** Record of type Appearance (appearance) */
export type AppearanceRecord_SeoMetaTagsArgs = {
  locale: Maybe<SiteLocale>;
};

/** Specifies how to filter Boolean fields */
export type BooleanFilter = {
  /** Search for records with an exact match */
  eq: Maybe<Scalars['BooleanType']>;
};


export type CollectionMetadata = {
  count: Scalars['IntType'];
};

export enum ColorBucketType {
  Red = 'red',
  Orange = 'orange',
  Pink = 'pink',
  Cyan = 'cyan',
  Purple = 'purple',
  Blue = 'blue',
  Yellow = 'yellow',
  Green = 'green',
  Brown = 'brown',
  Grey = 'grey',
  White = 'white',
  Black = 'black'
}

export type ColorField = {
  alpha: Maybe<Scalars['IntType']>;
  blue: Maybe<Scalars['IntType']>;
  green: Maybe<Scalars['IntType']>;
  hex: Maybe<Scalars['String']>;
  red: Maybe<Scalars['IntType']>;
};

/** Specifies how to filter by creation datetime */
export type CreatedAtFilter = {
  /** Filter records with a value that's strictly greater than the one specified */
  gt: Maybe<Scalars['DateTime']>;
  /** Filter records with a value that's less than the one specified */
  lt: Maybe<Scalars['DateTime']>;
  /** Filter records with a value that's greater than or equal to than the one specified */
  gte: Maybe<Scalars['DateTime']>;
  /** Filter records with a value that's less or equal than the one specified */
  lte: Maybe<Scalars['DateTime']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
  /** Search for records with an exact match (seconds are truncated) */
  eq: Maybe<Scalars['DateTime']>;
  /** Exclude records with an exact match */
  neq: Maybe<Scalars['DateTime']>;
};



/** Specifies how to filter Date fields */
export type DateFilter = {
  /** Filter records with a value that's strictly greater than the one specified */
  gt: Maybe<Scalars['Date']>;
  /** Filter records with a value that's less than the one specified */
  lt: Maybe<Scalars['Date']>;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte: Maybe<Scalars['Date']>;
  /** Filter records with a value that's less or equal than the one specified */
  lte: Maybe<Scalars['Date']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
  /** Search for records with an exact match */
  eq: Maybe<Scalars['Date']>;
  /** Exclude records with an exact match */
  neq: Maybe<Scalars['Date']>;
};


/** Record of type Entry (entry) */
export type EntryRecord = {
  _createdAt: Scalars['DateTime'];
  _firstPublishedAt: Maybe<Scalars['DateTime']>;
  _isValid: Scalars['BooleanType'];
  _modelApiKey: Scalars['String'];
  _publicationScheduledAt: Maybe<Scalars['DateTime']>;
  _publishedAt: Maybe<Scalars['DateTime']>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars['DateTime']>;
  _updatedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  entries: Maybe<Scalars['String']>;
  id: Scalars['ItemId'];
  title: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};


/** Record of type Entry (entry) */
export type EntryRecord_SeoMetaTagsArgs = {
  locale: Maybe<SiteLocale>;
};

export enum FaviconType {
  Icon = 'icon',
  AppleTouchIcon = 'appleTouchIcon',
  MsApplication = 'msApplication'
}

export type FileField = {
  _createdAt: Scalars['DateTime'];
  _updatedAt: Scalars['DateTime'];
  alt: Maybe<Scalars['String']>;
  author: Maybe<Scalars['String']>;
  basename: Scalars['String'];
  blurUpThumb: Maybe<Scalars['String']>;
  blurhash: Maybe<Scalars['String']>;
  colors: Array<Maybe<ColorField>>;
  copyright: Maybe<Scalars['String']>;
  customData: Maybe<Scalars['CustomData']>;
  exifInfo: Maybe<Scalars['CustomData']>;
  filename: Scalars['String'];
  focalPoint: Maybe<FocalPoint>;
  format: Scalars['String'];
  height: Maybe<Scalars['IntType']>;
  id: Scalars['UploadId'];
  md5: Scalars['String'];
  mimeType: Scalars['String'];
  notes: Maybe<Scalars['String']>;
  responsiveImage: Maybe<ResponsiveImage>;
  size: Scalars['IntType'];
  smartTags: Array<Maybe<Scalars['String']>>;
  tags: Array<Maybe<Scalars['String']>>;
  title: Maybe<Scalars['String']>;
  url: Scalars['String'];
  video: Maybe<UploadVideoField>;
  width: Maybe<Scalars['IntType']>;
};


export type FileFieldAltArgs = {
  locale: Maybe<SiteLocale>;
};


export type FileFieldBlurUpThumbArgs = {
  punch?: Maybe<Scalars['Float']>;
  size?: Maybe<Scalars['Int']>;
  quality?: Maybe<Scalars['Int']>;
  imgixParams: Maybe<ImgixParams>;
};


export type FileFieldCustomDataArgs = {
  locale: Maybe<SiteLocale>;
};


export type FileFieldFocalPointArgs = {
  locale: Maybe<SiteLocale>;
};


export type FileFieldResponsiveImageArgs = {
  imgixParams: Maybe<ImgixParams>;
  sizes: Maybe<Scalars['String']>;
};


export type FileFieldTitleArgs = {
  locale: Maybe<SiteLocale>;
};


export type FileFieldUrlArgs = {
  imgixParams: Maybe<ImgixParams>;
};

/** Specifies how to filter Single-file/image fields */
export type FileFilter = {
  /** Search for records with an exact match. The specified value must be an Upload ID */
  eq: Maybe<Scalars['UploadId']>;
  /** Exclude records with an exact match. The specified value must be an Upload ID */
  neq: Maybe<Scalars['UploadId']>;
  /** Filter records that have one of the specified uploads */
  in: Maybe<Array<Maybe<Scalars['UploadId']>>>;
  /** Filter records that do not have one of the specified uploads */
  notIn: Maybe<Array<Maybe<Scalars['UploadId']>>>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
};


export type GlobalSeoField = {
  facebookPageUrl: Maybe<Scalars['String']>;
  fallbackSeo: Maybe<SeoField>;
  siteName: Maybe<Scalars['String']>;
  titleSuffix: Maybe<Scalars['String']>;
  twitterAccount: Maybe<Scalars['String']>;
};

export type ImgixParams = {
  /**
   * Aspect Ratio
   *
   * Specifies an aspect ratio to maintain when resizing and cropping the image
   *
   * Depends on: `fit=crop`
   */
  ar: Maybe<Scalars['String']>;
  /**
   * Automatic
   *
   * Applies automatic enhancements to images.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/auto)
   */
  auto: Maybe<Array<ImgixParamsAuto>>;
  /**
   * Background Color
   *
   * Colors the background of padded and partially-transparent images.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/bg)
   */
  bg: Maybe<Scalars['String']>;
  /**
   * Blend Align
   *
   * Changes the blend alignment relative to the parent image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-align)
   */
  blendAlign: Maybe<Array<ImgixParamsBlendAlign>>;
  /**
   * Blend Alpha
   *
   * Changes the alpha of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-alpha)
   */
  blendAlpha: Maybe<Scalars['IntType']>;
  /**
   * Blend Color
   *
   * Specifies a color to use when applying the blend.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-color)
   */
  blendColor: Maybe<Scalars['String']>;
  /**
   * Blend Crop
   *
   * Specifies the type of crop for blend images.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-crop)
   */
  blendCrop: Maybe<Array<ImgixParamsBlendCrop>>;
  /**
   * Blend Fit
   *
   * Specifies the fit mode for blend images.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-fit)
   */
  blendFit: Maybe<ImgixParamsBlendFit>;
  /**
   * Blend Height
   *
   * Adjusts the height of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-h)
   */
  blendH: Maybe<Scalars['FloatType']>;
  /**
   * Blend Mode
   *
   * Sets the blend mode for a blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-mode)
   */
  blendMode: Maybe<ImgixParamsBlendMode>;
  /**
   * Blend Padding
   *
   * Applies padding to the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-pad)
   */
  blendPad: Maybe<Scalars['IntType']>;
  /**
   * Blend Size
   *
   * Adjusts the size of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-size)
   */
  blendSize: Maybe<ImgixParamsBlendSize>;
  /**
   * Blend Width
   *
   * Adjusts the width of the blend image.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-w)
   */
  blendW: Maybe<Scalars['FloatType']>;
  /**
   * Blend X Position
   *
   * Adjusts the x-offset of the blend image relative to its parent.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-x)
   */
  blendX: Maybe<Scalars['IntType']>;
  /**
   * Blend Y Position
   *
   * Adjusts the y-offset of the blend image relative to its parent.
   *
   * Depends on: `blend`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend-y)
   */
  blendY: Maybe<Scalars['IntType']>;
  /**
   * Blend
   *
   * Specifies the location of the blend image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/blending/blend)
   */
  blend: Maybe<Scalars['String']>;
  /**
   * Gaussian Blur
   *
   * Applies a gaussian blur to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/blur)
   */
  blur: Maybe<Scalars['IntType']>;
  /**
   * Border Bottom
   *
   * Sets bottom border of an image.
   *
   * Depends on: `border`
   */
  borderBottom: Maybe<Scalars['IntType']>;
  /**
   * Border Left
   *
   * Sets left border of an image.
   *
   * Depends on: `border`
   */
  borderLeft: Maybe<Scalars['IntType']>;
  /**
   * Inner Border Radius
   *
   * Sets the inner radius of the image's border in pixels.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/border-radius-inner)
   */
  borderRadiusInner: Maybe<Scalars['String']>;
  /**
   * Outer Border Radius
   *
   * Sets the outer radius of the image's border in pixels.
   *
   * Depends on: `border`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/border-radius)
   */
  borderRadius: Maybe<Scalars['String']>;
  /**
   * Border Right
   *
   * Sets right border of an image.
   *
   * Depends on: `border`
   */
  borderRight: Maybe<Scalars['IntType']>;
  /**
   * Border Top
   *
   * Sets top border of an image.
   *
   * Depends on: `border`
   */
  borderTop: Maybe<Scalars['IntType']>;
  /**
   * Border Size & Color
   *
   * Applies a border to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/border)
   */
  border: Maybe<Scalars['String']>;
  /**
   * Brightness
   *
   * Adjusts the brightness of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/bri)
   */
  bri: Maybe<Scalars['IntType']>;
  /**
   * Client Hints
   *
   * Sets one or more Client-Hints headers
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/ch)
   */
  ch: Maybe<Array<ImgixParamsCh>>;
  /**
   * Chroma Subsampling
   *
   * Specifies the output chroma subsampling rate.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/chromasub)
   */
  chromasub: Maybe<Scalars['IntType']>;
  /**
   * Color Quantization
   *
   * Limits the number of unique colors in an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/colorquant)
   */
  colorquant: Maybe<Scalars['IntType']>;
  /**
   * Palette Color Count
   *
   * Specifies how many colors to include in a palette-extraction response.
   *
   * Depends on: `palette`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/color-palette/colors)
   */
  colors: Maybe<Scalars['IntType']>;
  /**
   * Contrast
   *
   * Adjusts the contrast of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/con)
   */
  con: Maybe<Scalars['IntType']>;
  /**
   * Mask Corner Radius
   *
   * Specifies the radius value for a rounded corner mask.
   *
   * Depends on: `mask=corners`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/mask/corner-radius)
   */
  cornerRadius: Maybe<Scalars['String']>;
  /**
   * Crop Mode
   *
   * Specifies how to crop an image.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/crop)
   */
  crop: Maybe<Array<ImgixParamsCrop>>;
  /**
   * Color Space
   *
   * Specifies the color space of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/cs)
   */
  cs: Maybe<ImgixParamsCs>;
  /**
   * Download
   *
   * Forces a URL to use send-file in its response.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/dl)
   */
  dl: Maybe<Scalars['String']>;
  /**
   * Dots Per Inch
   *
   * Sets the DPI value in the EXIF header.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/dpi)
   */
  dpi: Maybe<Scalars['IntType']>;
  /**
   * Device Pixel Ratio
   *
   * Adjusts the device-pixel ratio of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/dpr)
   */
  dpr: Maybe<Scalars['FloatType']>;
  /**
   * Duotone Alpha
   *
   * Changes the alpha of the duotone effect atop the source image.
   *
   * Depends on: `duotone`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/duotone-alpha)
   */
  duotoneAlpha: Maybe<Scalars['IntType']>;
  /**
   * Duotone
   *
   * Applies a duotone effect to the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/duotone)
   */
  duotone: Maybe<Scalars['String']>;
  /**
   * Exposure
   *
   * Adjusts the exposure of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/exp)
   */
  exp: Maybe<Scalars['IntType']>;
  /**
   * Url Expiration Timestamp
   *
   * A Unix timestamp specifying a UTC time. Requests made to this URL after that time will output a 404 status code.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/expires)
   */
  expires: Maybe<Scalars['IntType']>;
  /**
   * Face Index
   *
   * Selects a face to crop to.
   *
   * Depends on: `fit=facearea`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/face-detection/faceindex)
   */
  faceindex: Maybe<Scalars['IntType']>;
  /**
   * Face Padding
   *
   * Adjusts padding around a selected face.
   *
   * Depends on: `fit=facearea`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/face-detection/facepad)
   */
  facepad: Maybe<Scalars['FloatType']>;
  /**
   * Json Face Data
   *
   * Specifies that face data should be included in output when combined with `fm=json`.
   *
   * Depends on: `fm=json`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/face-detection/faces)
   */
  faces: Maybe<Scalars['IntType']>;
  /**
   * Fill Color
   *
   * Sets the fill color for images with additional space created by the fit setting
   *
   * Depends on: `fill=solid`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/fill/fill-color)
   */
  fillColor: Maybe<Scalars['String']>;
  /**
   * Fill Mode
   *
   * Determines how to fill in additional space created by the fit setting
   *
   * Depends on: `fit`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/fill/fill)
   */
  fill: Maybe<ImgixParamsFill>;
  /**
   * Resize Fit Mode
   *
   * Specifies how to map the source image to the output image dimensions.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/fit)
   */
  fit: Maybe<ImgixParamsFit>;
  /**
   * Flip Axis
   *
   * Flips an image on a specified axis.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/rotation/flip)
   */
  flip: Maybe<ImgixParamsFlip>;
  /**
   * Output Format
   *
   * Changes the format of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/fm)
   */
  fm: Maybe<ImgixParamsFm>;
  /**
   * Focal Point Debug
   *
   * Displays crosshairs identifying the location of the set focal point
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/focalpoint-crop/fp-debug)
   */
  fpDebug: Maybe<Scalars['BooleanType']>;
  /**
   * Focal Point X Position
   *
   * Sets the relative horizontal value for the focal point of an image
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/focalpoint-crop/fp-x)
   */
  fpX: Maybe<Scalars['FloatType']>;
  /**
   * Focal Point Y Position
   *
   * Sets the relative vertical value for the focal point of an image
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/focalpoint-crop/fp-y)
   */
  fpY: Maybe<Scalars['FloatType']>;
  /**
   * Focal Point Zoom
   *
   * Sets the relative zoom value for the focal point of an image
   *
   * Depends on: `fit=crop`, `crop=focalpoint`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/focalpoint-crop/fp-z)
   */
  fpZ: Maybe<Scalars['IntType']>;
  /**
   * Gamma
   *
   * Adjusts the gamma of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/gam)
   */
  gam: Maybe<Scalars['IntType']>;
  /**
   * Grid Colors
   *
   * Sets grid colors for the transparency checkerboard grid.
   *
   * Depends on: `transparency`
   */
  gridColors: Maybe<Scalars['String']>;
  /**
   * Grid Size
   *
   * Sets grid size for the transparency checkerboard grid.
   *
   * Depends on: `transparency`
   */
  gridSize: Maybe<Scalars['IntType']>;
  /**
   * Image Height
   *
   * Adjusts the height of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/h)
   */
  h: Maybe<Scalars['FloatType']>;
  /**
   * Highlight
   *
   * Adjusts the highlights of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/high)
   */
  high: Maybe<Scalars['IntType']>;
  /**
   * Halftone
   *
   * Applies a half-tone effect to the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/htn)
   */
  htn: Maybe<Scalars['IntType']>;
  /**
   * Hue Shift
   *
   * Adjusts the hue of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/hue)
   */
  hue: Maybe<Scalars['IntType']>;
  /**
   * Invert
   *
   * Inverts the colors on the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/invert)
   */
  invert: Maybe<Scalars['BooleanType']>;
  /**
   * Lossless Compression
   *
   * Specifies that the output image should be a lossless variant.
   *
   * Depends on: `fm=webp`, `fm=jxr`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/lossless)
   */
  lossless: Maybe<Scalars['BooleanType']>;
  /**
   * Watermark Alignment Mode
   *
   * Changes the watermark alignment relative to the parent image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-align)
   */
  markAlign: Maybe<Array<ImgixParamsMarkAlign>>;
  /**
   * Watermark Alpha
   *
   * Changes the alpha of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-alpha)
   */
  markAlpha: Maybe<Scalars['IntType']>;
  /**
   * Watermark Base Url
   *
   * Changes base URL of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-base)
   */
  markBase: Maybe<Scalars['String']>;
  /**
   * Watermark Fit Mode
   *
   * Specifies the fit mode for watermark images.
   *
   * Depends on: `mark`, `markw`, `markh`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-fit)
   */
  markFit: Maybe<ImgixParamsMarkFit>;
  /**
   * Watermark Height
   *
   * Adjusts the height of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-h)
   */
  markH: Maybe<Scalars['FloatType']>;
  /**
   * Watermark Padding
   *
   * Applies padding to the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-pad)
   */
  markPad: Maybe<Scalars['IntType']>;
  /**
   * Watermark Scale
   *
   * Adjusts the scale of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-scale)
   */
  markScale: Maybe<Scalars['IntType']>;
  /**
   * Watermark Width
   *
   * Adjusts the width of the watermark image.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-w)
   */
  markW: Maybe<Scalars['FloatType']>;
  /**
   * Watermark X Position
   *
   * Adjusts the x-offset of the watermark image relative to its parent.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-x)
   */
  markX: Maybe<Scalars['IntType']>;
  /**
   * Watermark Y Position
   *
   * Adjusts the y-offset of the watermark image relative to its parent.
   *
   * Depends on: `mark`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark-y)
   */
  markY: Maybe<Scalars['IntType']>;
  /**
   * Watermark Image Url
   *
   * Specifies the location of the watermark image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/watermark/mark)
   */
  mark: Maybe<Scalars['String']>;
  /**
   * Mask Background Color
   *
   * Colors the background of the transparent mask area of images
   *
   * Depends on: `mask`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/mask/mask-bg)
   */
  maskBg: Maybe<Scalars['String']>;
  /**
   * Mask Type
   *
   * Defines the type of mask and specifies the URL if that type is selected.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/mask)
   */
  mask: Maybe<Scalars['String']>;
  /**
   * Maximum Height
   *
   * Specifies the maximum height of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/max-height)
   */
  maxH: Maybe<Scalars['IntType']>;
  /**
   * Maximum Width
   *
   * Specifies the maximum width of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/max-width)
   */
  maxW: Maybe<Scalars['IntType']>;
  /**
   * Minimum Height
   *
   * Specifies the minimum height of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/min-height)
   */
  minH: Maybe<Scalars['IntType']>;
  /**
   * Minimum Width
   *
   * Specifies the minimum width of the output image in pixels.
   *
   * Depends on: `fit=crop`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/min-width)
   */
  minW: Maybe<Scalars['IntType']>;
  /**
   * Monochrome
   *
   * Applies a monochrome effect to the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/monochrome)
   */
  monochrome: Maybe<Scalars['String']>;
  /**
   * Noise Reduction Bound
   *
   * Reduces the noise in an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/noise-reduction/nr)
   */
  nr: Maybe<Scalars['IntType']>;
  /**
   * Noise Reduction Sharpen
   *
   * Provides a threshold by which to sharpen an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/noise-reduction/nrs)
   */
  nrs: Maybe<Scalars['IntType']>;
  /**
   * Orientation
   *
   * Changes the image orientation.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/rotation/orient)
   */
  orient: Maybe<Scalars['IntType']>;
  /**
   * Padding Bottom
   *
   * Sets bottom padding of an image.
   */
  padBottom: Maybe<Scalars['IntType']>;
  /**
   * Padding Left
   *
   * Sets left padding of an image.
   */
  padLeft: Maybe<Scalars['IntType']>;
  /**
   * Padding Right
   *
   * Sets right padding of an image.
   */
  padRight: Maybe<Scalars['IntType']>;
  /**
   * Padding Top
   *
   * Sets top padding of an image.
   */
  padTop: Maybe<Scalars['IntType']>;
  /**
   * Padding
   *
   * Pads an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/border-and-padding/pad)
   */
  pad: Maybe<Scalars['IntType']>;
  /**
   * Pdf Page Number
   *
   * Selects a page from a PDF for display.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/pdf-page-number)
   */
  page: Maybe<Scalars['IntType']>;
  /**
   * Color Palette Extraction
   *
   * Specifies an output format for palette-extraction.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/color-palette/palette)
   */
  palette: Maybe<ImgixParamsPalette>;
  /**
   * Css Prefix
   *
   * Specifies a CSS prefix for all classes in palette-extraction.
   *
   * Depends on: `palette=css`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/color-palette/prefix)
   */
  prefix: Maybe<Scalars['String']>;
  /**
   * Pixellate
   *
   * Applies a pixelation effect to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/px)
   */
  px: Maybe<Scalars['IntType']>;
  /**
   * Output Quality
   *
   * Adjusts the quality of an output image.
   *
   * Depends on: `fm=jpg`, `fm=pjpg`, `fm=webp`, `fm=jxr`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/format/q)
   */
  q: Maybe<Scalars['IntType']>;
  /**
   * Source Rectangle Region
   *
   * Crops an image to a specified rectangle.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/rect)
   */
  rect: Maybe<Scalars['String']>;
  /**
   * Rotation
   *
   * Rotates an image by a specified number of degrees.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/rotation/rot)
   */
  rot: Maybe<Scalars['FloatType']>;
  /**
   * Saturation
   *
   * Adjusts the saturation of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/sat)
   */
  sat: Maybe<Scalars['IntType']>;
  /**
   * Sepia Tone
   *
   * Applies a sepia effect to an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/stylize/sepia)
   */
  sepia: Maybe<Scalars['IntType']>;
  /**
   * Shadow
   *
   * Adjusts the highlights of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/shad)
   */
  shad: Maybe<Scalars['FloatType']>;
  /**
   * Sharpen
   *
   * Adjusts the sharpness of the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/sharp)
   */
  sharp: Maybe<Scalars['FloatType']>;
  /**
   * Transparency
   *
   * Adds checkerboard behind images which support transparency.
   */
  transparency: Maybe<ImgixParamsTransparency>;
  /**
   * Trim Color
   *
   * Specifies a trim color on a trim operation.
   *
   * Depends on: `trim=color`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim-color)
   */
  trimColor: Maybe<Scalars['String']>;
  /**
   * Trim Mean Difference
   *
   * Specifies the mean difference on a trim operation.
   *
   * Depends on: `trim=auto`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim-md)
   */
  trimMd: Maybe<Scalars['FloatType']>;
  /**
   * Trim Padding
   *
   * Pads the area of the source image before trimming.
   *
   * Depends on: `trim`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim-pad)
   */
  trimPad: Maybe<Scalars['IntType']>;
  /**
   * Trim Standard Deviation
   *
   * Specifies the standard deviation on a trim operation.
   *
   * Depends on: `trim=auto`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim-sd)
   */
  trimSd: Maybe<Scalars['FloatType']>;
  /**
   * Trim Tolerance
   *
   * Specifies the tolerance on a trim operation.
   *
   * Depends on: `trim=color`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim-tol)
   */
  trimTol: Maybe<Scalars['FloatType']>;
  /**
   * Trim Image
   *
   * Trims the source image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/trim/trim)
   */
  trim: Maybe<ImgixParamsTrim>;
  /**
   * Text Align
   *
   * Sets the vertical and horizontal alignment of rendered text relative to the base image.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-align)
   */
  txtAlign: Maybe<Array<ImgixParamsTxtAlign>>;
  /**
   * Text Clipping Mode
   *
   * Sets the clipping properties of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-clip)
   */
  txtClip: Maybe<Array<ImgixParamsTxtClip>>;
  /**
   * Text Color
   *
   * Specifies the color of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-color)
   */
  txtColor: Maybe<Scalars['String']>;
  /**
   * Text Fit Mode
   *
   * Specifies the fit approach for rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-fit)
   */
  txtFit: Maybe<ImgixParamsTxtFit>;
  /**
   * Text Font
   *
   * Selects a font for rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-font)
   */
  txtFont: Maybe<Scalars['String']>;
  /**
   * Text Leading
   *
   * Sets the leading (line spacing) for rendered text. Only works on the multi-line text endpoint.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/typesetting/txt-lead)
   */
  txtLead: Maybe<Scalars['IntType']>;
  /**
   * Text Ligatures
   *
   * Controls the level of ligature substitution
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-lig)
   */
  txtLig: Maybe<Scalars['IntType']>;
  /**
   * Text Outline Color
   *
   * Specifies a text outline color.
   *
   * Depends on: `txt`, `txtline`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-line-color)
   */
  txtLineColor: Maybe<Scalars['String']>;
  /**
   * Text Outline
   *
   * Outlines the rendered text with a specified color.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-line)
   */
  txtLine: Maybe<Scalars['IntType']>;
  /**
   * Text Padding
   *
   * Specifies the padding (in device-independent pixels) between a textbox and the edges of the base image.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-pad)
   */
  txtPad: Maybe<Scalars['IntType']>;
  /**
   * Text Shadow
   *
   * Applies a shadow to rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-shad)
   */
  txtShad: Maybe<Scalars['FloatType']>;
  /**
   * Text Font Size
   *
   * Sets the font size of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-size)
   */
  txtSize: Maybe<Scalars['IntType']>;
  /**
   * Text Tracking
   *
   * Sets the tracking (letter spacing) for rendered text. Only works on the multi-line text endpoint.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/typesetting/txt-track)
   */
  txtTrack: Maybe<Scalars['IntType']>;
  /**
   * Text Width
   *
   * Sets the width of rendered text.
   *
   * Depends on: `txt`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt-width)
   */
  txtWidth: Maybe<Scalars['IntType']>;
  /**
   * Text String
   *
   * Sets the text string to render.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/text/txt)
   */
  txt: Maybe<Scalars['String']>;
  /**
   * Unsharp Mask
   *
   * Sharpens the source image using an unsharp mask.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/usm)
   */
  usm: Maybe<Scalars['IntType']>;
  /**
   * Unsharp Mask Radius
   *
   * Specifies the radius for an unsharp mask operation.
   *
   * Depends on: `usm`
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/usmrad)
   */
  usmrad: Maybe<Scalars['FloatType']>;
  /**
   * Vibrance
   *
   * Adjusts the vibrance of an image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/adjustment/vib)
   */
  vib: Maybe<Scalars['IntType']>;
  /**
   * Image Width
   *
   * Adjusts the width of the output image.
   *
   * [Open Imgix reference »](https://docs.imgix.com/apis/url/size/w)
   */
  w: Maybe<Scalars['FloatType']>;
};

export enum ImgixParamsAuto {
  Enhance = 'enhance',
  Format = 'format',
  Redeye = 'redeye',
  Compress = 'compress'
}

export enum ImgixParamsBlendAlign {
  Top = 'top',
  Bottom = 'bottom',
  Middle = 'middle',
  Left = 'left',
  Right = 'right',
  Center = 'center'
}

export enum ImgixParamsBlendCrop {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  Faces = 'faces'
}

export enum ImgixParamsBlendFit {
  Clamp = 'clamp',
  Clip = 'clip',
  Crop = 'crop',
  Scale = 'scale',
  Max = 'max'
}

export enum ImgixParamsBlendMode {
  Color = 'color',
  Burn = 'burn',
  Dodge = 'dodge',
  Darken = 'darken',
  Difference = 'difference',
  Exclusion = 'exclusion',
  Hardlight = 'hardlight',
  Hue = 'hue',
  Lighten = 'lighten',
  Luminosity = 'luminosity',
  Multiply = 'multiply',
  Overlay = 'overlay',
  Saturation = 'saturation',
  Screen = 'screen',
  Softlight = 'softlight',
  Normal = 'normal'
}

export enum ImgixParamsBlendSize {
  Inherit = 'inherit'
}

export enum ImgixParamsCh {
  Width = 'width',
  Dpr = 'dpr',
  SaveData = 'saveData'
}

export enum ImgixParamsCrop {
  Top = 'top',
  Bottom = 'bottom',
  Left = 'left',
  Right = 'right',
  Faces = 'faces',
  Entropy = 'entropy',
  Edges = 'edges',
  Focalpoint = 'focalpoint'
}

export enum ImgixParamsCs {
  Srgb = 'srgb',
  Adobergb1998 = 'adobergb1998',
  Tinysrgb = 'tinysrgb',
  Strip = 'strip'
}

export enum ImgixParamsFill {
  Solid = 'solid',
  Blur = 'blur'
}

export enum ImgixParamsFit {
  Clamp = 'clamp',
  Clip = 'clip',
  Crop = 'crop',
  Facearea = 'facearea',
  Fill = 'fill',
  Fillmax = 'fillmax',
  Max = 'max',
  Min = 'min',
  Scale = 'scale'
}

export enum ImgixParamsFlip {
  H = 'h',
  V = 'v',
  Hv = 'hv'
}

export enum ImgixParamsFm {
  Gif = 'gif',
  Jpg = 'jpg',
  Jp2 = 'jp2',
  Json = 'json',
  Jxr = 'jxr',
  Pjpg = 'pjpg',
  Mp4 = 'mp4',
  Png = 'png',
  Png8 = 'png8',
  Png32 = 'png32',
  Webp = 'webp',
  Webm = 'webm'
}

export enum ImgixParamsMarkAlign {
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom',
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

export enum ImgixParamsMarkFit {
  Clip = 'clip',
  Crop = 'crop',
  Fill = 'fill',
  Max = 'max',
  Scale = 'scale'
}

export enum ImgixParamsPalette {
  Css = 'css',
  Json = 'json'
}

export enum ImgixParamsTransparency {
  Grid = 'grid'
}

export enum ImgixParamsTrim {
  Auto = 'auto',
  Color = 'color'
}

export enum ImgixParamsTxtAlign {
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom',
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

export enum ImgixParamsTxtClip {
  Start = 'start',
  Middle = 'middle',
  End = 'end',
  Ellipsis = 'ellipsis'
}

export enum ImgixParamsTxtFit {
  Max = 'max'
}

/** Specifies how to filter by usage */
export type InUseFilter = {
  /** Search uploads that are currently used by some record or not */
  eq: Maybe<Scalars['BooleanType']>;
};



/** Specifies how to filter by ID */
export type ItemIdFilter = {
  /** Search the record with the specified ID */
  eq: Maybe<Scalars['ItemId']>;
  /** Exclude the record with the specified ID */
  neq: Maybe<Scalars['ItemId']>;
  /** Search records with the specified IDs */
  in: Maybe<Array<Maybe<Scalars['ItemId']>>>;
  /** Search records that do not have the specified IDs */
  notIn: Maybe<Array<Maybe<Scalars['ItemId']>>>;
};

export enum ItemStatus {
  Draft = 'draft',
  Updated = 'updated',
  Published = 'published'
}


/** Specifies how to filter Multiple-links fields */
export type LinksFilter = {
  /** Search for records with an exact match. The specified values must be Record IDs */
  eq: Maybe<Array<Maybe<Scalars['ItemId']>>>;
  /** Filter records linked to all of the specified records. The specified values must be Record IDs */
  allIn: Maybe<Array<Maybe<Scalars['ItemId']>>>;
  /** Filter records linked to at least one of the specified records. The specified values must be Record IDs */
  anyIn: Maybe<Array<Maybe<Scalars['ItemId']>>>;
  /** Filter records not linked to any of the specified records. The specified values must be Record IDs */
  notIn: Maybe<Array<Maybe<Scalars['ItemId']>>>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
};


export enum MuxThumbnailFormatType {
  Jpg = 'jpg',
  Png = 'png',
  Gif = 'gif'
}

/** Specifies how to filter by image orientation */
export type OrientationFilter = {
  /** Search uploads with the specified orientation */
  eq: Maybe<UploadOrientation>;
  /** Exclude uploads with the specified orientation */
  neq: Maybe<UploadOrientation>;
};

export type PageModelFilter = {
  _createdAt: Maybe<CreatedAtFilter>;
  createdAt: Maybe<CreatedAtFilter>;
  id: Maybe<ItemIdFilter>;
  _firstPublishedAt: Maybe<PublishedAtFilter>;
  _publicationScheduledAt: Maybe<PublishedAtFilter>;
  _unpublishingScheduledAt: Maybe<PublishedAtFilter>;
  _publishedAt: Maybe<PublishedAtFilter>;
  _status: Maybe<StatusFilter>;
  _updatedAt: Maybe<UpdatedAtFilter>;
  updatedAt: Maybe<UpdatedAtFilter>;
  _isValid: Maybe<BooleanFilter>;
  subtitle: Maybe<StringFilter>;
  content: Maybe<TextFilter>;
  slug: Maybe<SlugFilter>;
  title: Maybe<StringFilter>;
  OR: Maybe<Array<Maybe<PageModelFilter>>>;
};

export enum PageModelOrderBy {
  CreatedAtAsc = '_createdAt_ASC',
  CreatedAtDesc = '_createdAt_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  FirstPublishedAtAsc = '_firstPublishedAt_ASC',
  FirstPublishedAtDesc = '_firstPublishedAt_DESC',
  PublicationScheduledAtAsc = '_publicationScheduledAt_ASC',
  PublicationScheduledAtDesc = '_publicationScheduledAt_DESC',
  UnpublishingScheduledAtAsc = '_unpublishingScheduledAt_ASC',
  UnpublishingScheduledAtDesc = '_unpublishingScheduledAt_DESC',
  PublishedAtAsc = '_publishedAt_ASC',
  PublishedAtDesc = '_publishedAt_DESC',
  StatusAsc = '_status_ASC',
  StatusDesc = '_status_DESC',
  UpdatedAtAsc = '_updatedAt_ASC',
  UpdatedAtDesc = '_updatedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  IsValidAsc = '_isValid_ASC',
  IsValidDesc = '_isValid_DESC',
  SubtitleAsc = 'subtitle_ASC',
  SubtitleDesc = 'subtitle_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC'
}

/** Record of type Page (page) */
export type PageRecord = {
  _createdAt: Scalars['DateTime'];
  _firstPublishedAt: Maybe<Scalars['DateTime']>;
  _isValid: Scalars['BooleanType'];
  _modelApiKey: Scalars['String'];
  _publicationScheduledAt: Maybe<Scalars['DateTime']>;
  _publishedAt: Maybe<Scalars['DateTime']>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars['DateTime']>;
  _updatedAt: Scalars['DateTime'];
  content: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ItemId'];
  slug: Maybe<Scalars['String']>;
  subtitle: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};


/** Record of type Page (page) */
export type PageRecord_SeoMetaTagsArgs = {
  locale: Maybe<SiteLocale>;
};


/** Record of type Page (page) */
export type PageRecordContentArgs = {
  markdown: Maybe<Scalars['Boolean']>;
};

/** Specifies how to filter by position (sorted and tree-like collections) */
export type PositionFilter = {
  /** Filter records with a value that's strictly greater than the one specified */
  gt: Maybe<Scalars['IntType']>;
  /** Filter records with a value that's less than the one specified */
  lt: Maybe<Scalars['IntType']>;
  /** Filter records with a value that's greater than or equal to the one specified */
  gte: Maybe<Scalars['IntType']>;
  /** Filter records with a value that's less or equal than the one specified */
  lte: Maybe<Scalars['IntType']>;
  /** Search for records with an exact match */
  eq: Maybe<Scalars['IntType']>;
  /** Exclude records with an exact match */
  neq: Maybe<Scalars['IntType']>;
};

export type PostModelFilter = {
  _createdAt: Maybe<CreatedAtFilter>;
  createdAt: Maybe<CreatedAtFilter>;
  id: Maybe<ItemIdFilter>;
  _firstPublishedAt: Maybe<PublishedAtFilter>;
  _publicationScheduledAt: Maybe<PublishedAtFilter>;
  _unpublishingScheduledAt: Maybe<PublishedAtFilter>;
  _publishedAt: Maybe<PublishedAtFilter>;
  _status: Maybe<StatusFilter>;
  _updatedAt: Maybe<UpdatedAtFilter>;
  updatedAt: Maybe<UpdatedAtFilter>;
  _isValid: Maybe<BooleanFilter>;
  tags: Maybe<LinksFilter>;
  cover: Maybe<FileFilter>;
  subtitle: Maybe<StringFilter>;
  slug: Maybe<SlugFilter>;
  content: Maybe<TextFilter>;
  title: Maybe<StringFilter>;
  OR: Maybe<Array<Maybe<PostModelFilter>>>;
};

export enum PostModelOrderBy {
  CreatedAtAsc = '_createdAt_ASC',
  CreatedAtDesc = '_createdAt_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  FirstPublishedAtAsc = '_firstPublishedAt_ASC',
  FirstPublishedAtDesc = '_firstPublishedAt_DESC',
  PublicationScheduledAtAsc = '_publicationScheduledAt_ASC',
  PublicationScheduledAtDesc = '_publicationScheduledAt_DESC',
  UnpublishingScheduledAtAsc = '_unpublishingScheduledAt_ASC',
  UnpublishingScheduledAtDesc = '_unpublishingScheduledAt_DESC',
  PublishedAtAsc = '_publishedAt_ASC',
  PublishedAtDesc = '_publishedAt_DESC',
  StatusAsc = '_status_ASC',
  StatusDesc = '_status_DESC',
  UpdatedAtAsc = '_updatedAt_ASC',
  UpdatedAtDesc = '_updatedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  IsValidAsc = '_isValid_ASC',
  IsValidDesc = '_isValid_DESC',
  SubtitleAsc = 'subtitle_ASC',
  SubtitleDesc = 'subtitle_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC'
}

/** Record of type Post (post) */
export type PostRecord = {
  _createdAt: Scalars['DateTime'];
  _firstPublishedAt: Maybe<Scalars['DateTime']>;
  _isValid: Scalars['BooleanType'];
  _modelApiKey: Scalars['String'];
  _publicationScheduledAt: Maybe<Scalars['DateTime']>;
  _publishedAt: Maybe<Scalars['DateTime']>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars['DateTime']>;
  _updatedAt: Scalars['DateTime'];
  content: Maybe<Scalars['String']>;
  cover: Maybe<FileField>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ItemId'];
  slug: Maybe<Scalars['String']>;
  subtitle: Maybe<Scalars['String']>;
  tags: Array<TagRecord>;
  title: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};


/** Record of type Post (post) */
export type PostRecord_SeoMetaTagsArgs = {
  locale: Maybe<SiteLocale>;
};


/** Record of type Post (post) */
export type PostRecordContentArgs = {
  markdown: Maybe<Scalars['Boolean']>;
};

/** Specifies how to filter by publication datetime */
export type PublishedAtFilter = {
  /** Filter records with a value that's strictly greater than the one specified */
  gt: Maybe<Scalars['DateTime']>;
  /** Filter records with a value that's less than the one specified */
  lt: Maybe<Scalars['DateTime']>;
  /** Filter records with a value that's greater than or equal to than the one specified */
  gte: Maybe<Scalars['DateTime']>;
  /** Filter records with a value that's less or equal than the one specified */
  lte: Maybe<Scalars['DateTime']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
  /** Search for records with an exact match (seconds are truncated) */
  eq: Maybe<Scalars['DateTime']>;
  /** Exclude records with an exact match */
  neq: Maybe<Scalars['DateTime']>;
};

/** The query root for this schema */
export type Query = {
  /** Returns meta information regarding a record collection */
  _allAppearancesMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allPagesMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allPostsMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allShowcasesMeta: CollectionMetadata;
  /** Returns meta information regarding a record collection */
  _allTagsMeta: CollectionMetadata;
  /** Returns meta information regarding an assets collection */
  _allUploadsMeta: Maybe<CollectionMetadata>;
  /** Returns the single instance record */
  _site: Site;
  /** Returns the single instance record */
  about: Maybe<AboutRecord>;
  /** Returns a collection of records */
  allAppearances: Array<AppearanceRecord>;
  /** Returns a collection of records */
  allPages: Array<PageRecord>;
  /** Returns a collection of records */
  allPosts: Array<PostRecord>;
  /** Returns a collection of records */
  allShowcases: Array<ShowcaseRecord>;
  /** Returns a collection of records */
  allTags: Array<TagRecord>;
  /** Returns a collection of assets */
  allUploads: Array<FileField>;
  /** Returns a specific record */
  appearance: Maybe<AppearanceRecord>;
  /** Returns a specific record */
  page: Maybe<PageRecord>;
  /** Returns a specific record */
  post: Maybe<PostRecord>;
  /** Returns a specific record */
  showcase: Maybe<ShowcaseRecord>;
  /** Returns a specific record */
  tag: Maybe<TagRecord>;
  /** Returns a specific asset */
  upload: Maybe<FileField>;
};


/** The query root for this schema */
export type Query_AllAppearancesMetaArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<AppearanceModelFilter>;
};


/** The query root for this schema */
export type Query_AllPagesMetaArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<PageModelFilter>;
};


/** The query root for this schema */
export type Query_AllPostsMetaArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<PostModelFilter>;
};


/** The query root for this schema */
export type Query_AllShowcasesMetaArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<ShowcaseModelFilter>;
};


/** The query root for this schema */
export type Query_AllTagsMetaArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<TagModelFilter>;
};


/** The query root for this schema */
export type Query_AllUploadsMetaArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<UploadFilter>;
};


/** The query root for this schema */
export type Query_SiteArgs = {
  locale: Maybe<SiteLocale>;
};


/** The query root for this schema */
export type QueryAboutArgs = {
  locale: Maybe<SiteLocale>;
};


/** The query root for this schema */
export type QueryAllAppearancesArgs = {
  locale: Maybe<SiteLocale>;
  skip: Maybe<Scalars['IntType']>;
  first?: Maybe<Scalars['IntType']>;
  filter: Maybe<AppearanceModelFilter>;
  orderBy?: Maybe<Array<Maybe<AppearanceModelOrderBy>>>;
};


/** The query root for this schema */
export type QueryAllPagesArgs = {
  locale: Maybe<SiteLocale>;
  skip: Maybe<Scalars['IntType']>;
  first?: Maybe<Scalars['IntType']>;
  filter: Maybe<PageModelFilter>;
  orderBy?: Maybe<Array<Maybe<PageModelOrderBy>>>;
};


/** The query root for this schema */
export type QueryAllPostsArgs = {
  locale: Maybe<SiteLocale>;
  skip: Maybe<Scalars['IntType']>;
  first?: Maybe<Scalars['IntType']>;
  filter: Maybe<PostModelFilter>;
  orderBy?: Maybe<Array<Maybe<PostModelOrderBy>>>;
};


/** The query root for this schema */
export type QueryAllShowcasesArgs = {
  locale: Maybe<SiteLocale>;
  skip: Maybe<Scalars['IntType']>;
  first?: Maybe<Scalars['IntType']>;
  filter: Maybe<ShowcaseModelFilter>;
  orderBy?: Maybe<Array<Maybe<ShowcaseModelOrderBy>>>;
};


/** The query root for this schema */
export type QueryAllTagsArgs = {
  locale: Maybe<SiteLocale>;
  skip: Maybe<Scalars['IntType']>;
  first?: Maybe<Scalars['IntType']>;
  filter: Maybe<TagModelFilter>;
  orderBy?: Maybe<Array<Maybe<TagModelOrderBy>>>;
};


/** The query root for this schema */
export type QueryAllUploadsArgs = {
  locale: Maybe<SiteLocale>;
  skip: Maybe<Scalars['IntType']>;
  first?: Maybe<Scalars['IntType']>;
  filter: Maybe<UploadFilter>;
  orderBy?: Maybe<Array<Maybe<UploadOrderBy>>>;
};


/** The query root for this schema */
export type QueryAppearanceArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<AppearanceModelFilter>;
  orderBy?: Maybe<Array<Maybe<AppearanceModelOrderBy>>>;
};


/** The query root for this schema */
export type QueryPageArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<PageModelFilter>;
  orderBy?: Maybe<Array<Maybe<PageModelOrderBy>>>;
};


/** The query root for this schema */
export type QueryPostArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<PostModelFilter>;
  orderBy?: Maybe<Array<Maybe<PostModelOrderBy>>>;
};


/** The query root for this schema */
export type QueryShowcaseArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<ShowcaseModelFilter>;
  orderBy?: Maybe<Array<Maybe<ShowcaseModelOrderBy>>>;
};


/** The query root for this schema */
export type QueryTagArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<TagModelFilter>;
  orderBy?: Maybe<Array<Maybe<TagModelOrderBy>>>;
};


/** The query root for this schema */
export type QueryUploadArgs = {
  locale: Maybe<SiteLocale>;
  filter: Maybe<UploadFilter>;
  orderBy?: Maybe<Array<Maybe<UploadOrderBy>>>;
};

/** Specifies how to filter by upload type */
export type ResolutionFilter = {
  /** Search uploads with the specified resolution */
  eq: Maybe<ResolutionType>;
  /** Exclude uploads with the specified resolution */
  neq: Maybe<ResolutionType>;
  /** Search uploads with the specified resolutions */
  in: Maybe<Array<Maybe<ResolutionType>>>;
  /** Search uploads without the specified resolutions */
  notIn: Maybe<Array<Maybe<ResolutionType>>>;
};

export enum ResolutionType {
  Icon = 'icon',
  Small = 'small',
  Medium = 'medium',
  Large = 'large'
}

export type ResponsiveImage = {
  alt: Maybe<Scalars['String']>;
  aspectRatio: Scalars['FloatType'];
  base64: Maybe<Scalars['String']>;
  bgColor: Maybe<Scalars['String']>;
  height: Scalars['IntType'];
  sizes: Scalars['String'];
  src: Scalars['String'];
  srcSet: Scalars['String'];
  title: Maybe<Scalars['String']>;
  webpSrcSet: Scalars['String'];
  width: Scalars['IntType'];
};

export type SeoField = {
  description: Maybe<Scalars['String']>;
  image: Maybe<FileField>;
  title: Maybe<Scalars['String']>;
  twitterCard: Maybe<Scalars['String']>;
};

export type ShowcaseModelFilter = {
  _createdAt: Maybe<CreatedAtFilter>;
  createdAt: Maybe<CreatedAtFilter>;
  id: Maybe<ItemIdFilter>;
  _firstPublishedAt: Maybe<PublishedAtFilter>;
  position: Maybe<PositionFilter>;
  _publicationScheduledAt: Maybe<PublishedAtFilter>;
  _unpublishingScheduledAt: Maybe<PublishedAtFilter>;
  _publishedAt: Maybe<PublishedAtFilter>;
  _status: Maybe<StatusFilter>;
  _updatedAt: Maybe<UpdatedAtFilter>;
  updatedAt: Maybe<UpdatedAtFilter>;
  _isValid: Maybe<BooleanFilter>;
  subtitle: Maybe<StringFilter>;
  tags: Maybe<LinksFilter>;
  url: Maybe<StringFilter>;
  image: Maybe<FileFilter>;
  title: Maybe<StringFilter>;
  OR: Maybe<Array<Maybe<ShowcaseModelFilter>>>;
};

export enum ShowcaseModelOrderBy {
  CreatedAtAsc = '_createdAt_ASC',
  CreatedAtDesc = '_createdAt_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  FirstPublishedAtAsc = '_firstPublishedAt_ASC',
  FirstPublishedAtDesc = '_firstPublishedAt_DESC',
  PositionAsc = 'position_ASC',
  PositionDesc = 'position_DESC',
  PublicationScheduledAtAsc = '_publicationScheduledAt_ASC',
  PublicationScheduledAtDesc = '_publicationScheduledAt_DESC',
  UnpublishingScheduledAtAsc = '_unpublishingScheduledAt_ASC',
  UnpublishingScheduledAtDesc = '_unpublishingScheduledAt_DESC',
  PublishedAtAsc = '_publishedAt_ASC',
  PublishedAtDesc = '_publishedAt_DESC',
  StatusAsc = '_status_ASC',
  StatusDesc = '_status_DESC',
  UpdatedAtAsc = '_updatedAt_ASC',
  UpdatedAtDesc = '_updatedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  IsValidAsc = '_isValid_ASC',
  IsValidDesc = '_isValid_DESC',
  SubtitleAsc = 'subtitle_ASC',
  SubtitleDesc = 'subtitle_DESC',
  UrlAsc = 'url_ASC',
  UrlDesc = 'url_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC'
}

/** Record of type Showcase (showcase) */
export type ShowcaseRecord = {
  _createdAt: Scalars['DateTime'];
  _firstPublishedAt: Maybe<Scalars['DateTime']>;
  _isValid: Scalars['BooleanType'];
  _modelApiKey: Scalars['String'];
  _publicationScheduledAt: Maybe<Scalars['DateTime']>;
  _publishedAt: Maybe<Scalars['DateTime']>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars['DateTime']>;
  _updatedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ItemId'];
  image: Maybe<FileField>;
  position: Maybe<Scalars['IntType']>;
  subtitle: Maybe<Scalars['String']>;
  tags: Array<TagRecord>;
  title: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  url: Maybe<Scalars['String']>;
};


/** Record of type Showcase (showcase) */
export type ShowcaseRecord_SeoMetaTagsArgs = {
  locale: Maybe<SiteLocale>;
};

export type Site = {
  favicon: Maybe<FileField>;
  faviconMetaTags: Array<Tag>;
  globalSeo: Maybe<GlobalSeoField>;
};


export type SiteFaviconMetaTagsArgs = {
  variants?: Maybe<Array<Maybe<FaviconType>>>;
};


export type SiteGlobalSeoArgs = {
  locale: Maybe<SiteLocale>;
};

export enum SiteLocale {
  En = 'en'
}

/** Specifies how to filter Slug fields */
export type SlugFilter = {
  /** Search for records with an exact match */
  eq: Maybe<Scalars['String']>;
  /** Exclude records with an exact match */
  neq: Maybe<Scalars['String']>;
  /** Filter records that have one of the specified slugs */
  in: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Filter records that do have one of the specified slugs */
  notIn: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Specifies how to filter by status */
export type StatusFilter = {
  /** Search the record with the specified status */
  eq: Maybe<ItemStatus>;
  /** Exclude the record with the specified status */
  neq: Maybe<ItemStatus>;
  /** Search records with the specified statuses */
  in: Maybe<Array<Maybe<ItemStatus>>>;
  /** Search records without the specified statuses */
  notIn: Maybe<Array<Maybe<ItemStatus>>>;
};

/** Specifies how to filter Single-line string fields */
export type StringFilter = {
  /** Filter records based on a regular expression */
  matches: Maybe<StringMatchesFilter>;
  /** Exclude records based on a regular expression */
  notMatches: Maybe<StringMatchesFilter>;
  /** Filter records with the specified field set as blank (null or empty string) */
  isBlank: Maybe<Scalars['BooleanType']>;
  /** Search for records with an exact match */
  eq: Maybe<Scalars['String']>;
  /** Exclude records with an exact match */
  neq: Maybe<Scalars['String']>;
  /** Filter records that equal one of the specified values */
  in: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Filter records that do not equal one of the specified values */
  notIn: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
};

export type StringMatchesFilter = {
  pattern: Scalars['String'];
  caseSensitive: Maybe<Scalars['BooleanType']>;
  regexp: Maybe<Scalars['BooleanType']>;
};

export type Tag = {
  attributes: Maybe<Scalars['MetaTagAttributes']>;
  content: Maybe<Scalars['String']>;
  tag: Scalars['String'];
};

export type TagModelFilter = {
  _createdAt: Maybe<CreatedAtFilter>;
  createdAt: Maybe<CreatedAtFilter>;
  id: Maybe<ItemIdFilter>;
  _firstPublishedAt: Maybe<PublishedAtFilter>;
  _publicationScheduledAt: Maybe<PublishedAtFilter>;
  _unpublishingScheduledAt: Maybe<PublishedAtFilter>;
  _publishedAt: Maybe<PublishedAtFilter>;
  _status: Maybe<StatusFilter>;
  _updatedAt: Maybe<UpdatedAtFilter>;
  updatedAt: Maybe<UpdatedAtFilter>;
  _isValid: Maybe<BooleanFilter>;
  slug: Maybe<SlugFilter>;
  title: Maybe<StringFilter>;
  OR: Maybe<Array<Maybe<TagModelFilter>>>;
};

export enum TagModelOrderBy {
  CreatedAtAsc = '_createdAt_ASC',
  CreatedAtDesc = '_createdAt_DESC',
  CreatedAtAsc = 'createdAt_ASC',
  CreatedAtDesc = 'createdAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC',
  FirstPublishedAtAsc = '_firstPublishedAt_ASC',
  FirstPublishedAtDesc = '_firstPublishedAt_DESC',
  PublicationScheduledAtAsc = '_publicationScheduledAt_ASC',
  PublicationScheduledAtDesc = '_publicationScheduledAt_DESC',
  UnpublishingScheduledAtAsc = '_unpublishingScheduledAt_ASC',
  UnpublishingScheduledAtDesc = '_unpublishingScheduledAt_DESC',
  PublishedAtAsc = '_publishedAt_ASC',
  PublishedAtDesc = '_publishedAt_DESC',
  StatusAsc = '_status_ASC',
  StatusDesc = '_status_DESC',
  UpdatedAtAsc = '_updatedAt_ASC',
  UpdatedAtDesc = '_updatedAt_DESC',
  UpdatedAtAsc = 'updatedAt_ASC',
  UpdatedAtDesc = 'updatedAt_DESC',
  IsValidAsc = '_isValid_ASC',
  IsValidDesc = '_isValid_DESC',
  TitleAsc = 'title_ASC',
  TitleDesc = 'title_DESC'
}

/** Record of type Tag (tag) */
export type TagRecord = {
  _createdAt: Scalars['DateTime'];
  _firstPublishedAt: Maybe<Scalars['DateTime']>;
  _isValid: Scalars['BooleanType'];
  _modelApiKey: Scalars['String'];
  _publicationScheduledAt: Maybe<Scalars['DateTime']>;
  _publishedAt: Maybe<Scalars['DateTime']>;
  /** SEO meta tags */
  _seoMetaTags: Array<Tag>;
  _status: ItemStatus;
  _unpublishingScheduledAt: Maybe<Scalars['DateTime']>;
  _updatedAt: Scalars['DateTime'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ItemId'];
  slug: Maybe<Scalars['String']>;
  title: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};


/** Record of type Tag (tag) */
export type TagRecord_SeoMetaTagsArgs = {
  locale: Maybe<SiteLocale>;
};

/** Specifies how to filter text fields */
export type TextFilter = {
  /** Filter records based on a regular expression */
  matches: Maybe<StringMatchesFilter>;
  /** Exclude records based on a regular expression */
  notMatches: Maybe<StringMatchesFilter>;
  /** Filter records with the specified field set as blank (null or empty string) */
  isBlank: Maybe<Scalars['BooleanType']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
};

/** Specifies how to filter by upload type */
export type TypeFilter = {
  /** Search uploads with the specified type */
  eq: Maybe<UploadType>;
  /** Exclude uploads with the specified type */
  neq: Maybe<UploadType>;
  /** Search uploads with the specified types */
  in: Maybe<Array<Maybe<UploadType>>>;
  /** Search uploads without the specified types */
  notIn: Maybe<Array<Maybe<UploadType>>>;
};

/** Specifies how to filter by update datetime */
export type UpdatedAtFilter = {
  /** Filter records with a value that's strictly greater than the one specified */
  gt: Maybe<Scalars['DateTime']>;
  /** Filter records with a value that's less than the one specified */
  lt: Maybe<Scalars['DateTime']>;
  /** Filter records with a value that's greater than or equal to than the one specified */
  gte: Maybe<Scalars['DateTime']>;
  /** Filter records with a value that's less or equal than the one specified */
  lte: Maybe<Scalars['DateTime']>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
  /** Search for records with an exact match (seconds are truncated) */
  eq: Maybe<Scalars['DateTime']>;
  /** Exclude records with an exact match */
  neq: Maybe<Scalars['DateTime']>;
};

/** Specifies how to filter by default alt */
export type UploadAltFilter = {
  /** Filter uploads based on a regular expression */
  matches: Maybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: Maybe<StringMatchesFilter>;
  /** Search the uploads with the specified alt */
  eq: Maybe<Scalars['String']>;
  /** Exclude the uploads with the specified alt */
  neq: Maybe<Scalars['String']>;
  /** Search uploads with the specified values as default alt */
  in: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Search uploads that do not have the specified values as default alt */
  notIn: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Filter uploads with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
};

/** Specifies how to filter by auhtor */
export type UploadAuthorFilter = {
  /** Filter uploads based on a regular expression */
  matches: Maybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: Maybe<StringMatchesFilter>;
  /** Filter uploads with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
};

/** Specifies how to filter by basename */
export type UploadBasenameFilter = {
  /** Filter uploads based on a regular expression */
  matches: Maybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: Maybe<StringMatchesFilter>;
};

/** Specifies how to filter by colors */
export type UploadColorsFilter = {
  /** Filter uploads that have the specified colors */
  contains: Maybe<ColorBucketType>;
  /** Filter uploads that have all of the specified colors */
  allIn: Maybe<Array<Maybe<ColorBucketType>>>;
  /** Filter uploads that have at least one of the specified colors */
  anyIn: Maybe<Array<Maybe<ColorBucketType>>>;
  /** Filter uploads that do not have any of the specified colors */
  notIn: Maybe<Array<Maybe<ColorBucketType>>>;
  /** Search for uploads with an exact match */
  eq: Maybe<Array<Maybe<ColorBucketType>>>;
};

/** Specifies how to filter by copyright */
export type UploadCopyrightFilter = {
  /** Filter uploads based on a regular expression */
  matches: Maybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: Maybe<StringMatchesFilter>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
};

/** Specifies how to filter by creation datetime */
export type UploadCreatedAtFilter = {
  /** Search for uploads with an exact match */
  eq: Maybe<Scalars['DateTime']>;
  /** Exclude uploads with an exact match */
  neq: Maybe<Scalars['DateTime']>;
  /** Filter uploads with a value that's less than the one specified */
  lt: Maybe<Scalars['DateTime']>;
  /** Filter uploads with a value that's less or equal than the one specified */
  lte: Maybe<Scalars['DateTime']>;
  /** Filter uploads with a value that's strictly greater than the one specified */
  gt: Maybe<Scalars['DateTime']>;
  /** Filter uploads with a value that's greater than or equal to the one specified */
  gte: Maybe<Scalars['DateTime']>;
};

/** Specifies how to filter by filename */
export type UploadFilenameFilter = {
  /** Filter uploads based on a regular expression */
  matches: Maybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: Maybe<StringMatchesFilter>;
};

export type UploadFilter = {
  type: Maybe<TypeFilter>;
  inUse: Maybe<InUseFilter>;
  resolution: Maybe<ResolutionFilter>;
  size: Maybe<UploadSizeFilter>;
  tags: Maybe<UploadTagsFilter>;
  smartTags: Maybe<UploadTagsFilter>;
  colors: Maybe<UploadColorsFilter>;
  orientation: Maybe<OrientationFilter>;
  id: Maybe<UploadIdFilter>;
  mimeType: Maybe<UploadMimeTypeFilter>;
  format: Maybe<UploadFormatFilter>;
  height: Maybe<UploadHeightFilter>;
  width: Maybe<UploadWidthFilter>;
  alt: Maybe<UploadAltFilter>;
  title: Maybe<UploadTitleFilter>;
  notes: Maybe<UploadNotesFilter>;
  md5: Maybe<UploadMd5Filter>;
  author: Maybe<UploadAuthorFilter>;
  copyright: Maybe<UploadCopyrightFilter>;
  basename: Maybe<UploadBasenameFilter>;
  filename: Maybe<UploadFilenameFilter>;
  _createdAt: Maybe<UploadCreatedAtFilter>;
  _updatedAt: Maybe<UploadUpdatedAtFilter>;
  OR: Maybe<Array<Maybe<UploadFilter>>>;
};

/** Specifies how to filter by format */
export type UploadFormatFilter = {
  /** Search the asset with the specified format */
  eq: Maybe<Scalars['String']>;
  /** Exclude the asset with the specified format */
  neq: Maybe<Scalars['String']>;
  /** Search assets with the specified formats */
  in: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Search assets that do not have the specified formats */
  notIn: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Specifies how to filter by height */
export type UploadHeightFilter = {
  /** Search all assets larger than the specified height */
  gt: Maybe<Scalars['IntType']>;
  /** Search all assets smaller than the specified height */
  lt: Maybe<Scalars['IntType']>;
  /** Search all assets larger or equal to the specified height */
  gte: Maybe<Scalars['IntType']>;
  /** Search all assets larger or equal to the specified height */
  lte: Maybe<Scalars['IntType']>;
  /** Search assets with the specified height */
  eq: Maybe<Scalars['IntType']>;
  /** Search assets that do not have the specified height */
  neq: Maybe<Scalars['IntType']>;
};


/** Specifies how to filter by ID */
export type UploadIdFilter = {
  /** Search the asset with the specified ID */
  eq: Maybe<Scalars['UploadId']>;
  /** Exclude the asset with the specified ID */
  neq: Maybe<Scalars['UploadId']>;
  /** Search assets with the specified IDs */
  in: Maybe<Array<Maybe<Scalars['UploadId']>>>;
  /** Search assets that do not have the specified IDs */
  notIn: Maybe<Array<Maybe<Scalars['UploadId']>>>;
};

/** Specifies how to filter by MD5 */
export type UploadMd5Filter = {
  /** Search the asset with the specified MD5 */
  eq: Maybe<Scalars['String']>;
  /** Exclude the asset with the specified MD5 */
  neq: Maybe<Scalars['String']>;
  /** Search assets with the specified MD5s */
  in: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Search assets that do not have the specified MD5s */
  notIn: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Specifies how to filter by mime type */
export type UploadMimeTypeFilter = {
  /** Filter uploads based on a regular expression */
  matches: Maybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: Maybe<StringMatchesFilter>;
  /** Search the asset with the specified mime type */
  eq: Maybe<Scalars['String']>;
  /** Exclude the asset with the specified mime type */
  neq: Maybe<Scalars['String']>;
  /** Search assets with the specified mime types */
  in: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Search assets that do not have the specified mime types */
  notIn: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Specifies how to filter by notes */
export type UploadNotesFilter = {
  /** Filter uploads based on a regular expression */
  matches: Maybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: Maybe<StringMatchesFilter>;
  /** Filter records with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
};

export enum UploadOrderBy {
  CreatedAtAsc = '_createdAt_ASC',
  CreatedAtDesc = '_createdAt_DESC',
  SizeAsc = 'size_ASC',
  SizeDesc = 'size_DESC',
  ResolutionAsc = 'resolution_ASC',
  ResolutionDesc = 'resolution_DESC',
  FilenameAsc = 'filename_ASC',
  FilenameDesc = 'filename_DESC',
  BasenameAsc = 'basename_ASC',
  BasenameDesc = 'basename_DESC',
  MimeTypeAsc = 'mimeType_ASC',
  MimeTypeDesc = 'mimeType_DESC',
  FormatAsc = 'format_ASC',
  FormatDesc = 'format_DESC',
  UpdatedAtAsc = '_updatedAt_ASC',
  UpdatedAtDesc = '_updatedAt_DESC',
  IdAsc = 'id_ASC',
  IdDesc = 'id_DESC'
}

export enum UploadOrientation {
  Landscape = 'landscape',
  Portrait = 'portrait',
  Square = 'square'
}

/** Specifies how to filter by size */
export type UploadSizeFilter = {
  /** Search all assets larger than the specified size */
  gt: Maybe<Scalars['IntType']>;
  /** Search all assets smaller than the specified size */
  lt: Maybe<Scalars['IntType']>;
  /** Search all assets larger or equal to the specified size */
  gte: Maybe<Scalars['IntType']>;
  /** Search all assets larger or equal to the specified size */
  lte: Maybe<Scalars['IntType']>;
  /** Search assets with the specified size */
  eq: Maybe<Scalars['IntType']>;
  /** Search assets that do not have the specified size */
  neq: Maybe<Scalars['IntType']>;
};

/** Specifies how to filter by tags */
export type UploadTagsFilter = {
  /** Filter uploads linked to the specified tag */
  contains: Maybe<Scalars['String']>;
  /** Filter uploads linked to all of the specified tags */
  allIn: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Filter uploads linked to at least one of the specified tags */
  anyIn: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Filter uploads not linked to any of the specified tags */
  notIn: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Search for uploads with an exact match */
  eq: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Specifies how to filter by default title */
export type UploadTitleFilter = {
  /** Filter uploads based on a regular expression */
  matches: Maybe<StringMatchesFilter>;
  /** Exclude uploads based on a regular expression */
  notMatches: Maybe<StringMatchesFilter>;
  /** Search the asset with the specified title */
  eq: Maybe<Scalars['String']>;
  /** Exclude the asset with the specified title */
  neq: Maybe<Scalars['String']>;
  /** Search assets with the specified as default title */
  in: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Search assets that do not have the specified as default title */
  notIn: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Filter assets with the specified field defined (i.e. with any value) or not */
  exists: Maybe<Scalars['BooleanType']>;
};

export enum UploadType {
  Image = 'image',
  Audio = 'audio',
  Video = 'video',
  Richtext = 'richtext',
  Presentation = 'presentation',
  Spreadsheet = 'spreadsheet',
  Pdfdocument = 'pdfdocument',
  Archive = 'archive'
}

/** Specifies how to filter by update datetime */
export type UploadUpdatedAtFilter = {
  /** Search for uploads with an exact match */
  eq: Maybe<Scalars['DateTime']>;
  /** Exclude uploads with an exact match */
  neq: Maybe<Scalars['DateTime']>;
  /** Filter uploads with a value that's less than the one specified */
  lt: Maybe<Scalars['DateTime']>;
  /** Filter uploads with a value that's less or equal than the one specified */
  lte: Maybe<Scalars['DateTime']>;
  /** Filter uploads with a value that's strictly greater than the one specified */
  gt: Maybe<Scalars['DateTime']>;
  /** Filter uploads with a value that's greater than or equal to the one specified */
  gte: Maybe<Scalars['DateTime']>;
};

export type UploadVideoField = {
  duration: Scalars['Int'];
  framerate: Scalars['Int'];
  mp4Url: Maybe<Scalars['String']>;
  muxAssetId: Scalars['String'];
  muxPlaybackId: Scalars['String'];
  streamingUrl: Scalars['String'];
  thumbnailUrl: Scalars['String'];
};


export type UploadVideoFieldMp4UrlArgs = {
  res: Maybe<VideoMp4Res>;
  exactRes: Maybe<VideoMp4Res>;
};


export type UploadVideoFieldThumbnailUrlArgs = {
  format?: Maybe<MuxThumbnailFormatType>;
};

/** Specifies how to filter by width */
export type UploadWidthFilter = {
  /** Search all assets larger than the specified width */
  gt: Maybe<Scalars['IntType']>;
  /** Search all assets smaller than the specified width */
  lt: Maybe<Scalars['IntType']>;
  /** Search all assets larger or equal to the specified width */
  gte: Maybe<Scalars['IntType']>;
  /** Search all assets larger or equal to the specified width */
  lte: Maybe<Scalars['IntType']>;
  /** Search assets with the specified width */
  eq: Maybe<Scalars['IntType']>;
  /** Search assets that do not have the specified width */
  neq: Maybe<Scalars['IntType']>;
};

export enum VideoMp4Res {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export type FocalPoint = {
  x: Maybe<Scalars['FloatType']>;
  y: Maybe<Scalars['FloatType']>;
};

export const AppearanceFragmentDoc = /*#__PURE__*/ gql`
    fragment AppearanceFragment on AppearanceRecord {
  id
  title
  subtitle
  date
  tags {
    title
    slug
  }
  url
  category
}
    `;
export const PageFieldsFragmentDoc = /*#__PURE__*/ gql`
    fragment PageFields on PageRecord {
  _seoMetaTags {
    attributes
    content
    tag
  }
  _updatedAt
  title
  subtitle
  slug
  content
}
    `;
export const ResponsiveImageFieldsFragmentDoc = /*#__PURE__*/ gql`
    fragment ResponsiveImageFields on ResponsiveImage {
  alt
  aspectRatio
  base64
  height
  sizes
  src
  srcSet
  title
  webpSrcSet
  width
}
    `;
export const PostMetaFieldsFragmentDoc = /*#__PURE__*/ gql`
    fragment PostMetaFields on PostRecord {
  _publishedAt
  _updatedAt
  cover {
    responsiveImage {
      ...ResponsiveImageFields
    }
  }
  title
  slug
  subtitle
  tags {
    slug
    title
  }
}
    ${ResponsiveImageFieldsFragmentDoc}`;
export const PostFieldsFragmentDoc = /*#__PURE__*/ gql`
    fragment PostFields on PostRecord {
  _seoMetaTags {
    attributes
    content
    tag
  }
  ...PostMetaFields
  content
}
    ${PostMetaFieldsFragmentDoc}`;
export const ShowcaseFragmentDoc = /*#__PURE__*/ gql`
    fragment ShowcaseFragment on ShowcaseRecord {
  id
  image {
    responsiveImage(imgixParams: {ar: "16:9", fit: crop}) {
      ...ResponsiveImageFields
    }
  }
  title
  subtitle
  tags {
    title
    slug
  }
  url
}
    ${ResponsiveImageFieldsFragmentDoc}`;
export const AboutStaticPropsDocument = /*#__PURE__*/ gql`
    query aboutStaticProps {
  about {
    coverImage {
      responsiveImage {
        ...ResponsiveImageFields
      }
    }
    knowledgeBases {
      title
      entries
    }
    preface
    updatedAt
  }
}
    ${ResponsiveImageFieldsFragmentDoc}`;
export const AppearancesStaticPropsDocument = /*#__PURE__*/ gql`
    query appearancesStaticProps {
  allAppearances(orderBy: date_DESC) {
    ...AppearanceFragment
  }
}
    ${AppearanceFragmentDoc}`;
export const HomeStaticPropsDocument = /*#__PURE__*/ gql`
    query homeStaticProps {
  site: _site {
    favicon {
      responsiveImage(imgixParams: {bg: "00000000", fm: png}) {
        ...ResponsiveImageFields
      }
    }
  }
}
    ${ResponsiveImageFieldsFragmentDoc}`;
export const GetPageDocument = /*#__PURE__*/ gql`
    query getPage($slug: String!) {
  page(filter: {slug: {eq: $slug}}) {
    ...PageFields
  }
}
    ${PageFieldsFragmentDoc}`;
export const PageStaticPathsDocument = /*#__PURE__*/ gql`
    query pageStaticPaths($skip: IntType) {
  allPages(first: 100, orderBy: title_ASC, skip: $skip) {
    slug
  }
}
    `;
export const GetPostsDocument = /*#__PURE__*/ gql`
    query getPosts($skip: IntType) {
  allPosts(orderBy: _publishedAt_ASC, skip: $skip) {
    ...PostMetaFields
  }
}
    ${PostMetaFieldsFragmentDoc}
${ResponsiveImageFieldsFragmentDoc}`;
export const GetPostDocument = /*#__PURE__*/ gql`
    query getPost($slug: String!) {
  post(filter: {slug: {eq: $slug}}) {
    ...PostFields
  }
}
    ${PostFieldsFragmentDoc}
${PostMetaFieldsFragmentDoc}
${ResponsiveImageFieldsFragmentDoc}`;
export const PostStaticPathsDocument = /*#__PURE__*/ gql`
    query postStaticPaths($skip: IntType) {
  allPosts(first: 100, orderBy: title_ASC, skip: $skip) {
    slug
  }
}
    `;
export const ProjectsStaticPropsDocument = /*#__PURE__*/ gql`
    query projectsStaticProps {
  allShowcases(orderBy: position_ASC) {
    ...ShowcaseFragment
  }
}
    ${ShowcaseFragmentDoc}
${ResponsiveImageFieldsFragmentDoc}`;
export const WebsiteSeoTagsDocument = /*#__PURE__*/ gql`
    query websiteSeoTags {
  about {
    email
    socialsJson
  }
  site: _site {
    favicon: faviconMetaTags(variants: [appleTouchIcon, icon, msApplication]) {
      attributes
      content
      tag
    }
    seo: globalSeo {
      fallback: fallbackSeo {
        description
        image {
          url
          width
          height
        }
        title
        twitterCard
      }
      siteName
      titleSuffix
      twitterAccount
    }
  }
}
    `;
export const TagsStaticPathsDocument = /*#__PURE__*/ gql`
    query tagsStaticPaths($skip: IntType) {
  allTags(first: 100, orderBy: title_ASC, skip: $skip) {
    slug
  }
}
    `;
export const TagSlugLookupDocument = /*#__PURE__*/ gql`
    query tagSlugLookup($slug: String!) {
  tag(filter: {slug: {eq: $slug}}) {
    id
    title
    slug
  }
}
    `;
export const TagRelationsDocument = /*#__PURE__*/ gql`
    query tagRelations($id: ItemId!) {
  allAppearances(filter: {tags: {anyIn: [$id]}}) {
    ...AppearanceFragment
  }
  allShowcases(filter: {tags: {anyIn: [$id]}}) {
    ...ShowcaseFragment
  }
}
    ${AppearanceFragmentDoc}
${ShowcaseFragmentDoc}
${ResponsiveImageFieldsFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    aboutStaticProps(variables?: AboutStaticPropsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AboutStaticPropsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AboutStaticPropsQuery>(AboutStaticPropsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'aboutStaticProps');
    },
    appearancesStaticProps(variables?: AppearancesStaticPropsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AppearancesStaticPropsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AppearancesStaticPropsQuery>(AppearancesStaticPropsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'appearancesStaticProps');
    },
    homeStaticProps(variables?: HomeStaticPropsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<HomeStaticPropsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HomeStaticPropsQuery>(HomeStaticPropsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'homeStaticProps');
    },
    getPage(variables: GetPageQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPageQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPageQuery>(GetPageDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPage');
    },
    pageStaticPaths(variables?: PageStaticPathsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PageStaticPathsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PageStaticPathsQuery>(PageStaticPathsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'pageStaticPaths');
    },
    getPosts(variables?: GetPostsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPostsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPostsQuery>(GetPostsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPosts');
    },
    getPost(variables: GetPostQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPostQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPostQuery>(GetPostDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPost');
    },
    postStaticPaths(variables?: PostStaticPathsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PostStaticPathsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PostStaticPathsQuery>(PostStaticPathsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'postStaticPaths');
    },
    projectsStaticProps(variables?: ProjectsStaticPropsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProjectsStaticPropsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProjectsStaticPropsQuery>(ProjectsStaticPropsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'projectsStaticProps');
    },
    websiteSeoTags(variables?: WebsiteSeoTagsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<WebsiteSeoTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WebsiteSeoTagsQuery>(WebsiteSeoTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'websiteSeoTags');
    },
    tagsStaticPaths(variables?: TagsStaticPathsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TagsStaticPathsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TagsStaticPathsQuery>(TagsStaticPathsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'tagsStaticPaths');
    },
    tagSlugLookup(variables: TagSlugLookupQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TagSlugLookupQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TagSlugLookupQuery>(TagSlugLookupDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'tagSlugLookup');
    },
    tagRelations(variables: TagRelationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<TagRelationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TagRelationsQuery>(TagRelationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'tagRelations');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export type AboutStaticPropsQueryVariables = Exact<{ [key: string]: never; }>;


export type AboutStaticPropsQuery = { about: Maybe<(
    Pick<AboutRecord, 'preface' | 'updatedAt'>
    & { coverImage: Maybe<{ responsiveImage: Maybe<ResponsiveImageFieldsFragment> }>, knowledgeBases: Maybe<Array<Maybe<Pick<EntryRecord, 'title' | 'entries'>>>> }
  )> };

export type AppearanceFragment = (
  Pick<AppearanceRecord, 'id' | 'title' | 'subtitle' | 'date' | 'url' | 'category'>
  & { tags: Array<Pick<TagRecord, 'title' | 'slug'>> }
);

export type AppearancesStaticPropsQueryVariables = Exact<{ [key: string]: never; }>;


export type AppearancesStaticPropsQuery = { allAppearances: Array<AppearanceFragment> };

export type ResponsiveImageFieldsFragment = Pick<ResponsiveImage, 'alt' | 'aspectRatio' | 'base64' | 'height' | 'sizes' | 'src' | 'srcSet' | 'title' | 'webpSrcSet' | 'width'>;

export type HomeStaticPropsQueryVariables = Exact<{ [key: string]: never; }>;


export type HomeStaticPropsQuery = { site: { favicon: Maybe<{ responsiveImage: Maybe<ResponsiveImageFieldsFragment> }> } };

export type PageFieldsFragment = (
  Pick<PageRecord, '_updatedAt' | 'title' | 'subtitle' | 'slug' | 'content'>
  & { _seoMetaTags: Array<Pick<Tag, 'attributes' | 'content' | 'tag'>> }
);

export type GetPageQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type GetPageQuery = { page: Maybe<PageFieldsFragment> };

export type PageStaticPathsQueryVariables = Exact<{
  skip: Maybe<Scalars['IntType']>;
}>;


export type PageStaticPathsQuery = { allPages: Array<Pick<PageRecord, 'slug'>> };

export type PostMetaFieldsFragment = (
  Pick<PostRecord, '_publishedAt' | '_updatedAt' | 'title' | 'slug' | 'subtitle'>
  & { cover: Maybe<{ responsiveImage: Maybe<ResponsiveImageFieldsFragment> }>, tags: Array<Pick<TagRecord, 'slug' | 'title'>> }
);

export type PostFieldsFragment = (
  Pick<PostRecord, 'content'>
  & { _seoMetaTags: Array<Pick<Tag, 'attributes' | 'content' | 'tag'>> }
  & PostMetaFieldsFragment
);

export type GetPostsQueryVariables = Exact<{
  skip: Maybe<Scalars['IntType']>;
}>;


export type GetPostsQuery = { allPosts: Array<PostMetaFieldsFragment> };

export type GetPostQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type GetPostQuery = { post: Maybe<PostFieldsFragment> };

export type PostStaticPathsQueryVariables = Exact<{
  skip: Maybe<Scalars['IntType']>;
}>;


export type PostStaticPathsQuery = { allPosts: Array<Pick<PostRecord, 'slug'>> };

export type ShowcaseFragment = (
  Pick<ShowcaseRecord, 'id' | 'title' | 'subtitle' | 'url'>
  & { image: Maybe<{ responsiveImage: Maybe<ResponsiveImageFieldsFragment> }>, tags: Array<Pick<TagRecord, 'title' | 'slug'>> }
);

export type ProjectsStaticPropsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectsStaticPropsQuery = { allShowcases: Array<ShowcaseFragment> };

export type WebsiteSeoTagsQueryVariables = Exact<{ [key: string]: never; }>;


export type WebsiteSeoTagsQuery = { about: Maybe<Pick<AboutRecord, 'email' | 'socialsJson'>>, site: { favicon: Array<Pick<Tag, 'attributes' | 'content' | 'tag'>>, seo: Maybe<(
      Pick<GlobalSeoField, 'siteName' | 'titleSuffix' | 'twitterAccount'>
      & { fallback: Maybe<(
        Pick<SeoField, 'description' | 'title' | 'twitterCard'>
        & { image: Maybe<Pick<FileField, 'url' | 'width' | 'height'>> }
      )> }
    )> } };

export type TagsStaticPathsQueryVariables = Exact<{
  skip: Maybe<Scalars['IntType']>;
}>;


export type TagsStaticPathsQuery = { allTags: Array<Pick<TagRecord, 'slug'>> };

export type TagSlugLookupQueryVariables = Exact<{
  slug: Scalars['String'];
}>;


export type TagSlugLookupQuery = { tag: Maybe<Pick<TagRecord, 'id' | 'title' | 'slug'>> };

export type TagRelationsQueryVariables = Exact<{
  id: Scalars['ItemId'];
}>;


export type TagRelationsQuery = { allAppearances: Array<AppearanceFragment>, allShowcases: Array<ShowcaseFragment> };
