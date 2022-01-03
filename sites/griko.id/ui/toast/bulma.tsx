import * as React from "react";

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
        Head over to <A className="font-medium text-primary underline" href="https://bulma.griko.id" /> to see the
        featured page. Thank you for visiting! 👋
      </p>
    </div>
  );
}
