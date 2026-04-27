import { marked } from "marked";
import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

// Preserve code blocks correctly
turndown.addRule("fencedCodeBlock", {
  filter: (node) =>
    node.nodeName === "PRE" &&
    node.firstChild &&
    node.firstChild.nodeName === "CODE",
  replacement: (content, node) => {
    const code = node.firstChild;
    const lang = (code.getAttribute("class") || "")
      .replace(/^language-/, "")
      .trim();
    const text = code.textContent;
    return `\n\`\`\`${lang}\n${text}\n\`\`\`\n`;
  },
});

// Preserve blockquotes
turndown.addRule("blockquote", {
  filter: "blockquote",
  replacement: (content) => {
    return content
      .trim()
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n");
  },
});

export function htmlToMarkdown(html) {
  if (!html) return "";
  return turndown.turndown(html);
}

export function markdownToHtml(markdown) {
  if (!markdown) return "";
  return marked(markdown, { breaks: true, gfm: true });
}
