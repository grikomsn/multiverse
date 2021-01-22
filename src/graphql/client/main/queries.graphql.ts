import { gql } from "graphql-request";

export const ABOUT_PAGE_STATIC_PROPS = gql`
  query aboutPageStaticProps {
    aboutPageCollection(limit: 1) {
      items {
        preface
        knowledgeBase
      }
    }
  }
`;

export const APPEARANCES_STATIC_PROPS = gql`
  query appearancesStaticProps {
    appearanceCollection(order: date_DESC) {
      items {
        title
        date
        subtitle
        url
        tags
        category
        sys {
          id
        }
      }
    }
  }
`;

export const HOME_STATIC_PROPS = gql`
  query homePageStaticProps {
    showcaseCollection(
      limit: 10
      order: featuredOrder_ASC
      where: { featuredOrder_exists: true }
    ) {
      items {
        title
        tech
        image {
          url(transform: { width: 1280 })
        }
        url
        sys {
          id
        }
      }
    }
    appearanceCollection(limit: 10, order: date_DESC) {
      items {
        title
        date
        subtitle
        url
        tags
        category
        sys {
          id
        }
      }
    }
    blogPostCollection(limit: 10, order: postedAt_DESC) {
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

export const PROJECTS_STATIC_PROPS = gql`
  query projectsStaticProps {
    showcaseCollection(order: title_ASC) {
      items {
        title
        tech
        image {
          url(transform: { width: 1280 })
        }
        url
        sys {
          id
        }
      }
    }
  }
`;
