import { gql } from "graphql-request";

export const PROJECTS_STATIC_PROPS = gql`
  query projectsStaticProps {
    allShowcases(orderBy: position_ASC) {
      id
      image {
        # https://docs.imgix.com/apis/rendering
        responsiveImage(imgixParams: { ar: "16:9", fit: crop }) {
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
  }
`;
