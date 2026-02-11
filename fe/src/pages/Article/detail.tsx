import { useEffect, useState } from "preact/hooks";
import { ErrorCard, InfoCard } from "../../components/Cards";
import { Markdown } from "../../components/Markdown";
import { formatTime } from "../../utils/time";

export default function ArticleDetail({ id }: { id: string }) {
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
