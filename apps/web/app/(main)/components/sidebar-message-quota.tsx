"use client";
import { useMessageQuotas } from "@/hooks/queries/client/use-ai-calls.query";
import { useSubscriptionByUser } from "@/hooks/queries/client/use-subscriptions.query";
import { useSession } from "@/hooks/queries/use-session";
import { Progress } from "@workspace/ui/components/progress";
import { Separator } from "@workspace/ui/components/separator";
import { P } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";

export default function SidebarMessageQuota() {
  const { idUser } = useSession();
  const { data: subscription } = useSubscriptionByUser(idUser);
  const { data: quotas, isLoading } = useMessageQuotas(idUser);

  // Don't show for subscribed users or while loading
  if (
    subscription?.status === "active" ||
    subscription?.status === "trialing" ||
    isLoading ||
    !quotas
  ) {
    return null;
  }

  // Determine the color of the progress bar based on usage percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) {
      return "bg-destructive";
    }
    if (percentage >= 75) {
      return "bg-warning";
    }
    return "bg-primary";
  };

  return (
    <>
      <div className="px-4 py-2">
        <P className="text-xs text-muted-foreground mb-1">Free Message Quota</P>
        <Progress
          value={quotas.percentageUsed}
          className="h-1.5 mb-1"
          indicatorClassName={cn(getProgressColor(quotas.percentageUsed))}
        />
        <P className="text-xs text-muted-foreground text-right">
          {quotas.messagesUsed}/{quotas.messagesLimit} messages in last 3 days
        </P>
      </div>
      <Separator />
    </>
  );
}
