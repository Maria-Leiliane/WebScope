export interface SearchResult {
  url: string;               // URL containing the keyword
  snippet?: string;          // Context surrounding the keyword
  foundAt?: Date;            // Date/Time of capture
  depth?: number;            // Crawler depth
  fromUrl?: string;          // Source link
}
