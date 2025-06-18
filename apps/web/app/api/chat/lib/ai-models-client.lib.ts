import type { ModelDetails } from "@/app/api/chat/ai-models.type";

export const activeModelsList = [
  // "claude-haiku",
  "anthropic/claude-sonnet-4",
  "anthropic/claude-3.7-sonnet:thinking",
  "openai/gpt-4.1",
  "openai/gpt-4.1:online",
  // "gpt-4o-mini",
  // "o3-mini",
  "deepseek/deepseek-chat-v3-0324:free",
  "deepseek/deepseek-r1-0528:free",
  // "gemini-2.0-flash",
  "google/gemini-2.5-pro-preview",
  "meta-llama/llama-4-maverick:free",
  // "mistral-saba",
  "x-ai/grok-3-mini-beta",
  "gpt-4o-mini-web-search",
  "google/gemini-2.5-flash-preview-05-20",
  // "gemini-2.0-flash-web-search",
  "dall-e-3",
  "openai/o3-mini",
  "mistralai/magistral-medium-2506:thinking",
  "dall-e-2",
  "mistralai/mistral-nemo",
] as const;

export const allAvailableModelsList = [...activeModelsList] as const;

export const providersList = [
  "anthropic",
  "openai",
  "deepseek",
  "google",
  "mistral",
  "meta",
  "xai",
  "gemini",
] as const;

type ModelProviderDetails = {
  name: string;
  color: {
    light: string;
    dark: string;
  };
};

export const providerDetailsList = {
  anthropic: {
    name: "Anthropic",
    color: {
      light: "#d97757",
      dark: "#d97757",
    },
  },
  openai: {
    name: "OpenAI",
    color: {
      light: "#000",
      dark: "#fff",
    },
  },
  deepseek: {
    name: "DeepSeek",
    color: {
      light: "#4D6BFE",
      dark: "#4D6BFE",
    },
  },
  google: {
    name: "Google",
    color: {
      light: "#F59E42",
      dark: "#B45309",
    },
  },
  gemini: {
    name: "Gemini",
    color: {
      light: "#1a6bff",
      dark: "#1a6bff",
    },
  },
  mistral: {
    name: "Mistral",
    color: {
      light: "#FA500E",
      dark: "#FFAF00",
    },
  },
  meta: {
    name: "Meta",
    color: {
      light: "#2563EB",
      dark: "#2563EB",
    },
  },
  xai: {
    name: "XAI",
    color: {
      light: "#111827",
      dark: "#F3F4F6",
    },
  },
} as const satisfies Record<
  (typeof providersList)[number],
  ModelProviderDetails
>;

export const modelCategoryList = [
  "text",
  "reasoning",
  "web-search",
  "image-generation",
] as const;

export const modelCategories: Record<
  (typeof modelCategoryList)[number],
  { name: string; slug: string }
> = {
  text: {
    name: "Text Models",
    slug: "text",
  },
  reasoning: {
    name: "Reasoning Models",
    slug: "reasoning",
  },
  "web-search": {
    name: "Web Search Models",
    slug: "web-search",
  },
  "image-generation": {
    name: "Image Models",
    slug: "image-generation",
  },
} as const;

export const legacyModelsAlternative = {
  "sonnet-3.7": "anthropic/claude-sonnet-4",
  claude: "anthropic/claude-sonnet-4",
  "gemini-2.0-flash": "google/gemini-2.5-flash-preview-05-20",
  "gpt-4o-mini": "gpt-4.1",
  "o3-mini": "gpt-4.1",
  "gpt-4.1": "openai/gpt-4.1",
  "claude-3-7-sonnet-thinking": "anthropic/claude-3.7-sonnet:thinking",
  "claude-3-7-sonnet": "anthropic/claude-sonnet-4",
  "llama-4-scout": "meta-llama/llama-4-maverick:free",
  "grok-3-mini": "x-ai/grok-3-mini-beta",
  "gemini-2.5-pro": "google/gemini-2.5-flash-preview-05-20",
};

