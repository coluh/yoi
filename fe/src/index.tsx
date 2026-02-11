import { render } from "preact";
import { LocationProvider, Router, Route, lazy } from "preact-iso";

import { Header } from "./components/Header.jsx";
import { Home } from "./pages/Home/index.jsx";
import { ArticleList } from "./pages/Article/index.js";
import { NotFound } from "./pages/_404.jsx";
import "./store/dark";
import "./style.css";

// const ArticleList = lazy(() => import("./pages/Article/index.js").then((m) => m.ArticleList));
const ArticleDetail = lazy(() => import("./pages/Article/detail.js"));

export function App() {
  return (
    <LocationProvider>
      <Header />
      <main>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/article" component={ArticleList} />
          <Route path="/article/:id" component={ArticleDetail} />
          <Route default component={NotFound} />
        </Router>
      </main>
    </LocationProvider>
  );
}

render(<App />, document.getElementById("app"));
