export interface Historia {
  id: string;
  storyId: string;
  initials: string;
  author: string;
  username: string;
  reference: string;
  verse: string;
  description: string | null;
  position: number;
  totalVerses: number;
  remaining: string;
  elapsed: string;
  favorites: number;
  reactions: number;
  views: number;
  visibility?: "public" | "followers";
  status?: string;
  normalized_reference: string;
}