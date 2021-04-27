import { gql } from "graphql-request";

export const ABOUT_STATIC_PROPS = gql`
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
`;
