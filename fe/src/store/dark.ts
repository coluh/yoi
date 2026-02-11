let isDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;

export function getDark() {
  return isDark;
}

const listeners = new Set<(isDark: boolean) => void>();
export function subscribeDark(listener: (isDark: boolean) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setDark(value: boolean) {
  if (isDark !== value) {
    isDark = value;
    document.documentElement.classList.toggle("dark", isDark);
    listeners.forEach((listener) => listener(isDark));
  }
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
  setDark(event.matches);
});
