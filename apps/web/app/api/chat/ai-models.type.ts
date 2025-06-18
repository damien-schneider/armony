import type {
  activeModelsList,
  modelCategoryList,
  providersList,
} from "@/app/api/chat/lib/ai-models-client.lib";

export type AiProviderKey = (typeof providersList)[number];

export type AiModelKey = (typeof activeModelsList)[number];

export type AiModelSpecificity = (typeof modelCategoryList)[number];

export type ModelDefinition = {
  provider: AiProviderKey;
  slug: AiModelKey;
  name: string;
  description: string;
  specificity: AiModelSpecificity;
  releaseDate: Date;
  options: {
    imageInput: boolean;
  };
};

export type ModelDetails = {
  [key in AiModelKey]: ModelDefinition;
};
