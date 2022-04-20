import { Github, Twitter } from "lucide-react";
import { Anchor } from "ui/core/anchor";

export function Footer() {
  return (
    <footer className="flex flex-col items-center py-8 my-16 space-y-1 text-2xs text-center text-neutral-400">
      <p>Made using Next.js and Tailwind CSS. Hosted on Vercel.</p>
      <br />
      <p>
        Contents licensed under{" "}
        <Anchor className="hover:text-neutral-300 underline" href="https://creativecommons.org/licenses/by-nc-sa/4.0">
          CC BY-NC-SA 4.0
        </Anchor>
      </p>
      <p>
        <Anchor className="hover:text-neutral-300 underline" href="https://github.com/grikomsn/griko.id">
          MIT License
        </Anchor>{" "}
        &copy; {new Date().getFullYear()} Griko Nibras
      </p>
      <br />
      <br />
      <div className="flex items-center space-x-6">
        <Anchor href="/github">
          <Github className="w-5 h-5 hover:text-neutral-300" />
        </Anchor>
        <Anchor href="/twitter">
          <Twitter className="w-5 h-5 hover:text-neutral-300" />
        </Anchor>
      </div>
    </footer>
  );
}
