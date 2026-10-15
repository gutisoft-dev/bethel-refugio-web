import type { PublicStory } from "../actions/history/story.action";
import type { HistoryFeed } from "../components/histories/HistoriesHeader";
import type { Historia } from "../interfaces/History.interface";

export const getFeedLabel = (feed: HistoryFeed) =>
  feed === "mine"
    ? "tus historias"
    : feed === "following"
      ? "historias de las personas que sigues"
      : "historias públicas";

export const getStoryReference = (verses: PublicStory["verses"]) => {
  const first = verses[0]?.verse.reference;
  const last = verses.at(-1)?.verse.reference;
  if (!first || !last || verses.length < 2) return first ?? "Historia";

  const firstMatch = first.match(/^(.+?\s+\d+):(\d+)$/);
  const lastMatch = last.match(/^(.+?\s+\d+):(\d+)$/);
  if (firstMatch && lastMatch && firstMatch[1] === lastMatch[1]) {
    return `${firstMatch[1]}:${firstMatch[2]}-${lastMatch[2]}`;
  }

  return `${first}–${last}`;
};

export const getTimeAgo = (createdAt: string) => {
  const createdAtMs = Date.parse(createdAt);
  if (Number.isNaN(createdAtMs)) return "";

  const minutes = Math.max(0, Math.floor((Date.now() - createdAtMs) / 60_000));
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "Hace 1 h" : `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "Hace 1 día" : `Hace ${days} días`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "Hace 1 sem" : `Hace ${weeks} sem`;
};

const getRemainingTime = (expiresAt: string) => {
  const expiresAtMs = Date.parse(expiresAt);

  if (Number.isNaN(expiresAtMs)) return "Historia pública";

  const remainingHours = Math.max(
    0,
    Math.ceil((expiresAtMs - Date.now()) / (1000 * 60 * 60)),
  );

  return `Quedan ${remainingHours}h`;
};

const getElapsedTime = (createdAt: string) => {
  const createdAtMs = Date.parse(createdAt);
  if (Number.isNaN(createdAtMs)) return "";

  const minutes = Math.max(0, Math.floor((Date.now() - createdAtMs) / 60_000));
  if (minutes < 1) return "Ahora";
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours === 1 ? "Hace 1 h" : `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 7) return days === 1 ? "Hace 1 día" : `Hace ${days} días`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "Hace 1 sem" : `Hace ${weeks} sem`;
};

export const toSlides = (stories: PublicStory[], isMine = false): Historia[] =>
  stories.flatMap((story) => {
    const username =
      story.user?.username.replace(/^@/, "").trim() ||
      (isMine ? "Tú" : "usuario");
    const author = isMine ? "Mi historia" : username;
    const initials = isMine
      ? "TÚ"
      : username.slice(0, 2).toLocaleUpperCase("es");
    const verses = [...story.verses].sort(
      (first, second) => first.position - second.position,
    );

    return verses.map((item, index) => ({
      id: `${story.id}-${item.position}`,
      storyId: story.id,
      initials,
      author,
      username,
      reference: item.verse.reference || item.verse.normalized_reference,
      verse: item.verse.text,
      description: item.caption,
      position: item.position || index + 1,
      totalVerses: verses.length,
      remaining: getRemainingTime(story.expires_at),
      elapsed: getElapsedTime(story.created_at),
      favorites: item.count_favorite,
      reactions: item.count_reaction,
      views: item.views_count,
      visibility: story.visibility,
      status: story.status,
    }));
  });

export const getVerseFontSize = (text: string) =>
  Math.max(16, Math.min(36, 36 * Math.sqrt(100 / Math.max(100, text.length))));
