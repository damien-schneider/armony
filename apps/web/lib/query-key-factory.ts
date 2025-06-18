// 2. lists()
// Used for queries that return collections of items // Mostly used for invalidation

// 3. list({...})
// For filtered collections (passing search/filter parameters)

// 4. details()
// Base key for individual item queries // Mostly used for invalidation

// 5. detail({...})
// For queries that fetch a specific item by ID

export const noUserKey = ["no_user", "none"] as const;
export const keyEmpty = [""] as const;

export const keyChat = {
  all: ["chats"] as const,
  lists: () => [...keyChat.all, "list"] as const,
  list: ({ idSpace }: { idSpace: string }) =>
    [...keyChat.lists(), idSpace] as const,
  details: () => [...keyChat.all, "detail"] as const,
  detail: (params: { id: string }) => [...keyChat.details(), params] as const,
};

export const keySpace = {
  all: ["spaces"] as const,
  lists: () => [...keySpace.all, "list"] as const,
  list: (filters: { idUser: string }) =>
    [...keySpace.lists(), filters] as const,
  details: () => [...keySpace.all, "detail"] as const,
  detail: (params: { id: string }) => [...keySpace.details(), params] as const,
};

export const keySnippet = {
  all: ["snippets"] as const,
  lists: () => [...keySnippet.all, "list"] as const,
  list: (filters: { idUser: string }) =>
    [...keySnippet.lists(), filters] as const,
  details: () => [...keySnippet.all, "detail"] as const,
  detail: (params: { id: string }) =>
    [...keySnippet.details(), params] as const,
  searchs: () => [...keySnippet.all, "search"] as const,
  search: (filters: { idUser: string; search: string }) =>
    [...keySnippet.searchs(), filters] as const,
};

export const chatSelectedDocumentsKey = {
  all: ["chat_selected_documents"] as const,
  lists: () => [...chatSelectedDocumentsKey.all, "list"] as const,
  list: (filters: { idChat: string }) =>
    [...chatSelectedDocumentsKey.lists(), filters] as const,
  details: () => [...chatSelectedDocumentsKey.all, "detail"] as const,
  detail: ({ id }: { id: string }) =>
    [...chatSelectedDocumentsKey.details(), id] as const,
};

export const keySubscription = {
  all: ["subscriptions"] as const,
  details: () => [...keySubscription.all, "detail"] as const,
  detail: (params: { idUser: string }) =>
    [...keySubscription.details(), params] as const,
};

export const userKey = {
  all: ["users"] as const,
  auth: () => [...userKey.all, "auth"] as const,
  ids: () => [...userKey.all, "id"] as const,
  id: (id: string) => [...userKey.ids(), id] as const,
};
export const sessionKey = {
  all: ["session"] as const,
};

export const notionKey = {
  all: ["notion"] as const,
  search: (query: string) => [...notionKey.all, "search", { query }] as const,
};

export const podcastKey = {
  all: ["podcasts"] as const,
  lists: () => [...podcastKey.all, "list"] as const,
  infiniteList: (userId: string, params?: { sort?: string; filter?: string }) =>
    [...podcastKey.all, "infinite-list", userId, params] as const,
  details: () => [...podcastKey.all, "detail"] as const,
  detail: ({ publicUrl }: { publicUrl: string }) =>
    [...podcastKey.details(), publicUrl] as const,
  infos: () => [...podcastKey.all, "info"] as const,
  info: (podcastFilePath: string) =>
    [...podcastKey.infos(), podcastFilePath] as const,
};

export const providerTokensKey = {
  all: ["provider_tokens"] as const,
  details: () => [...providerTokensKey.all, "detail"] as const,
  detail: (idUser: string) => [...providerTokensKey.details(), idUser] as const,
};

export const keyMessageUsage = {
  all: ["message_usage"] as const,
  details: () => [...keyMessageUsage.all, "detail"] as const,
  detail: (params: { userId: string }) =>
    [...keyMessageUsage.details(), params] as const,
};
