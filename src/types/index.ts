export type DocumentSource = 'legislation';

export interface Highlight {
  id: string;
  range: {
    start: number;
    end: number;
  };
  color: string;
  note: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  position: number;
  text: string;
  timestamp: Date;
}

export interface Document {
  id: string;
  title: string;
  url: string;
  source: DocumentSource;
  folderId: string | null;
  isFavorite: boolean;
  content: string;
  highlights: Highlight[];
  comments: Comment[];
  addedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
}

export interface AppState {
  folders: Folder[];
  documents: Document[];
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: DocumentSource;
}