export const availableModels: ModelDetails = {
  "anthropic/claude-sonnet-4": {
    provider: "anthropic",
    slug: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    description: "Anthropic's Claude model.",
    specificity: "text",
    releaseDate: new Date("2025-06-18"),

    options: {
      imageInput: true,
    },
  },
  "anthropic/claude-3.7-sonnet:thinking": {
    provider: "anthropic",
    slug: "anthropic/claude-3.7-sonnet:thinking",
    name: "Claude 3.7 Sonnet Thinking",
    description: "Anthropic's Claude model with enhanced reasoning.",
    specificity: "reasoning",
    releaseDate: new Date("2025-06-18"),
    options: {
      imageInput: true,
    },
  },
  "openai/gpt-4.1": {
    provider: "openai",
    slug: "openai/gpt-4.1",
    name: "GPT-4.1",
    description: "OpenAI's GPT-4.1 model.",
    specificity: "text",
    releaseDate: new Date("2025-04-15"),

    options: {
      imageInput: true,
    },
  },
  "openai/gpt-4.1:online": {
    provider: "openai",
    slug: "openai/gpt-4.1:online",
    name: "GPT-4.1 Online",
    description: "OpenAI's GPT-4.1 Online model.",
    specificity: "web-search",
    releaseDate: new Date("2025-06-18"),

    options: {
      imageInput: true,
    },
  },
  "deepseek/deepseek-chat-v3-0324:free": {
    provider: "deepseek",
    slug: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek Chat V3",
    description: "DeepSeek's chat model.",
    specificity: "text",
    releaseDate: new Date("2025-05-18"),

    options: {
      imageInput: false,
    },
  },
  "deepseek/deepseek-r1-0528:free": {
    provider: "deepseek",
    slug: "deepseek/deepseek-r1-0528:free",
    name: "DeepSeek R1",
    description: "DeepSeek's reasoning-focused model.",
    specificity: "reasoning",
    releaseDate: new Date("2025-05-18"),

    options: {
      imageInput: false,
    },
  },
  "google/gemini-2.5-pro-preview": {
    provider: "gemini",
    slug: "google/gemini-2.5-pro-preview",
    name: "Gemini 2.5 Pro Preview",
    description: "Google's Gemini 2.5 Pro Preview model.",
    specificity: "text",
    releaseDate: new Date("2025-06-18"),

    options: {
      imageInput: true,
    },
  },
  // "mistral-saba": {
  //   provider: "mistral",
  //   slug: "mistral-saba",
  //   name: "Mistral Saba",
  //   description: "Mistral's Saba model.",
  //   specificity: "text",
  //   options: {
  //     imageInput: false,
  //   },
  // },
  "meta-llama/llama-4-maverick:free": {
    provider: "meta",
    slug: "meta-llama/llama-4-maverick:free",
    name: "Llama 4 Maverick",
    description: "Meta's Llama 4 Maverick model.",
    specificity: "text",
    releaseDate: new Date("2025-06-18"),

    options: {
      imageInput: true,
    },
  },
  "x-ai/grok-3-mini-beta": {
    provider: "xai",
    slug: "x-ai/grok-3-mini-beta",
    name: "Grok 3 Mini",
    description: "XAI's Grok 3 Mini model.",
    specificity: "reasoning",
    releaseDate: new Date("2025-04-14"),
    options: {
      imageInput: true,
    },
  },
  "gpt-4o-mini-web-search": {
    provider: "openai",
    slug: "gpt-4o-mini-web-search",
    name: "GPT 4o-mini Web Search",
    description: "OpenAI's GPT 4o-mini with web search capabilities.",
    specificity: "web-search",
    releaseDate: new Date("2025-04-14"),
    options: {
      imageInput: false,
    },
  },
  "google/gemini-2.5-flash-preview-05-20": {
    provider: "gemini",
    slug: "google/gemini-2.5-flash-preview-05-20",
    name: "Gemini 2.5 Flash Preview",
    description: "Google's Gemini 2.5 Flash Preview model.",
    specificity: "text",
    releaseDate: new Date("2025-06-18"),
    options: {
      imageInput: true,
    },
  },
  // "gemini-2.0-flash-web-search": {
  //   provider: "gemini",
  //   slug: "gemini-2.0-flash-web-search",
  //   name: "Gemini 2.0 Flash Web Search",
  //   description: "Google's Gemini 2.0 Flash with web search capabilities.",
  //   specificity: "web-search",
  //   options: {
  //     imageInput: true,
  //   },
  // },
  "dall-e-3": {
    provider: "openai",
    slug: "dall-e-3",
    name: "DALL-E 3",
    description: "OpenAI's DALL-E 3 model.",
    specificity: "image-generation",
    releaseDate: new Date("2025-04-22"),
    options: {
      imageInput: false,
    },
  },
  "dall-e-2": {
    provider: "openai",
    slug: "dall-e-2",
    name: "DALL-E 2",
    description: "OpenAI's DALL-E 2 model.",
    specificity: "image-generation",
    releaseDate: new Date("2025-04-22"),
    options: {
      imageInput: false,
    },
  },
  "mistralai/mistral-nemo": {
    provider: "mistral",
    slug: "mistralai/mistral-nemo",
    name: "Mistral Nemo",
    description: "Mistral's Nemo model.",
    specificity: "text",
    releaseDate: new Date("2025-06-18"),
    options: {
      imageInput: false,
    },
  },
  "openai/o3-mini": {
    provider: "openai",
    slug: "openai/o3-mini",
    name: "O3 Mini",
    description: "OpenAI's O3 Mini model.",
    specificity: "reasoning",
    releaseDate: new Date("2025-06-18"),
    options: {
      imageInput: true,
    },
  },
  "mistralai/magistral-medium-2506:thinking": {
    provider: "mistral",
    slug: "mistralai/magistral-medium-2506:thinking",
    name: "Magistral Medium 2506",
    description: "Mistral's Magistral Medium 2506 model.",
    specificity: "reasoning",
    releaseDate: new Date("2025-06-18"),
    options: {
      imageInput: false,
    },
  },
};

export const reasonningModelsList = Object.values(availableModels).filter(
  (model) => model.specificity === "reasoning",
);
export const webSearchModelsList = Object.values(availableModels).filter(
  (model) => model.specificity === "web-search",
);
export const textModelsList = Object.values(availableModels).filter(
  (model) => model.specificity === "text",
);
// export const imageModelsList = Object.values(availableModels).filter(
//   (model) => model.specificity === "image",
// );

export const availableModelList = Object.values(availableModels);

export const fallbackAiModel =
  availableModels["meta-llama/llama-4-maverick:free"];
