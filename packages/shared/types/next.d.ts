import {
  NextApiRequest as BaseNextApiRequest,
  NextComponentType as BaseNextComponentType,
  NextPage as BaseNextPage,
  NextPageContext,
} from "next";

export type NextApiRequest<T extends Record<string, unknown> = { [k: string]: unknown }> = BaseNextApiRequest & T;

export type NextComponentType<IP = unknown, P = {}> = BaseNextComponentType<NextPageContext, IP, P> & NextPageProps;

export type NextPage<P = {}, IP = P> = BaseNextPage<P, IP> & NextPageProps;

export type NextPageProps = {
  layout?: LayoutType;
};

export type LayoutType = "default" | "none";
