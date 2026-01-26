import { useState, useEffect, useMemo } from 'react';
import { Star, FolderInput, Trash2, MessageSquare, Highlighter, ExternalLink, ChevronLeft, ChevronRight, FileText, List, BookOpen } from 'lucide-react';
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

interface Provision {
  id: string;
  title: string;
  content: string;
  number?: string;
}

type TabType = 'toc' | 'content' | 'notes';

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
  const [activeTab, setActiveTab] = useState<TabType>('toc');
  const [currentProvisionIndex, setCurrentProvisionIndex] = useState(0);

  // Parse document into provisions
  const provisions = useMemo(() => {
    if (!document?.content) return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(document.content, 'text/html');
    const provisionsList: Provision[] = [];
    
    // Find all major provisions (sections, articles, regulations, etc.)
    const provisionElements = doc.querySelectorAll(
      '.LegP1Container, .LegP1, section, article, .provision'
    );
    
    provisionElements.forEach((element, index) => {
      // Get section number
      const numberEl = element.querySelector('.LegP1No, .LegSectionNo, .number');
      const number = numberEl?.textContent?.trim() || `${index + 1}`;
      
      // Get title/heading
      const titleEl = element.querySelector('.LegP1GroupTitle, .LegHeading, h1, h2, h3, h4');
      const title = titleEl?.textContent?.trim() || `Provision ${number}`;
      
      // Get full content
      const content = element.innerHTML;
      
      if (content && content.length > 50) {
        provisionsList.push({
          id: `provision-${index}`,
          title,
          number,
          content
        });
      }
    });
    
    // If no provisions found, split by major headings
    if (provisionsList.length === 0) {
      const headings = doc.querySelectorAll('h1, h2, .LegHeading');
      headings.forEach((heading, index) => {
        let content = '';
        let nextElement = heading.nextElementSibling;
        
        while (nextElement && !nextElement.matches('h1, h2, .LegHeading')) {
          content += nextElement.outerHTML;
          nextElement = nextElement.nextElementSibling;
        }
        
        if (content.length > 50) {
          provisionsList.push({
            id: `section-${index}`,
            title: heading.textContent?.trim() || `Section ${index + 1}`,
            number: `${index + 1}`,
            content: heading.outerHTML + content
          });
        }
      });
    }
    
    return provisionsList;
  }, [document?.content]);

  // Reset to first provision when document changes
  useEffect(() => {
    setCurrentProvisionIndex(0);
    setActiveTab('toc');
  }, [document?.id]);

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

  const currentProvision = provisions[currentProvisionIndex];
  const hasPrevious = currentProvisionIndex > 0;
  const hasNext = currentProvisionIndex < provisions.length - 1;

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: crypto.randomUUID(),
      position: currentProvisionIndex,
      text: newComment.trim(),
      timestamp: new Date(),
    };

    onAddComment(document.id, comment);
    setNewComment('');
  };

  const goToProvision = (index: number) => {
    setCurrentProvisionIndex(index);
    setActiveTab('content');
  };

  return (
    <div className="h-full flex flex-col bg-sand-dune">
      {/* Document Header */}
      <div className="p-4 bg-iron-grey border-b-2 border-dim-grey shadow-sm flex-shrink-0">
        <div className="flex items-start justify-between gap-4 mb-3">
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

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('toc')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'toc'
                ? 'bg-sand-dune text-iron-grey shadow'
                : 'bg-dim-grey/20 text-sand-dune hover:bg-sand-dune/20'
            }`}
          >
            <List size={16} />
            Contents ({provisions.length})
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'content'
                ? 'bg-sand-dune text-iron-grey shadow'
                : 'bg-dim-grey/20 text-sand-dune hover:bg-sand-dune/20'
            }`}
          >
            <FileText size={16} />
            Provisions
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'notes'
                ? 'bg-sand-dune text-iron-grey shadow'
                : 'bg-dim-grey/20 text-sand-dune hover:bg-sand-dune/20'
            }`}
          >
            <BookOpen size={16} />
            Notes
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* Table of Contents Tab */}
          {activeTab === 'toc' && (
            <div className="p-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-iron-grey mb-6">Table of Contents</h2>
              <div className="space-y-1">
                {provisions.map((provision, index) => (
                  <button
                    key={provision.id}
                    onClick={() => goToProvision(index)}
                    className="w-full text-left px-4 py-3 hover:bg-cool-steel/10 rounded-lg transition-colors group border border-transparent hover:border-cool-steel/30"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-cool-steel min-w-[3rem] text-right">
                        {provision.number}
                      </span>
                      <span className="text-iron-grey group-hover:text-dim-grey font-medium">
                        {provision.title}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Tab with Pagination */}
          {activeTab === 'content' && currentProvision && (
            <div className="flex flex-col h-full">
              {/* Provision Navigation */}
              <div className="bg-khaki-beige border-b-2 border-dim-grey px-8 py-4 flex items-center justify-between flex-shrink-0">
                <button
                  onClick={() => setCurrentProvisionIndex(currentProvisionIndex - 1)}
                  disabled={!hasPrevious}
                  className="flex items-center gap-2 px-4 py-2 bg-cool-steel text-iron-grey rounded-lg hover:bg-iron-grey hover:text-sand-dune transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-cool-steel disabled:hover:text-iron-grey font-medium"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                
                <div className="text-center">
                  <div className="text-sm text-dim-grey font-medium">
                    Provision {currentProvisionIndex + 1} of {provisions.length}
                  </div>
                  <div className="text-lg font-bold text-iron-grey">
                    {currentProvision.number}
                  </div>
                </div>

                <button
                  onClick={() => setCurrentProvisionIndex(currentProvisionIndex + 1)}
                  disabled={!hasNext}
                  className="flex items-center gap-2 px-4 py-2 bg-cool-steel text-iron-grey rounded-lg hover:bg-iron-grey hover:text-sand-dune transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-cool-steel disabled:hover:text-iron-grey font-medium"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Provision Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <div 
                    className="legislation-provision"
                    dangerouslySetInnerHTML={{ __html: currentProvision.content }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="p-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-iron-grey mb-6">Explanatory Notes</h2>
              <div className="bg-khaki-beige/30 border-2 border-cool-steel/30 rounded-lg p-6">
                <p className="text-dim-grey italic">
                  Explanatory notes are not currently available through the API.
                  You can view them directly on legislation.gov.uk.
                </p>
                <a
                  href={`${document.url}/notes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-cool-steel text-iron-grey rounded-lg hover:bg-iron-grey hover:text-sand-dune transition-all font-medium"
                >
                  <ExternalLink size={16} />
                  View Explanatory Notes
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Comments Sidebar */}
        {showComments && (
          <div className="w-80 border-l-2 border-dim-grey bg-khaki-beige flex flex-col shadow-lg overflow-hidden">
            <div className="p-4 bg-iron-grey border-b-2 border-dim-grey flex-shrink-0">
              <h2 className="text-base font-bold text-sand-dune mb-4 flex items-center gap-2">
                <MessageSquare size={18} />
                Comments ({document.comments.length})
              </h2>
              
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
