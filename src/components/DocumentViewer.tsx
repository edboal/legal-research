import { useState } from 'react';
import { Star, FolderInput, Trash2, MessageSquare, Highlighter } from 'lucide-react';
import type { Document, Folder, Highlight, Comment } from '../types';

interface DocumentViewerProps {
  document: Document | null;
  folders: Folder[];
  onToggleFavorite: (documentId: string) => void;
  onMoveToFolder: (documentId: string, folderId: string | null) => void;
  onDelete: (documentId: string) => void;
  onAddHighlight: (documentId: string, highlight: Highlight) => void;
  onAddComment: (documentId: string, comment: Comment) => void;
}

export function DocumentViewer({
  document,
  folders,
  onToggleFavorite,
  onMoveToFolder,
  onDelete,
  onAddHighlight,
  onAddComment,
}: DocumentViewerProps) {
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [highlightMode, setHighlightMode] = useState(false);

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center bg-shadow-grey text-petal-pink/50">
        Select a document to view
      </div>
    );
  }

  const handleTextSelection = () => {
    if (!highlightMode) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const highlight: Highlight = {
      id: crypto.randomUUID(),
      range: {
        start: range.startOffset,
        end: range.endOffset,
      },
      color: '#c179b9', // petal-pink
      note: '',
      createdAt: new Date(),
    };

    onAddHighlight(document.id, highlight);
    selection.removeAllRanges();
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      position: 0, // Could be enhanced to track position
      text: newComment.trim(),
      timestamp: new Date(),
    };

    onAddComment(document.id, comment);
    setNewComment('');
  };

  return (
    <div className="h-full flex flex-col bg-shadow-grey">
      {/* Document Header */}
      <div className="p-4 border-b border-indigo-velvet bg-indigo-velvet/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-lg font-medium text-cotton-rose mb-1">
              {document.title}
            </h1>
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-x11 hover:text-petal-pink"
            >
              {document.url}
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => onToggleFavorite(document.id)}
              className={`p-2 rounded hover:bg-petal-pink/20 transition-colors ${
                document.isFavorite ? 'text-petal-pink' : 'text-cotton-rose/50'
              }`}
              title="Toggle favorite"
            >
              <Star size={18} fill={document.isFavorite ? 'currentColor' : 'none'} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowFolderMenu(!showFolderMenu)}
                className="p-2 text-cotton-rose/70 hover:text-purple-x11 rounded hover:bg-petal-pink/20 transition-colors"
                title="Move to folder"
              >
                <FolderInput size={18} />
              </button>

              {showFolderMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-indigo-velvet border border-shadow-grey rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      onMoveToFolder(document.id, null);
                      setShowFolderMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-cotton-rose hover:bg-petal-pink/20"
                  >
                    Unfiled
                  </button>
                  {folders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => {
                        onMoveToFolder(document.id, folder.id);
                        setShowFolderMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-cotton-rose hover:bg-petal-pink/20"
                    >
                      {folder.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setHighlightMode(!highlightMode)}
              className={`p-2 rounded hover:bg-petal-pink/20 transition-colors ${
                highlightMode ? 'bg-purple-x11 text-white' : 'text-cotton-rose/70'
              }`}
              title="Highlight mode"
            >
              <Highlighter size={18} />
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 text-cotton-rose/70 hover:text-purple-x11 rounded hover:bg-petal-pink/20 transition-colors"
              title="Toggle comments"
            >
              <MessageSquare size={18} />
            </button>

            <button
              onClick={() => onDelete(document.id)}
              className="p-2 text-cotton-rose/70 hover:text-red-400 rounded hover:bg-red-400/10 transition-colors"
              title="Delete document"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Document Content */}
        <div 
          className="flex-1 overflow-y-auto p-6"
          onMouseUp={handleTextSelection}
        >
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-invert max-w-none text-cotton-rose"
              dangerouslySetInnerHTML={{ __html: document.content }}
            />

            {/* Render highlights as overlays */}
            {document.highlights.length > 0 && (
              <div className="mt-4 p-4 bg-indigo-velvet/50 rounded-lg">
                <h3 className="text-sm font-medium text-cotton-rose mb-2">Highlights</h3>
                {document.highlights.map(h => (
                  <div key={h.id} className="text-xs text-petal-pink mb-1">
                    • {h.note || 'Highlighted section'}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Comments Sidebar */}
        {showComments && (
          <div className="w-80 border-l border-indigo-velvet bg-indigo-velvet/30 flex flex-col">
            <div className="p-4 border-b border-shadow-grey">
              <h2 className="text-sm font-medium text-cotton-rose mb-3">Comments</h2>
              
              <div className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 bg-shadow-grey text-cotton-rose text-sm rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-x11"
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  className="w-full bg-purple-x11 text-white py-2 rounded text-sm hover:bg-petal-pink transition-colors"
                >
                  Add Comment
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {document.comments.length === 0 ? (
                <div className="text-xs text-petal-pink/50">No comments yet</div>
              ) : (
                document.comments.map(comment => (
                  <div key={comment.id} className="p-3 bg-shadow-grey rounded-lg">
                    <div className="text-xs text-petal-pink/70 mb-1">
                      {comment.timestamp.toLocaleDateString()}
                    </div>
                    <div className="text-sm text-cotton-rose">{comment.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
