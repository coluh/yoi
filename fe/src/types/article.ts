type Article = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  summary: string;
};
type ArticleListResp = {
  articles: Article[];
  total: number;
  // page: number;
  // pageSize: number;
};
