import useDark from "../utils/useDark";
import "./toggle.css";

export function DarkToggle() {
  const [isDark, setIsDark] = useDark();

  return (
    <button onClick={() => setIsDark(!isDark)} className="toggle" aria-label="Toggle Dark Mode">
      <div className={`toggle-track ${isDark ? "toggle-active" : "toggle-inactive"}`}>
        <div className="toggle-thumb">{isDark ? "🌙" : "☀️"}</div>
      </div>
    </button>
  );
}
