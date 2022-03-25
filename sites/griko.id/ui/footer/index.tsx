import * as React from "react";

import meta from "@/config/meta.json";
import A from "@/ui/core/anchor";

import Excerpt from "./excerpt.mdx";

import { useKBar } from "kbar";
import { Command, Github, Mail, Twitter } from "lucide-react";

export default function Footer() {
  const kbar = useKBar();
  return (
    <footer className="flex flex-col items-center py-16 px-4 space-y-4 text-center md:flex-row md:space-y-0 md:text-left">
      <span className="flex-grow max-w-none prose-p:text-xs prose-p:leading-relaxed opacity-80 prose prose-invert prose-sky">
        <Excerpt />
      </span>
      <div className="flex items-center">
        <button className="p-4 hover:text-orange-500 transition-colors" onClick={kbar.query.toggle}>
          <Command size={18} />
        </button>
        <a className="p-4 hover:text-lime-500 transition-colors" href={meta.links.Email}>
          <Mail size={18} />
        </a>
        <A className="p-4 hover:text-neutral-500 transition-colors" href={meta.links.GitHub}>
          <Github size={18} />
        </A>
        <A className="p-4 hover:text-primary transition-colors" href={meta.links.Twitter}>
          <Twitter size={18} />
        </A>
      </div>
    </footer>
  );
}
