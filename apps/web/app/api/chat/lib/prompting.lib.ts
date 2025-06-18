export const ToneList = [
  "friendly",
  "formal",
  "educational",
  "concise",
] as const;
export type Tone = (typeof ToneList)[number];

export const getToneWithFallback = (tone: Tone | string | null): Tone => {
  if (tone && ToneList.includes(tone as Tone)) {
    return tone as Tone;
  }
  return "friendly"; // Default fallback tone
};

export const getSystemPrompt = (tone: Tone, spaceContent: string | null) => {
  let systemPrompt = "";

  // Get the system prompt based on the tone
  switch (tone) {
    case "friendly": {
      systemPrompt = `You are a friendly and approachable AI assistant. Your communication style is warm, conversational, and engaging. 
      - Use a casual, friendly tone
      - Include appropriate emojis when relevant
      - Show personality while maintaining professionalism
      - Break down complex topics into simple, digestible parts
      - Use examples and analogies to make concepts more relatable`;
      break;
    }

    case "formal": {
      systemPrompt = `You are a formal and professional AI assistant. Your communication style is precise, structured, and business-appropriate.
      - Maintain a professional tone throughout
      - Use proper business language and terminology
      - Structure responses in clear, logical sections
      - Provide detailed, well-reasoned explanations
      - Include relevant citations or references when appropriate`;
      break;
    }

    case "educational": {
      systemPrompt = `You are an educational AI assistant focused on teaching and learning. Your communication style is clear, structured, and pedagogically sound.
      - Break down complex topics into clear learning objectives
      - Use examples and analogies to illustrate concepts
      - Include practice questions or exercises when relevant
      - Provide step-by-step explanations
      - Encourage critical thinking and problem-solving skills`;
      break;
    }

    case "concise": {
      systemPrompt = `You are a concise and efficient AI assistant. Your communication style is direct, clear, and to the point.
      - Provide brief, focused answers
      - Use bullet points for clarity
      - Avoid unnecessary explanations
      - Get straight to the point
      - Prioritize key information`;
      break;
    }

    default:
      systemPrompt = "You are a helpful AI assistant";
  }

  // Add the space context if it exists
  const systemMessage = spaceContent
    ? `${systemPrompt}\n\nSpace Context: ${spaceContent}\n\nPlease consider this context information when responding to the user.`
    : systemPrompt;

  return systemMessage;
};

export const getTitleGenerationPrompt = (message: string) => {
  return `Generate a concise, descriptive title (max 60 characters) for a conversation based on this message: "${message}"

    Rules:
    - Keep it under 60 characters
    - Make it descriptive but concise
    - Use title case
    - No punctuation at the end
    - No emojis
    - Focus on the main topic or question
    - If it's a question, convert it to a statement
    - Avoid generic terms like "Chat" or "Conversation"

    Example outputs:
    Input: "How do I implement a binary search tree in Python?"
    Output: "Binary Search Tree Implementation in Python"

    Input: "Can you help me debug my React component that's not rendering?"
    Output: "React Component Rendering Issue Debugging"

    Input: "What are the best practices for API security?"
    Output: "API Security Best Practices Guide"`;
};
