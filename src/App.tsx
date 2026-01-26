import { useState, useEffect } from 'react';
import { Search } from './components/Search';
import { Sidebar } from './components/Sidebar';
import { DocumentViewer } from './components/DocumentViewer';
import type { AppState, Document, Folder, SearchResult, Highlight, Comment } from './types';
import { storage } from './services/storage';
import { legislationAPI } from './services/legislationAPI';

function App() {
  const [state, setState] = useState<AppState>(() => storage.load());
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(true);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    storage.save(state);
  }, [state]);

  const selectedDocument = state.documents.find(d => d.id === selectedDocumentId) || null;

  const handleSelectSearchResult = async (result: SearchResult) => {
    // Check if document already exists
    const existing = state.documents.find(d => d.url === result.url);
    if (existing) {
      setSelectedDocumentId(existing.id);
      setShowSearch(false);
      return;
    }

    // Fetch document content
    try {
      console.log('Loading document from:', result.url);
      const content = await legislationAPI.getDocument(result.url);
      console.log('Document loaded successfully');

      const newDocument: Document = {
        id: crypto.randomUUID(),
        title: result.title,
        url: result.url,
        source: result.source,
        folderId: null,
        isFavorite: false,
        content,
        highlights: [],
        comments: [],
        addedAt: new Date(),
      };

      const newState = storage.addDocument(state, newDocument);
      setState(newState);
      setSelectedDocumentId(newDocument.id);
      setShowSearch(false);
    } catch (error) {
      console.error('Error loading document:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to load document: ${errorMessage}\n\nPlease check the browser console for details.`);
    }
  };

  const handleCreateFolder = (name: string, parentId: string | null) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      parentId,
      createdAt: new Date(),
    };
    const newState = storage.addFolder(state, newFolder);
    setState(newState);
  };

  const handleDeleteFolder = (folderId: string) => {
    if (confirm('Delete this folder? Documents will be moved to Unfiled.')) {
      const newState = storage.deleteFolder(state, folderId);
      setState(newState);
    }
  };

  const handleToggleFavorite = (documentId: string) => {
    const newState = storage.toggleFavorite(state, documentId);
    setState(newState);
  };

  const handleMoveDocument = (documentId: string, folderId: string | null) => {
    const newState = storage.updateDocument(state, documentId, { folderId });
    setState(newState);
  };

  const handleDeleteDocument = (documentId: string) => {
    if (confirm('Delete this document?')) {
      const newState = storage.deleteDocument(state, documentId);
      setState(newState);
      setSelectedDocumentId(null);
    }
  };

  const handleAddHighlight = (documentId: string, highlight: Highlight) => {
    const newState = storage.addHighlight(state, documentId, highlight);
    setState(newState);
  };

  const handleAddComment = (documentId: string, comment: Comment) => {
    const newState = storage.addComment(state, documentId, comment);
    setState(newState);
  };

  return (
    <div className="h-screen flex flex-col bg-shadow-grey">
      {/* Header */}
      <header className="bg-indigo-velvet border-b border-petal-pink/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Legal Research Tool</h1>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="px-4 py-2 bg-purple-bright text-white font-medium rounded-lg hover:bg-purple-x11 transition-colors text-sm"
          >
            {showSearch ? 'Hide Search' : 'Show Search'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Search Panel */}
        {showSearch && (
          <div className="w-96 border-r border-indigo-velvet">
            <Search onSelectResult={handleSelectSearchResult} />
          </div>
        )}

        {/* Sidebar */}
        <Sidebar
          folders={state.folders}
          documents={state.documents}
          selectedDocumentId={selectedDocumentId}
          onSelectDocument={setSelectedDocumentId}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
          onMoveDocument={handleMoveDocument}
        />

        {/* Document Viewer */}
        <div className="flex-1">
          <DocumentViewer
            document={selectedDocument}
            folders={state.folders}
            onToggleFavorite={handleToggleFavorite}
            onMoveToFolder={handleMoveDocument}
            onDelete={handleDeleteDocument}
            onAddHighlight={handleAddHighlight}
            onAddComment={handleAddComment}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
