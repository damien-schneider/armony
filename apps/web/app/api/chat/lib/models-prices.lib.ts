import type { AiModelKey } from "@/app/api/chat/ai-models.type";
import type { activeModelsList } from "@/app/api/chat/lib/ai-models-client.lib";
import {
  getModel,
  isValidModel,
} from "@/app/api/chat/util/ai-models-client.util";

type ModelTokenPricing = {
  costPerMillionInputToken: number;
  costPerMillionOutputToken: number;
  costPerImage?: number;
};

type RequiredActiveModelPricing = {
  [K in (typeof activeModelsList)[number]]: ModelTokenPricing;
};

type ModelPricing = RequiredActiveModelPricing;

export const convertDollarToEuro = (amount: number) => {
  const conversionRate = 0.905; // Conversion rate to update
  return amount * conversionRate;
};

//TODO: Definitely need to create a unit test for all of these functions!!
export const getModelCosts = (model: AiModelKey) => {
  // Not sure it is necessary but keep it for now to ensure safety
  if (!model) {
    console.error("No model provided");
    throw new Error("No model provided");
  }
  if (!isValidModel(model)) {
    console.error(`Invalid model: ${model}`);
    return null;
  }
  return modelPricing[model];
};

//TODO: Improve cost calculation by storing the currency in the database
//TODO: for some models should take in account cache tokens price
//TODO: Add just cost per million token directly
export const modelPricing: ModelPricing = {
  // DeepSeek models - Free tier
  "deepseek/deepseek-chat-v3-0324:free": {
    costPerMillionInputToken: 0,
    costPerMillionOutputToken: 0,
  },
  "deepseek/deepseek-r1-0528:free": {
    costPerMillionInputToken: 0,
    costPerMillionOutputToken: 0,
  },
  // Anthropic models
  "anthropic/claude-sonnet-4": {
    costPerMillionInputToken: 3,
    costPerMillionOutputToken: 15,
  },
  "anthropic/claude-3.7-sonnet:thinking": {
    costPerMillionInputToken: 3,
    costPerMillionOutputToken: 15,
  },
  // OpenAI models
  "openai/gpt-4.1": {
    costPerMillionInputToken: 2,
    costPerMillionOutputToken: 8,
  },
  "openai/gpt-4.1:online": {
    costPerMillionInputToken: 2,
    costPerMillionOutputToken: 8,
  },
  "openai/o3-mini": {
    costPerMillionInputToken: 2,
    costPerMillionOutputToken: 8,
  },
  // Google models
  "google/gemini-2.5-pro-preview": {
    costPerMillionInputToken: 1.25,
    costPerMillionOutputToken: 10,
  },
  "google/gemini-2.5-flash-preview-05-20": {
    costPerMillionInputToken: 0.15,
    costPerMillionOutputToken: 0.6,
  },
  // Meta models
  "meta-llama/llama-4-maverick:free": {
    costPerMillionInputToken: 0,
    costPerMillionOutputToken: 0,
  },
  // XAI models
  "x-ai/grok-3-mini-beta": {
    costPerMillionInputToken: 0.3,
    costPerMillionOutputToken: 0.5,
  },
  // Web search models
  "gpt-4o-mini-web-search": {
    costPerMillionInputToken: 0.15,
    costPerMillionOutputToken: 0.6,
  },
  // Image generation models
  "dall-e-3": {
    costPerMillionInputToken: 0.1,
    costPerMillionOutputToken: 0.4,
    costPerImage: 0.08,
  },
  "dall-e-2": {
    costPerMillionInputToken: 0.1,
    costPerMillionOutputToken: 0.4,
    costPerImage: 0.02,
  },
  // Mistral models
  "mistralai/magistral-medium-2506:thinking": {
    costPerMillionInputToken: 2,
    costPerMillionOutputToken: 5,
  },
  "mistralai/mistral-nemo": {
    costPerMillionInputToken: 0.01,
    costPerMillionOutputToken: 0.022,
  },
};

export const computeTokenCosts = ({
  aiModel,
  promptTokens,
  completionTokens,
  imageGenerated,
}: {
  aiModel: AiModelKey;
  promptTokens: number;
  completionTokens: number;
  imageGenerated?: number;
}) => {
  const aiModelDetails = getModel(aiModel);
  if (aiModelDetails.specificity === "image-generation") {
    const costPerImage = getModelCosts(aiModel)?.costPerImage;
    if (!costPerImage) {
      console.error("No cost per image found");
      throw new Error("No cost per image found");
    }
    if (imageGenerated) {
      const imageCost = imageGenerated * convertDollarToEuro(costPerImage);
      return {
        promptCost: 0,
        completionCost: 0,
        totalCost: imageCost,
      };
    }
  }
  const aiCosts = getModelCosts(aiModel);
  if (!aiCosts) {
    console.error("Model costs not found");
    return null;
  }
  const promptCost =
    promptTokens *
    convertDollarToEuro(aiCosts.costPerMillionInputToken / 1000000);
  const completionCost =
    completionTokens *
    convertDollarToEuro(aiCosts.costPerMillionOutputToken / 1000000);
  const totalCost = promptCost + completionCost;

  return {
    promptCost,
    completionCost,
    totalCost,
  };
};
