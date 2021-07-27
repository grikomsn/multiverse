// https://www.staging-typescript.org/docs/handbook/declaration-files/dts-from-js.html

import { GraphQLClient } from "graphql-request";

declare const client: GraphQLClient;
export = client;
