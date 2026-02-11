import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { useEffect, useRef } from "preact/hooks";
import "./markdown.css";

// import "highlight.js/styles/github.css";
import "highlight.js/styles/github-dark.css";

const marked = new Marked(
  markedHighlight({
    emptyLangClass: "hljs",
    langPrefix: "hljs language-",
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

type MarkdownProps = {
  contentMd: string;
  prefix?: string;
};

export function Markdown({ contentMd, prefix }: MarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const html = marked.parse(contentMd) as string;
    containerRef.current.innerHTML = html;

    containerRef.current.querySelectorAll("a").forEach((a) => {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });

    if (prefix) {
      const images = containerRef.current.querySelectorAll("img");
      images.forEach((img) => {
        const src = img.getAttribute("src");
        if (src && !src.startsWith("http") && !src.startsWith("//")) {
          img.setAttribute("src", prefix + src);
        }
      });
    }
  }, [contentMd, prefix]);

  return <div ref={containerRef} className="markdown-body"></div>;
}
