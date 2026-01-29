import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Search as SearchComponent } from './components/Search';
import { Sidebar } from './components/Sidebar';
import { DocumentViewer } from './components/DocumentViewer';
import type { AppState, Document, Folder, SearchResult, Highlight, Comment } from './types';
import { storage } from './services/storage';
import { legislationAPI } from './services/legislationAPI';

function App() {
  const [state, setState] = useState<AppState>(() => storage.load());
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    storage.save(state);
  }, [state]);

  const selectedDocument = state.documents.find(d => d.id === selectedDocumentId) || null;

  const handleSelectSearchResult = async (result: SearchResult) => {
    const existing = state.documents.find(d => d.url === result.url);
    if (existing) {
      setSelectedDocumentId(existing.id);
      return;
    }

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
    <div className="h-screen flex flex-col bg-neutral-100">
      {/* Header */}
      <header className="bg-neutral-800 border-b-2 border-neutral-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-neutral-700 rounded-lg flex items-center justify-center">
              <span className="text-2xl text-white font-bold">§</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Legal Research Tool</h1>
              <p className="text-sm text-neutral-100">UK Legislation Database</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`px-4 py-2 font-medium rounded-lg transition-all text-sm flex items-center gap-2 ${
                showSearch
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
              }`}
              title={showSearch ? 'Hide search panel' : 'Show search panel'}
            >
              {showSearch ? <X size={16} /> : <Search size={16} />}
              {showSearch ? 'Hide Search' : 'Search'}
            </button>
            
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`px-4 py-2 font-medium rounded-lg transition-all text-sm flex items-center gap-2 ${
                showSidebar
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
              }`}
              title={showSidebar ? 'Hide favorites/folders' : 'Show favorites/folders'}
            >
              {showSidebar ? <X size={16} /> : <Menu size={16} />}
              {showSidebar ? 'Hide Sidebar' : 'Sidebar'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Search Panel */}
        {showSearch && (
          <div className="w-96 border-r-2 border-neutral-300 bg-white flex-shrink-0">
            <SearchComponent onSelectResult={handleSelectSearchResult} />
          </div>
        )}

        {/* Sidebar */}
        {showSidebar && (
          <div className="flex-shrink-0">
            <Sidebar
              folders={state.folders}
              documents={state.documents}
              selectedDocumentId={selectedDocumentId}
              onSelectDocument={setSelectedDocumentId}
              onCreateFolder={handleCreateFolder}
              onDeleteFolder={handleDeleteFolder}
              onMoveDocument={handleMoveDocument}
            />
          </div>
        )}

        {/* Document Viewer */}
        <div className="flex-1 min-w-0">
          <DocumentViewer
            document={selectedDocument}
            folders={state.folders}
            onToggleFavorite={handleToggleFavorite}
            onMoveToFolder={handleMoveDocument}
            onDelete={handleDeleteDocument}
            onAddComment={handleAddComment}
            onAddHighlight={handleAddHighlight}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
