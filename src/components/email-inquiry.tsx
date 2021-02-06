import * as React from "react";

import { useEmail } from "@/hooks/app";

import { Button } from "@chakra-ui/react";
import siteConfig from "site-config";

const EmailInquiry: React.FC = () => {
  const { copyEmail, EmailTooltip } = useEmail();

  return (
    <>
      For business inquiries, drop a mail at{" "}
      <EmailTooltip placement="top">
        <Button color="yellow.300" onClick={copyEmail} variant="link">
          {siteConfig.email}
        </Button>
      </EmailTooltip>{" "}
      and let&apos;s talk.
    </>
  );
};

export default EmailInquiry;
