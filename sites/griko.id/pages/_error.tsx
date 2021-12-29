import * as React from "react";

import A from "@/ui/core/anchor";
import Prose from "@/ui/core/prose";

import { STATUS_CODES } from "http";
import { NextPage } from "next";

type ErrorPageProps = {
  statusCode: number;
};

const ErrorPage: NextPage<ErrorPageProps> = ({ statusCode }) => {
  return (
    <Prose>
      <h1>
        {statusCode} {STATUS_CODES[statusCode]}
      </h1>
      <A href="/">Back to home page</A>
    </Prose>
  );
};

ErrorPage.getInitialProps = ({ err, res }) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  console.error(err);
  return { statusCode };
};

export default ErrorPage;
