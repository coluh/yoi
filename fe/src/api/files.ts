import type { Article, ArticleList, Idea, IdeaList } from "./types";

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

export const getArticleList = async (): Promise<ArticleList> => {
  const res = await fetch("/api/articles");
  if (!res.ok) {
    console.error("Error get article list:", res.status, res.statusText, res.json());
    return { articles: [], total: 0 };
  }
  return (await res.json()) as ArticleList;
};

// TODO: use optionals
export const getArticle = async (id: string): Promise<Article> => {
  const res = await fetch(`/api/articles/${id}`);
  if (!res.ok) {
    console.error("Error get article:", res.status, res.statusText, res.json());
    return { id: "", title: "", content: "", date: "" };
  }
  return (await res.json()) as Article;
};
