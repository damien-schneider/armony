import Showdown from "showdown";
import TurndownService from "turndown";

export function convertHtmlToMarkdown(html: string): string {
  const turndownService = new TurndownService({ headingStyle: "atx" });
  const markdown = turndownService.turndown(html);
  return markdown;
}

export const convertMarkdownToHtml = (markdown: string) => {
  const converter = new Showdown.Converter();
  const html = converter.makeHtml(markdown);
  return html;
};
