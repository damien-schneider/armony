import type {
  AiModelKey,
  ModelDefinition,
} from "@/app/api/chat/ai-models.type";
import {
  availableModels,
  legacyModelsAlternative,
} from "@/app/api/chat/lib/ai-models-client.lib";

export const isValidModel = (model: string): model is AiModelKey => {
  return model in availableModels;
};

function getResolvedModelKeyFromLegacyOrCurrent(model: string): string {
  return legacyModelsAlternative && model in legacyModelsAlternative
    ? legacyModelsAlternative[model as keyof typeof legacyModelsAlternative]
    : model;
}

export function getModel(model: AiModelKey): ModelDefinition;
export function getModel(model: string): ModelDefinition | null;
export function getModel(model: string): ModelDefinition | null {
  if (!model) {
    console.error("No model provided");
    throw new Error("No model provided");
  }
  const resolvedModel = getResolvedModelKeyFromLegacyOrCurrent(model);
  if (!isValidModel(resolvedModel)) {
    console.error(`Invalid model: ${model}`);
    return null;
  }
  return availableModels[resolvedModel];
}
