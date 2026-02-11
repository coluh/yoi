import { useEffect, useState } from "preact/hooks";
import { getDark, setDark, subscribeDark } from "../store/dark";

export default function useDark() {
  const [isDark, setIsDark] = useState(getDark);

  useEffect(() => {
    const unsubscribe = subscribeDark(setIsDark);
    return unsubscribe;
  }, []);

  return [isDark, setDark] as const;
}
