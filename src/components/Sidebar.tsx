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
          className="flex items-center gap-2 px-3 py-2 hover:bg-cool-steel/20 cursor-pointer group rounded-md mx-1"
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          <button
            onClick={() => toggleFolder(folder.id)}
            className="text-dim-grey hover:text-iron-grey"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          <FolderIcon size={16} className="text-cool-steel" />
          <span className="flex-1 text-iron-grey text-sm font-medium">{folder.name}</span>
          <button
            onClick={() => onDeleteFolder(folder.id)}
            className="opacity-0 group-hover:opacity-100 text-dim-grey hover:text-red-600 transition-opacity"
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
                className={`w-full text-left px-3 py-2 text-sm hover:bg-cool-steel/20 rounded-md mx-1 ${
                  selectedDocumentId === doc.id ? 'bg-cool-steel/40 border-l-2 border-iron-grey' : ''
                }`}
                style={{ paddingLeft: `${(depth + 1) * 12 + 28}px` }}
              >
                <span className="text-iron-grey line-clamp-1">{doc.title}</span>
              </button>
            ))}
            {subFolders.map(subFolder => renderFolder(subFolder, depth + 1))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 h-full bg-khaki-beige border-r-2 border-dim-grey flex flex-col">
      {/* Favorites Section */}
      <div className="border-b border-dim-grey/30 bg-iron-grey">
        <div className="px-3 py-2.5 flex items-center gap-2">
          <Star size={16} className="text-sand-dune fill-sand-dune" />
          <span className="text-sm font-semibold text-sand-dune">Favorites</span>
        </div>
      </div>
      <div className="max-h-32 overflow-y-auto border-b border-dim-grey/30 bg-iron-grey/5">
        {favorites.length === 0 ? (
          <div className="px-3 py-3 text-xs text-dim-grey/60 italic">No favorites yet</div>
        ) : (
          favorites.map(doc => (
            <button
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-cool-steel/20 rounded-md mx-1 ${
                selectedDocumentId === doc.id ? 'bg-cool-steel/40 border-l-2 border-iron-grey' : ''
              }`}
            >
              <span className="text-iron-grey line-clamp-1 font-medium">{doc.title}</span>
            </button>
          ))
        )}
      </div>

      {/* Folders Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2.5 flex items-center justify-between bg-iron-grey border-b border-dim-grey/30">
          <div className="flex items-center gap-2">
            <FolderIcon size={16} className="text-sand-dune" />
            <span className="text-sm font-semibold text-sand-dune">Folders</span>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="text-sand-dune hover:text-cool-steel transition-colors"
            title="Create folder"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* New Folder Input */}
        {isCreating && (
          <div className="px-3 py-3 border-b border-dim-grey/30 bg-iron-grey/5">
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
              className="w-full px-2 py-1.5 bg-sand-dune text-iron-grey text-sm rounded focus:outline-none focus:ring-2 focus:ring-cool-steel border border-dim-grey/30"
              autoFocus
            />
          </div>
        )}

        {/* Folder Tree */}
        <div className="py-2">
          {rootFolders.length === 0 ? (
            <div className="px-3 py-3 text-xs text-dim-grey/60 italic">No folders yet</div>
          ) : (
            rootFolders.map(folder => renderFolder(folder))
          )}
        </div>

        {/* Unfiled Documents */}
        {getDocumentsInFolder(null).length > 0 && (
          <div className="border-t border-dim-grey/30 mt-2 pt-2">
            <div className="px-3 py-1.5 text-xs text-dim-grey/70 font-semibold uppercase tracking-wider">Unfiled</div>
            {getDocumentsInFolder(null).map(doc => (
              <button
                key={doc.id}
                onClick={() => onSelectDocument(doc.id)}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-cool-steel/20 rounded-md mx-1 ${
                  selectedDocumentId === doc.id ? 'bg-cool-steel/40 border-l-2 border-iron-grey' : ''
                }`}
              >
                <span className="text-iron-grey line-clamp-1">{doc.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
