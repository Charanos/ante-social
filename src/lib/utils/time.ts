export function formatTimeComprehensive(date: string | Date): string {
  const target = new Date(date);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) return "Expired";

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} left`;
  }
  if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? "s" : ""} left`;
  }
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} left`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} left`;
  }
  return `${minutes} minute${minutes !== 1 ? "s" : ""} left`;
}
