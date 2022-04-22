import type { PostFieldsFragment } from "__generated__/graphql";
import clsx from "clsx";
import metadataJson from "config/metadata";
import { createTwitterIntent } from "lib/twitter";
import { Link as LinkIcon, Share as ShareIcon, Twitter as TwitterIcon } from "lucide-react";
import type { ComponentProps, MouseEvent } from "react";
import { toast } from "react-hot-toast";
import { Anchor } from "ui/core/anchor";
import { LabelTooltip } from "ui/core/label-tooltip";
import { NavigatorWrap } from "ui/core/navigator-wrap";
import type { OmitChildren } from "utils/react";

export interface SocialButtonsProps extends OmitChildren<ComponentProps<"div">> {
  post: PostFieldsFragment;
}

export function SocialButtons({ post, className, ...rest }: SocialButtonsProps) {
  const url = `${metadataJson.url}/blog/${post.slug}`;

  async function handleShare(navigator: Navigator) {
    try {
      await navigator.share({ title: post.title, url });
    } catch (err) {
      toast.error(String(err));
    }
  }

  const intentLink = createTwitterIntent({
    text: post.title,
    via: metadataJson.twitter.username.slice(1),
    url,
  });

  async function handleClipboard(event: MouseEvent) {
    if (navigator.clipboard) event.preventDefault();
    await navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!");
  }

  return (
    <div className={clsx("flex items-center space-x-4 text-neutral-400", className)} {...rest}>
      <NavigatorWrap has="share">
        {({ navigator }) => (
          <LabelTooltip label="Share this post">
            <button onClick={() => void handleShare(navigator)} type="button">
              <ShareIcon className="w-5 h-5 hover:text-neutral-300" />
            </button>
          </LabelTooltip>
        )}
      </NavigatorWrap>
      <LabelTooltip label="Tweet this post">
        <Anchor href={intentLink}>
          <TwitterIcon className="w-5 h-5 hover:text-neutral-300" />
        </Anchor>
      </LabelTooltip>
      <LabelTooltip label="Copy post link to clipboard">
        <Anchor href={`/blog/${post.slug}`} onClick={(event) => void handleClipboard(event)}>
          <LinkIcon className="w-5 h-5 hover:text-neutral-300" />
        </Anchor>
      </LabelTooltip>
    </div>
  );
}
