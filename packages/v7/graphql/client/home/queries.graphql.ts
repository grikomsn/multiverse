import { gql } from "graphql-request";

export const HOME_STATIC_PROPS = gql`
  query homeStaticProps {
    site: _site {
      favicon {
        responsiveImage(imgixParams: { bg: "00000000", fm: png }) {
          ...ResponsiveImageFields
        }
      }
    }
  }
`;
