import { useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { ErrorCard, InfoCard } from "../../components/Cards";
import { formatTime } from "../../utils/time";
import "./style.css";

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
