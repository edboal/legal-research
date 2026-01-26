import { useState, useEffect, useRef, useMemo } from 'react';
import { Star, FolderInput, Trash2, MessageSquare, Highlighter, ExternalLink, List, X } from 'lucide-react';
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

interface TOCItem {
  id: string;
  title: string;
  level: number;
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
  const [showTOC, setShowTOC] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [highlightMode, setHighlightMode] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract table of contents from document
  const tableOfContents = useMemo(() => {
    if (!document?.content) return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(document.content, 'text/html');
    const toc: TOCItem[] = [];
    
    // Find all headings (h1, h2, h3, h4)
    const headings = doc.querySelectorAll('h1, h2, h3, h4, .LegHeading, .LegP1GroupTitle, .LegClearFix');
    
    headings.forEach((heading, index) => {
      const text = heading.textContent?.trim();
      if (text && text.length > 0 && text.length < 200) {
        // Assign an ID if it doesn't have one
        const id = heading.id || `toc-item-${index}`;
        if (!heading.id) {
          heading.id = id;
        }
        
        // Determine level from tag name or class
        let level = 1;
        if (heading.tagName === 'H2' || heading.classList.contains('LegP1GroupTitle')) level = 2;
        if (heading.tagName === 'H3') level = 3;
        if (heading.tagName === 'H4') level = 4;
        
        toc.push({ id, title: text, level });
      }
    });
    
    return toc;
  }, [document?.content]);

