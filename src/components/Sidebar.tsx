import { useState } from 'react';
import { Folder as FolderIcon, Star, Plus, Trash2, ChevronRight, ChevronDown } from 'lucide-react';
import type { Folder, Document } from '../types';

interface SidebarProps {
  folders: Folder[];
  documents: Document[];
  selectedDocumentId: string | null;
  onSelectDocument: (documentId: string) => void;
  onCreateFolder: (name: string, parentId: string | null) => void;
  onDeleteFolder: (folderId: string) => void;
  onMoveDocument: (documentId: string, folderId: string | null) => void;
}

export function Sidebar({
  folders,
  documents,
  selectedDocumentId,
  onSelectDocument,
  onCreateFolder,
  onDeleteFolder,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), null);
      setNewFolderName('');
      setIsCreating(false);
    }
  };

  const favorites = documents.filter(d => d.isFavorite);
  const rootFolders = folders.filter(f => f.parentId === null);

  const getDocumentsInFolder = (folderId: string | null) => {
    return documents.filter(d => d.folderId === folderId);
  };

  const renderFolder = (folder: Folder, depth: number = 0) => {
    const isExpanded = expandedFolders.has(folder.id);
    const docsInFolder = getDocumentsInFolder(folder.id);
    const subFolders = folders.filter(f => f.parentId === folder.id);

    return (
      <div key={folder.id}>
        <div
          className="flex items-center gap-2 px-3 py-2 hover:bg-petal-pink/10 cursor-pointer group"
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          <button
            onClick={() => toggleFolder(folder.id)}
            className="text-petal-pink hover:text-purple-x11"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <FolderIcon size={16} className="text-petal-pink" />
          <span className="flex-1 text-cotton-rose text-sm">{folder.name}</span>
          <button
            onClick={() => onDeleteFolder(folder.id)}
            className="opacity-0 group-hover:opacity-100 text-petal-pink hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {isExpanded && (
          <>
            {docsInFolder.map(doc => (
              <button
                key={doc.id}
                onClick={() => onSelectDocument(doc.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-petal-pink/10 ${
                  selectedDocumentId === doc.id ? 'bg-purple-x11/20' : ''
                }`}
                style={{ paddingLeft: `${(depth + 1) * 12 + 28}px` }}
              >
                <span className="text-cotton-rose/90 line-clamp-1">{doc.title}</span>
              </button>
            ))}
            {subFolders.map(subFolder => renderFolder(subFolder, depth + 1))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-full bg-indigo-velvet border-r border-shadow-grey flex flex-col">
      {/* Favorites Section */}
      <div className="border-b border-shadow-grey">
        <div className="px-3 py-2 flex items-center gap-2 text-cotton-rose font-medium">
          <Star size={16} className="text-petal-pink" />
          <span className="text-sm">Favorites</span>
        </div>
        <div className="max-h-32 overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="px-3 py-2 text-xs text-petal-pink/50">No favorites yet</div>
          ) : (
            favorites.map(doc => (
              <button
                key={doc.id}
                onClick={() => onSelectDocument(doc.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-petal-pink/10 ${
                  selectedDocumentId === doc.id ? 'bg-purple-x11/20' : ''
                }`}
              >
                <span className="text-cotton-rose/90 line-clamp-1">{doc.title}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Folders Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2 flex items-center justify-between text-cotton-rose font-medium border-b border-shadow-grey">
          <div className="flex items-center gap-2">
            <FolderIcon size={16} className="text-petal-pink" />
            <span className="text-sm">Folders</span>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="text-petal-pink hover:text-purple-x11"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* New Folder Input */}
        {isCreating && (
          <div className="px-3 py-2 border-b border-shadow-grey">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder();
                if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewFolderName('');
                }
              }}
              onBlur={handleCreateFolder}
              placeholder="Folder name..."
              className="w-full px-2 py-1 bg-shadow-grey text-cotton-rose text-sm rounded focus:outline-none focus:ring-1 focus:ring-purple-x11"
              autoFocus
            />
          </div>
        )}

        {/* Folder Tree */}
        <div className="py-2">
          {rootFolders.length === 0 ? (
            <div className="px-3 py-2 text-xs text-petal-pink/50">No folders yet</div>
          ) : (
            rootFolders.map(folder => renderFolder(folder))
          )}
        </div>

        {/* Unfiled Documents */}
        {getDocumentsInFolder(null).length > 0 && (
          <div className="border-t border-shadow-grey">
            <div className="px-3 py-2 text-xs text-petal-pink/70 font-medium">Unfiled</div>
            {getDocumentsInFolder(null).map(doc => (
              <button
                key={doc.id}
                onClick={() => onSelectDocument(doc.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-petal-pink/10 ${
                  selectedDocumentId === doc.id ? 'bg-purple-x11/20' : ''
                }`}
              >
                <span className="text-cotton-rose/90 line-clamp-1">{doc.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
