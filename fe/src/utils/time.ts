export function formatTime(datetimeStr: string): string {
  const date = new Date(datetimeStr);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}
