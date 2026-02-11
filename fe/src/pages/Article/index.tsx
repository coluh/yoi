import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ErrorCard, InfoCard } from "../../components/Cards";
import { formatTime } from "../../utils/time";
import "./style.css";
import { Markdown } from "../../components/Markdown";

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

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { route } = useLocation();

  useEffect(() => {
    fetch("/api/articles")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Error fetching article list: ${res.statusText}`);
        }
        const data: ArticleListResp = await res.json();
        setArticles(data.articles);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <InfoCard message="Loading articles..." />;
  }

  if (error) {
    return <ErrorCard message={error} />;
  }

  const handleArticleClick = (id: string) => {
    route(`/article/${id}`);
  };

  return (
    <div className="article-list">
      {articles.map((article) => (
        <article key={article.id} onClick={() => handleArticleClick(article.id)}>
          <h2>
            <a
              href={`/article/${article.id}`}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {article.title}
            </a>
          </h2>
          <p>{article.summary}</p>
          <time datetime={article.updatedAt}>{formatTime(article.updatedAt)}</time>
        </article>
      ))}
    </div>
  );
}

export function ArticleDetail({ id }: { id: string }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`Error fetching article: ${res.statusText}`);
        }
        const data: Article = await res.json();
        setArticle(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <InfoCard message="Loading article..." />;
  }

  if (error) {
    return <ErrorCard message={error} />;
  }

  if (!article) {
    return <ErrorCard message="Article not found" />;
  }

  return (
    <article className="article-detail">
      <Markdown contentMd={article.content} prefix={`/api/articles/${article.id}/`} />
      <time datetime={article.updatedAt}>{formatTime(article.updatedAt)}</time>
    </article>
  );
}
