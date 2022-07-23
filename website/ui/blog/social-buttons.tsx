import type { PostFieldsFragment } from "__generated__/graphql";
import clsx from "clsx";
import metadataJson from "config/metadata";
import { Link as LinkIcon, ShareIos as ShareIcon, Twitter as TwitterIcon } from "iconoir-react";
import { createTwitterIntent } from "lib/twitter";
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
    await toast.promise(navigator.share({ title: post.title, url }), {
      loading: "Sharing post...",
      success: "Shared post!",
      error: "Something went wrong!",
    });
  }

  const intentLink = createTwitterIntent({
    text: post.title,
    via: metadataJson.twitter.username.slice(1),
    url,
  });

  async function handleClipboard(event: MouseEvent) {
    if (navigator.clipboard) event.preventDefault();
    await toast.promise(navigator.clipboard.writeText(url), {
      loading: "Copying post link...",
      success: "Copied post link to clipboard!",
      error: "Something went wrong!",
    });
  }

  return (
    <div className={clsx("flex items-center space-x-4 text-neutral-400", className)} {...rest}>
      <NavigatorWrap has="share">
        {({ navigator }) => (
          <LabelTooltip label="Share this post">
            <button onClick={() => void handleShare(navigator)} type="button">
              <ShareIcon className="h-5 w-5 hover:text-neutral-300" />
            </button>
          </LabelTooltip>
        )}
      </NavigatorWrap>
      <LabelTooltip label="Tweet this post">
        <Anchor href={intentLink}>
          <TwitterIcon className="h-5 w-5 hover:text-neutral-300" />
        </Anchor>
      </LabelTooltip>
      <LabelTooltip label="Copy post link to clipboard">
        <Anchor href={`/blog/${post.slug}`} onClick={(event) => void handleClipboard(event)}>
          <LinkIcon className="h-5 w-5 hover:text-neutral-300" />
        </Anchor>
      </LabelTooltip>
    </div>
  );
}
