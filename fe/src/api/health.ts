export const checkHealth = async (): Promise<boolean> => {
  const res = await fetch("/api/health");
  if (!res.ok) {
    return false;
  }
  return true;
};
