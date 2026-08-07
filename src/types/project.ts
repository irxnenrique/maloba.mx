export type ArtworkKind = 'orbit' | 'type' | 'grid' | 'wave' | 'stamp' | 'arch';
export interface Project {
  slug: string;
  name: string;
  client: string;
  year: string;
  category: string;
  description: string;
  services: string[];
  accent: string;
  secondary: string;
  artwork: ArtworkKind;
  context: string;
  problem: string;
  concept: string;
  solution: string;
  coverImage?: string;
  galleryImages?: string[];
  isCustom?: boolean;
}
