import * as React from "react";

import meta from "@/config/meta.cjs";
import { A } from "@/ui/core/anchor";

import { X } from "lucide-react";
import toast, { Toast } from "react-hot-toast";

export default function BulmaToast({ id }: Toast) {
  return (
    <div className="space-y-1">
      <button className="absolute top-4 right-4" onClick={() => toast.dismiss(id)}>
        <X size={16} />
      </button>
      <h4 className="text-lg font-bold tracking-tighter">Coming from Bulma?</h4>
      <p className="text-sm">
        This website was made using Next.js and Bulma on 2018, but now it is using Tailwind CSS and other libraries.
      </p>
      <p className="text-sm">
        Bulma version will be republished soon, but you can see the{" "}
        <A className="font-medium text-primary underline" href={meta.multiverse.v2}>
          source code here on GitHub
        </A>
        .
      </p>
    </div>
  );
}
