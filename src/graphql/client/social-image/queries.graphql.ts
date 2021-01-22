import { gql } from "graphql-request";

export const BLOG_SOCIAL_IMAGE = gql`
  query blogSocialImage($slug: String!) {
    post: blogPostCollection(limit: 1, where: { slug: $slug }) {
      items {
        title
        subtitle
      }
    }
  }
`;
