import { gql } from "graphql-request";

export const WEBSITE_SEO_TAGS = gql`
  query websiteSeoTags {
    about {
      email
      siteUrl
      dashboardUrl
      socialsJson
    }
    site: _site {
      favicon: faviconMetaTags(
        variants: [appleTouchIcon, icon, msApplication]
      ) {
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