  // Inject IDs into content for navigation
  useEffect(() => {
    if (contentRef.current && document?.content) {
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, .LegHeading, .LegP1GroupTitle');
      headings.forEach((heading, index) => {
        if (!heading.id) {
          heading.id = `toc-item-${index}`;
        }
      });
    }
  }, [document?.content]);

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = window.document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Highlight temporarily
      element.style.backgroundColor = '#93a8ac33';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 2000);
    }
    setShowTOC(false);
  };

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center bg-sand-dune">
        <div className="text-center px-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-khaki-beige flex items-center justify-center">
            <span className="text-4xl text-dim-grey">§</span>
          </div>
          <p className="text-xl font-semibold text-iron-grey mb-2">No Document Selected</p>
          <p className="text-sm text-dim-grey">Search for legislation or browse your saved documents</p>
        </div>
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
      color: '#93a8ac',
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
      position: 0,
      text: newComment.trim(),
      timestamp: new Date(),
    };

    onAddComment(document.id, comment);
    setNewComment('');
  };

  return (
    <div className="h-full flex flex-col bg-sand-dune">
      {/* Document Header */}
      <div className="p-4 bg-iron-grey border-b-2 border-dim-grey shadow-sm flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-sand-dune mb-2 leading-tight">
              {document.title}
            </h1>
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cool-steel hover:text-sand-dune flex items-center gap-1 w-fit"
            >
              <ExternalLink size={14} />
              <span className="truncate">View on legislation.gov.uk</span>
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1.5 flex-shrink-0">
            {/* TOC Button */}
            {tableOfContents.length > 0 && (
              <button
                onClick={() => setShowTOC(!showTOC)}
                className={`p-2 rounded-lg transition-all relative ${
                  showTOC 
                    ? 'bg-cool-steel text-iron-grey' 
                    : 'bg-dim-grey/20 text-sand-dune hover:bg-sand-dune/20'
                }`}
                title="Table of Contents"
              >
                <List size={18} />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sand-dune text-iron-grey text-xs font-bold rounded-full flex items-center justify-center">
                  {tableOfContents.length}
                </span>
              </button>
            )}

            <button
              onClick={() => onToggleFavorite(document.id)}
              className={`p-2 rounded-lg transition-all ${
                document.isFavorite 
                  ? 'bg-sand-dune text-iron-grey' 
                  : 'bg-dim-grey/20 text-sand-dune hover:bg-sand-dune/20'
              }`}
              title="Toggle favorite"
            >
              <Star size={18} fill={document.isFavorite ? 'currentColor' : 'none'} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowFolderMenu(!showFolderMenu)}
                className="p-2 bg-dim-grey/20 text-sand-dune hover:bg-sand-dune/20 rounded-lg transition-all"
                title="Move to folder"
              >
                <FolderInput size={18} />
              </button>

              {showFolderMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-sand-dune border-2 border-dim-grey rounded-lg shadow-xl z-10 overflow-hidden max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      onMoveToFolder(document.id, null);
                      setShowFolderMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-iron-grey hover:bg-cool-steel/20 font-medium"
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
                      className="w-full text-left px-4 py-2.5 text-sm text-iron-grey hover:bg-cool-steel/20 font-medium border-t border-dim-grey/20"
                    >
                      {folder.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setHighlightMode(!highlightMode)}
              className={`p-2 rounded-lg transition-all relative ${
                highlightMode 
                  ? 'bg-cool-steel text-iron-grey' 
                  : 'bg-dim-grey/20 text-sand-dune hover:bg-sand-dune/20'
              }`}
              title="Highlight mode"
            >
              <Highlighter size={18} />
              {document.highlights.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-sand-dune text-iron-grey text-xs font-bold rounded-full flex items-center justify-center">
                  {document.highlights.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 bg-dim-grey/20 text-sand-dune hover:bg-sand-dune/20 rounded-lg transition-all relative"
              title="Toggle comments"
            >
              <MessageSquare size={18} />
              {document.comments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cool-steel text-iron-grey text-xs font-bold rounded-full flex items-center justify-center">
                  {document.comments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => onDelete(document.id)}
              className="p-2 bg-dim-grey/20 text-sand-dune hover:bg-red-600 hover:text-white rounded-lg transition-all"
              title="Delete document"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Table of Contents Sidebar */}
        {showTOC && (
          <div className="w-80 border-r-2 border-dim-grey bg-khaki-beige flex flex-col shadow-lg overflow-hidden">
            <div className="p-4 bg-iron-grey border-b-2 border-dim-grey flex items-center justify-between flex-shrink-0">
              <h2 className="text-base font-bold text-sand-dune flex items-center gap-2">
                <List size={18} />
                Table of Contents
              </h2>
              <button
                onClick={() => setShowTOC(false)}
                className="text-sand-dune hover:text-cool-steel"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3">
              {tableOfContents.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left px-3 py-2 text-sm text-iron-grey hover:bg-cool-steel/20 rounded transition-colors mb-1"
                  style={{ paddingLeft: `${item.level * 12 + 12}px` }}
                >
                  <span className="line-clamp-2">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Document Content */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto p-8 bg-white"
          onMouseUp={handleTextSelection}
        >
          <div className="max-w-4xl mx-auto">
            <div 
              className="prose prose-lg max-w-none legislation-content"
              dangerouslySetInnerHTML={{ __html: document.content }}
            />

            {/* Highlights Summary */}
            {document.highlights.length > 0 && (
              <div className="mt-8 p-6 bg-cool-steel/10 rounded-lg border-2 border-cool-steel/30">
                <h3 className="text-base font-bold text-iron-grey mb-3 flex items-center gap-2">
                  <Highlighter size={18} />
                  Highlights ({document.highlights.length})
                </h3>
                <div className="space-y-2">
                  {document.highlights.map(h => (
                    <div key={h.id} className="text-sm text-dim-grey flex items-start gap-2 p-2 bg-white rounded">
                      <span className="text-cool-steel font-bold">•</span>
                      <span>{h.note || 'Highlighted section'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments Sidebar */}
        {showComments && (
          <div className="w-80 border-l-2 border-dim-grey bg-khaki-beige flex flex-col shadow-lg overflow-hidden">
            <div className="p-4 bg-iron-grey border-b-2 border-dim-grey flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-sand-dune flex items-center gap-2">
                  <MessageSquare size={18} />
                  Comments ({document.comments.length})
                </h2>
                <button
                  onClick={() => setShowComments(false)}
                  className="text-sand-dune hover:text-cool-steel"
                >
                  <X size={18} />
                </button>
              </div>
              
              <div className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2.5 bg-sand-dune text-iron-grey placeholder-dim-grey/60 text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cool-steel border border-dim-grey/30"
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="w-full bg-cool-steel text-iron-grey font-semibold py-2.5 rounded-lg hover:bg-sand-dune transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Comment
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {document.comments.length === 0 ? (
                <div className="text-center text-dim-grey/60 py-8 italic text-sm">
                  No comments yet
                </div>
              ) : (
                document.comments.map(comment => (
                  <div key={comment.id} className="p-3 bg-sand-dune rounded-lg border border-dim-grey/20 shadow-sm">
                    <div className="text-xs text-dim-grey/70 mb-1.5 font-medium">
                      {comment.timestamp.toLocaleDateString('en-GB', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="text-sm text-iron-grey leading-relaxed">{comment.text}</div>
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
