import type { ModelDefinition } from "@/app/api/chat/ai-models.type";
import { computeTokenCosts } from "@/app/api/chat/lib/models-prices.lib";
import { estimateTextTokens } from "@/app/api/chat/token-estimation";
import { getSubscriptionByUser } from "@/utils/subscription/get-subscription";
import { createServerClient } from "@workspace/supabase/server";
import type { LanguageModelUsage, StepResult, ToolSet } from "ai";

export async function getLast3daysAiCalls({ idUser }: { idUser: string }) {
  const supabase = await createServerClient();

  const threeDaysAgo = new Date(
    Date.now() - 3 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const {
    count: aiCallsCount,
    data,
    error,
  } = await supabase
    .from("ai-calls")
    .select("", { count: "exact" })
    .eq("id_user", idUser)
    .gte("created_at", threeDaysAgo);

  if (error || data === null || aiCallsCount === null) {
    console.error("Error fetching ai-calls:", error);
    return null;
  }

  return aiCallsCount;
}

export const checkUserSubscriptionQuotas = async ({
  idUser,
}: { idUser: string }) => {
  const { status } = await getSubscriptionByUser(idUser);

  if (status !== "active") {
    // if not subscribed, check if user has reached the limit of 10 calls per 3 days
    const numberOfCalls = await getLast3daysAiCalls({ idUser });

    if (numberOfCalls === null) {
      console.error("Error fetching ai-calls");
      throw new Error("Error fetching ai-calls");
    }
    if (numberOfCalls >= 10) {
      console.error("You have reached the limit of 10 calls per 3 days");
      throw new Error(
        "You have reached the limit of 10 calls per 3 days, please subscribe to continue",
      );
    }
  }
};

export const saveAiCalls = async ({
  idUser,
  usage,
  initialMessages,
  systemPrompt,
  steps,
  model,
  numberOfToolCalls = 0,
}: {
  idUser: string;
  usage: LanguageModelUsage;
  // biome-ignore lint/suspicious/noExplicitAny: <//!!TODO: Types to add later>
  initialMessages: any;
  systemPrompt: string;
  steps: StepResult<ToolSet>[];
  model: ModelDefinition;
  numberOfToolCalls?: number;
}) => {
  const supabase = await createServerClient();
  let completionTokensCalculated = 0;
  let promptTokensCalculated = 0;

  if (!usage.promptTokens && initialMessages) {
    const concatenatedPromptMessages =
      initialMessages
        //@ts-expect-error <Types to add later>
        .map((message) => {
          if (message.type === "text") {
            return message.text;
          }
          return "";
        })
        .join(" ") + systemPrompt;
    promptTokensCalculated = estimateTextTokens(concatenatedPromptMessages);
  }
  if (!usage.completionTokens) {
    const concatenatedTextSteps = steps.map((step) => step.text).join(" ");

    const concatenatedReasoningSteps = steps
      .map((step) => step.reasoning)
      .join(" ");

    completionTokensCalculated = estimateTextTokens(
      concatenatedReasoningSteps + concatenatedTextSteps,
    );
  }
  const totalTokensCalculated =
    completionTokensCalculated + promptTokensCalculated;
  console.log("Usage:", usage);
  const computedCosts = computeTokenCosts({
    aiModel: model.slug,
    completionTokens:
      Number(usage.completionTokens) || completionTokensCalculated,
    promptTokens: Number(usage.promptTokens) || promptTokensCalculated,
    imageGenerated: numberOfToolCalls,
  });
  console.log("Computed costs:", computedCosts);
  if (!computedCosts) {
    console.error("Failed to compute costs");
    throw new Error("Failed to compute costs");
  }
  //TODO: Improve the safety of this, when this throw an error, it should return an error to the client, and activate a huge alert to the devs
  await supabase
    .from("ai-calls")
    .insert({
      id_user: idUser,
      completion_tokens:
        Number(usage.completionTokens) || completionTokensCalculated,
      ai_model: model.slug,
      prompt_tokens: Number(usage.promptTokens) || promptTokensCalculated,
      total_tokens: Number(usage.totalTokens) || totalTokensCalculated,
      computed_cost_in_euro: computedCosts.totalCost,
    })
    .throwOnError();
};
