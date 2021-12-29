import * as React from "react";

import meta from "@/config/meta.json";
import A from "@/ui/core/anchor";
import { copy } from "@/utils/clipboard";

import MyImage from "@packages/assets/me-casual.jpg";
import { Mail, Twitter } from "lucide-react";
import Image from "next/image";

async function handleEmail(event: React.MouseEvent) {
  if (!event.shiftKey) {
    event.preventDefault();
    await copy(meta.email, "Copied email address!");
  }
}

export default function HomeFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center p-4 md:p-8 mx-auto space-y-8 md:space-y-0 md:space-x-8 max-w-xl md:max-w-none min-h-[80vh]">
      <div className="overflow-hidden w-full rounded-full max-w-[256px] safari-transform-fix">
        <Image
          alt={meta.name}
          className="transition-all duration-1000 ease-in-out"
          layout="responsive"
          placeholder="blur"
          priority
          src={MyImage}
        />
      </div>

      <div className="flex flex-col space-y-8">
        <div className="prose-headings:tracking-tighter text-center md:text-left prose prose-sky prose-invert md:prose-lg">
          {children}
        </div>

        <div className="flex flex-col sm:flex-row justify-center md:justify-start items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button className="group relative rounded-full" onClick={handleEmail}>
            <div className="absolute inset-0 text-text bg-current rounded-full group-hover:ring-2 ring-current group-hover:ring-offset-4 ring-offset-body transition" />
            <div className="flex relative items-center py-2 px-8 space-x-2 text-body">
              <Mail size={18} /> <span>{meta.email}</span>
            </div>
          </button>
          <A className="group relative rounded-full" href={meta.links.Twitter}>
            <div className="absolute inset-0 bg-current rounded-full group-hover:ring-2 ring-current group-hover:ring-offset-4 ring-offset-body transition text-sky-600" />
            <div className="flex relative items-center py-2 px-8 space-x-2">
              <Twitter size={18} /> <span>{meta.twitter.username}</span>
            </div>
          </A>
        </div>
      </div>
    </div>
  );
}
