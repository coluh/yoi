import { useLocation } from "preact-iso";
import Avatar from "../assets/avatar.svg";
import { DarkToggle } from "./DarkToggle";
import "./header.css";

export function Header() {
  const { url } = useLocation();
  const page = url.split("/")[1] || "";

  return (
    <header>
      <img src={Avatar} alt="avatar" className="avatar" />
      <h2 className="title">Destywen</h2>
      <DarkToggle />
      <nav>
        <a href="/" className={page == "" && "active"}>
          Home
        </a>
        <a href="/article" className={page == "article" && "active"}>
          Article
        </a>
        {/* <a href="/404" className={url == "/404" && "active"}>
          404
        </a> */}
      </nav>
    </header>
  );
}
