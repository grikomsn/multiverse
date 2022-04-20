import { toast } from "react-hot-toast";
import type { Renderable } from "react-hot-toast/dist/core/types";

export async function copy(text: string, message: Renderable = "Copied to clipboard!") {
  try {
    await navigator.clipboard.writeText(text);
    return toast.success(message);
  } catch (err: unknown) {
    return toast.error(String(err));
  }
}
