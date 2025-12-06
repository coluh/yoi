import type { Idea, IdeaList } from "./types";

export const getIdeaList = async (): Promise<IdeaList> => {
  const res = await fetch("/api/ideas");
  if (!res.ok) {
    console.error("Error get idea list:", res.status, res.statusText, res.json());
    return { titles: [] };
  }
  return res.json() as Promise<IdeaList>;
};

export const getIdea = async (title: string): Promise<Idea> => {
  const res = await fetch(`/api/ideas/${title}`);
  if (!res.ok) {
    console.error("Error get idea:", res.status, res.statusText, res.json());
    return { content: "" };
  }
  return res.json() as Promise<Idea>;
};
