import * as React from "react";

import BulmaToast from "@/ui/toast/bulma";

import toast from "react-hot-toast";

export function CheckReferrer() {
  React.useEffect(() => {
    if (__DEV__ ? true : document.referrer.includes("bulma.io")) {
      toast(BulmaToast, {
        duration: Infinity,
        id: "from-bulma",
      });
    }
  });

  return null;
}
