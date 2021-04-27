import { gql } from "graphql-request";

export const APPEARANCES_STATIC_PROPS = gql`
  query appearancesStaticProps {
    allAppearances(orderBy: date_DESC) {
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
  }
`;
