export const fetchOptions: RequestInit = {
  headers: {
    Authorization: `Bearer ${process.env.GRAPHQL_TOKEN}`,
  },
};
