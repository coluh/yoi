
// server/internal/handler/models.go

export type Idea = {
  content: string;
};
export type IdeaList = {
  titles: string[];
};

export type Article = {
  id: string; // filename without extension
  title: string;
  content: string;
  updateAt: string; // ISO date string
  summary: string;
};
export type ArticleList = {
  articles: Article[];
  total: number;
};
