import { Badge } from "@workspace/ui/components/badge";
import { H2, P } from "@workspace/ui/components/typography";
import { LogoShowcase } from "@/app/(website)/components/home-logo-showcase";

export function HomeSection1() {
  return (
    <div className="mx-auto max-w-4xl">
      <Badge>Remove friction from your workflow</Badge>
      <H2 className="mt-4">A Single Subscription. Unlimited AI Power.</H2>
      <P variant="caption-lg" className="mt-4 max-w-xl">
        Access the latest AI models like Claude 3.7 Sonnet, GPT 4o, and much
        more.
        <br />
        Whether you’re generating images or harnessing advanced reasoning,
        remove workflow friction and boost productivity every time.
      </P>
      <LogoShowcase className="mt-16" />
    </div>
  );
}
