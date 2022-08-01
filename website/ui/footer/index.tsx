import { GitHub as Github, Heart, Twitter } from "iconoir-react";
import { Anchor } from "ui/core/anchor";
import { Mastodon } from "ui/icon/mastodon";

export function Footer() {
  return (
    <footer className="my-16 flex flex-col items-center space-y-1 py-8 text-center text-2xs text-neutral-400">
      <p>Made using Next.js and Tailwind CSS. Hosted on Vercel.</p>
      <br />
      <p>
        Contents licensed under{" "}
        <Anchor className="underline hover:text-neutral-300" href="https://creativecommons.org/licenses/by-nc-sa/4.0">
          CC BY-NC-SA 4.0
        </Anchor>
      </p>
      <p>
        <Anchor className="underline hover:text-neutral-300" href="https://github.com/grikomsn/griko.id">
          MIT License
        </Anchor>{" "}
        &copy; {new Date().getFullYear()} Griko Nibras
      </p>
      <br />
      <br />
      <div className="flex items-center space-x-6">
        <Anchor href="https://github.com/grikomsn" rel="me">
          <Github className="h-5 w-5 hover:text-neutral-300" />
        </Anchor>
        <Anchor href="https://mastodon.social/@griko" rel="me">
          <Mastodon className="h-5 w-5 hover:text-neutral-300" />
        </Anchor>
        <Anchor href="https://twitter.com/griko_nibras" rel="me">
          <Twitter className="h-5 w-5 hover:text-neutral-300" />
        </Anchor>
        <Anchor href="/sponsors" rel="me">
          <Heart className="h-5 w-5 hover:text-neutral-300" />
        </Anchor>
      </div>
    </footer>
  );
}
