"use client";

import { useContext } from "react";

import { ModeContext } from "@-ft/mode-next";
import Giscus from "@giscus/react";

export interface CommentProps {
  canonized: string;
}

export function Comment({ canonized }: CommentProps) {
  const { theme } = useContext(ModeContext);
  return (
    <Giscus
      id="comments"
      repo="recreational-websites/polyomino-catalog"
      repoId="R_kgDOMtIoQg"
      category="Announcements"
      categoryId="DIC_kwDOMtIoQs4CiRje"
      mapping="specific"
      term={canonized}
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme}
      lang="en"
      loading="lazy"
    />
  );
}
