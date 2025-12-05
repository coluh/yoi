import { checkHealth } from "./api/health";
import "./style.css";

checkHealth().then((ok) => {
  document.querySelector<HTMLElement>("#health")!.innerHTML = ok
    ? '<span style="color: lawngreen">server running</span>'
    : '<span style="color: red">server not running</span>';
});
