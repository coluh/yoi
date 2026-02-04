import sunUrl from "@/assets/icons/sun.svg";
import moonUrl from "@/assets/icons/moon.svg";

document.querySelectorAll<HTMLImageElement>(".dark-toggle img").forEach((icon) => {
  icon.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");
    if (document.documentElement.classList.contains("dark-mode")) {
      icon.src = sunUrl;
      icon.style.filter = "invert(1)";
    } else {
      icon.src = moonUrl;
      icon.style.filter = "invert(0)";
    }
  });
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
  const icon = document.querySelector<HTMLImageElement>(".dark-toggle img");
  if (e.matches) {
    document.documentElement.classList.add("dark-mode");
    if (icon) {
      icon.src = sunUrl;
      icon.style.filter = "invert(1)";
    }
  } else {
    document.documentElement.classList.remove("dark-mode");
    if (icon) {
      icon.src = moonUrl;
      icon.style.filter = "invert(0)";
    }
  }
});
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.classList.add("dark-mode");
  const icon = document.querySelector<HTMLImageElement>(".dark-toggle img");
  if (icon) {
    icon.src = sunUrl;
    icon.style.filter = "invert(1)";
  }
}
