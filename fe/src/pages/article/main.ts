import "@utils/dark";
import "@styles/default.css";
import "@styles/article.css";
import { getArticleList } from "@/api/files";

async function init() {
  const articles = await getArticleList();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
