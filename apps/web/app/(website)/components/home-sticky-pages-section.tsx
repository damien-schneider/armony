import { StickyPage } from "@/app/(website)/components/home-sticky-page";
import ScreenshotContext from "./images/showcase-screenshot-context.png";
import ScreenshotModels from "./images/showcase-screenshot-models.png";
import ScreenshotSnippets from "./images/showcase-screenshot-snippets.png";

export function StickyPagesSection() {
  // Page data
  const pages = [
    {
      number: "1",
      title: "Snippets Management",
      description: `Save and reuse your favorite prompts.

Never start from scratch again.`,
      buttonText: "Get Started",
      image: ScreenshotSnippets,
    },
    {
      number: "2",
      title: "Contextual Spaces",
      description:
        "Keep conversations and projects organized with dedicated spaces that retain context for smarter interactions.",
      image: ScreenshotModels,
    },
    {
      number: "3",
      title: "Ready? Just chat",
      description:
        "Chat with cutting-edge AI models and explore the most innovative features.",
      buttonText: "Get Started",
      image: ScreenshotContext,
    },
  ];

  return (
    <div className="relative mt-24">
      {pages.map((page) => (
        <StickyPage
          key={page.number}
          number={page.number}
          title={page.title}
          description={page.description}
          buttonText={page.buttonText}
          image={page.image}
        />
      ))}
    </div>
  );
}
