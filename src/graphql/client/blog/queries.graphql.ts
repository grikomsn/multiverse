import { gql } from "graphql-request";

export const BLOG_STATIC_PROPS = gql`
  query blogStaticProps {
    blogPostCollection(order: postedAt_DESC) {
      items {
        title
        slug
        subtitle
        postedAt
        tags
        sys {
          id
        }
      }
    }
  }
`;

export const BLOG_POST_STATIC_PROPS = gql`
  query blogPostStaticProps($slug: String!) {
    blogPostCollection(limit: 1, where: { slug: $slug }) {
      items {
        image {
          url(transform: { width: 1280 })
          width
          height
          title
        }
        title
        slug
        subtitle
        postedAt
        tags
        content
      }
    }
  }
`;

export const BLOG_POST_STATIC_PATHS = gql`
  query blogPostStaticPaths {
    blogPostCollection(order: postedAt_DESC) {
      items {
        slug
      }
    }
  }
`;
