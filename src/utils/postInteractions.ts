export type Interaction = {
  id: string;
  liked: boolean;
  interested: boolean;
  comments: CommentData[];
  likedCommentIds?: string[];
};

export type CommentData = {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  likes: number;
};

export const getInteractions = (): Interaction[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("seedlet-interactions");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveInteractions = (interactions: Interaction[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("seedlet-interactions", JSON.stringify(interactions));
};

export const getInteractionById = (id: string): Interaction => {
  return (
    getInteractions().find((i) => i.id === id) || {
      id,
      liked: false,
      interested: false,
      comments: [] as CommentData[],
      likedCommentIds: [],
    }
  );
};

export const updateInteraction = (
  id: string,
  partial: Partial<Interaction>
) => {
  const current = getInteractions();
  const updated = current.map((i) => (i.id === id ? { ...i, ...partial } : i));
  if (!current.some((i) => i.id === id)) {
    updated.push({
      id,
      liked: false,
      interested: false,
      comments: [],
      ...partial,
    });
  }
  saveInteractions(updated);
};
