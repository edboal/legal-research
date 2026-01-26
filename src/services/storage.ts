import type { AppState, Document, Folder, Highlight, Comment } from '../types';

const STORAGE_KEY = 'legal-research-data';

const defaultState: AppState = {
  folders: [],
  documents: [],
};

export const storage = {
  // Load all data
  load(): AppState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return defaultState;
      
      const parsed = JSON.parse(data);
      // Convert date strings back to Date objects
      return {
        folders: parsed.folders.map((f: any) => ({
          ...f,
          createdAt: new Date(f.createdAt),
        })),
        documents: parsed.documents.map((d: any) => ({
          ...d,
          addedAt: new Date(d.addedAt),
          highlights: d.highlights.map((h: any) => ({
            ...h,
            createdAt: new Date(h.createdAt),
          })),
          comments: d.comments.map((c: any) => ({
            ...c,
            timestamp: new Date(c.timestamp),
          })),
        })),
      };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultState;
    }
  },

  // Save all data
  save(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Folder operations
  addFolder(state: AppState, folder: Folder): AppState {
    const newState = {
      ...state,
      folders: [...state.folders, folder],
    };
    this.save(newState);
    return newState;
  },

  updateFolder(state: AppState, folderId: string, updates: Partial<Folder>): AppState {
    const newState = {
      ...state,
      folders: state.folders.map(f => 
        f.id === folderId ? { ...f, ...updates } : f
      ),
    };
    this.save(newState);
    return newState;
  },

  deleteFolder(state: AppState, folderId: string): AppState {
    const newState = {
      ...state,
      folders: state.folders.filter(f => f.id !== folderId),
      documents: state.documents.map(d => 
        d.folderId === folderId ? { ...d, folderId: null } : d
      ),
    };
    this.save(newState);
    return newState;
  },

  // Document operations
  addDocument(state: AppState, document: Document): AppState {
    const newState = {
      ...state,
      documents: [...state.documents, document],
    };
    this.save(newState);
    return newState;
  },

  updateDocument(state: AppState, documentId: string, updates: Partial<Document>): AppState {
    const newState = {
      ...state,
      documents: state.documents.map(d => 
        d.id === documentId ? { ...d, ...updates } : d
      ),
    };
    this.save(newState);
    return newState;
  },

  deleteDocument(state: AppState, documentId: string): AppState {
    const newState = {
      ...state,
      documents: state.documents.filter(d => d.id !== documentId),
    };
    this.save(newState);
    return newState;
  },

  toggleFavorite(state: AppState, documentId: string): AppState {
    return this.updateDocument(state, documentId, {
      isFavorite: !state.documents.find(d => d.id === documentId)?.isFavorite,
    });
  },

  // Highlight operations
  addHighlight(state: AppState, documentId: string, highlight: Highlight): AppState {
    const document = state.documents.find(d => d.id === documentId);
    if (!document) return state;

    return this.updateDocument(state, documentId, {
      highlights: [...document.highlights, highlight],
    });
  },

  updateHighlight(
    state: AppState,
    documentId: string,
    highlightId: string,
    updates: Partial<Highlight>
  ): AppState {
    const document = state.documents.find(d => d.id === documentId);
    if (!document) return state;

    return this.updateDocument(state, documentId, {
      highlights: document.highlights.map(h =>
        h.id === highlightId ? { ...h, ...updates } : h
      ),
    });
  },

  deleteHighlight(state: AppState, documentId: string, highlightId: string): AppState {
    const document = state.documents.find(d => d.id === documentId);
    if (!document) return state;

    return this.updateDocument(state, documentId, {
      highlights: document.highlights.filter(h => h.id !== highlightId),
    });
  },

  // Comment operations
  addComment(state: AppState, documentId: string, comment: Comment): AppState {
    const document = state.documents.find(d => d.id === documentId);
    if (!document) return state;

    return this.updateDocument(state, documentId, {
      comments: [...document.comments, comment],
    });
  },

  deleteComment(state: AppState, documentId: string, commentId: string): AppState {
    const document = state.documents.find(d => d.id === documentId);
    if (!document) return state;

    return this.updateDocument(state, documentId, {
      comments: document.comments.filter(c => c.id !== commentId),
    });
  },
};
