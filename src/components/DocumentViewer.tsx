import { useState, useEffect, useMemo } from 'react';
import { Star, FolderInput, Trash2, MessageSquare, Highlighter, ExternalLink, ChevronLeft, ChevronRight, FileText, List, BookOpen, ArrowUp, Loader } from 'lucide-react';
import type { Document, Folder, Highlight, Comment } from '../types';

interface DocumentViewerProps {
  document: Document | null;
  folders: Folder[];
  onToggleFavorite: (documentId: string) => void;
  onMoveToFolder: (documentId: string, folderId: string | null) => void;
  onDelete: (documentId: string) => void;
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
  onAddComment,
}: DocumentViewerProps) {
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [highlightMode, setHighlightMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('toc');
  const [currentProvisionIndex, setCurrentProvisionIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Parse document into provisions
  const provisions = useMemo(() => {
    if (!document?.content) return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(document.content, 'text/html');
    const provisionsList: Provision[] = [];
    
    // Find all major provisions
    const provisionElements = doc.querySelectorAll(
      '.LegP1Container, .LegP1Group, .LegClearFix, section, article'
    );
    
    if (provisionElements.length > 0) {
      provisionElements.forEach((element, index) => {
        // Get section number
        const numberEl = element.querySelector('.LegP1No, .LegSectionNo, .number');
        const number = numberEl?.textContent?.trim() || `${index + 1}`;
        
        // Get title/heading - remove "U.K." suffix
        const titleEl = element.querySelector('.LegP1GroupTitle, .LegHeading, h1, h2, h3, h4');
        let title = titleEl?.textContent?.trim() || `Provision ${number}`;
        title = title.replace(/\s*U\.K\.\s*$/i, '').trim();
        
        // Get full content
        const content = element.outerHTML;
        
        if (content && content.length > 100) {
          provisionsList.push({
            id: `provision-${index}`,
            title,
            number,
            content
          });
        }
      });
    }
    
    // Fallback: split by headings
    if (provisionsList.length === 0) {
      const headings = doc.querySelectorAll('h1, h2, h3, .LegHeading');
      
      if (headings.length > 0) {
        headings.forEach((heading, index) => {
          let headingText = heading.textContent?.trim() || `Section ${index + 1}`;
          headingText = headingText.replace(/\s*U\.K\.\s*$/i, '').trim();
          
          let contentHtml = heading.outerHTML;
          let nextElement = heading.nextElementSibling;
          
          while (nextElement && !nextElement.matches('h1, h2, h3, .LegHeading')) {
            contentHtml += nextElement.outerHTML;
            nextElement = nextElement.nextElementSibling;
          }
          
          if (contentHtml.length > 150) {
            provisionsList.push({
              id: `section-${index}`,
              title: headingText,
              number: `${index + 1}`,
              content: contentHtml
            });
          }
        });
      } else {
        // Last resort: entire document
        provisionsList.push({
          id: 'full-document',
          title: 'Full Document',
          number: '1',
          content: doc.body.innerHTML
        });
      }
    }
    
    return provisionsList;
  }, [document?.content]);

  // Reset to first provision when document changes
  useEffect(() => {
    setCurrentProvisionIndex(0);
    setActiveTab('toc');
    setIsProcessing(false);
  }, [document?.id]);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center bg-sand-dune">
        <div className="text-center px-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cool-steel/20 flex items-center justify-center">
            <span className="text-4xl text-iron-grey">§</span>
          </div>
          <p className="text-xl font-semibold text-iron-grey mb-2">No Document Selected</p>
          <p className="text-sm text-dim-grey">Search for legislation or browse your saved documents</p>
        </div>
      </div>
    );
  }

  // Show loading state while processing
  if (isProcessing) {
    return (
      <div className="h-full flex items-center justify-center bg-sand-dune">
        <div className="text-center px-8">
          <Loader className="w-12 h-12 mx-auto mb-4 text-iron-grey animate-spin" />
          <p className="text-lg font-semibold text-iron-grey">Loading document...</p>
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
    scrollToTop();
  };

  return (
    <div className="h-full flex flex-col bg-sand-dune relative">
      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-iron-grey text-white rounded-full shadow-lg hover:bg-dim-grey transition-all z-50 flex items-center justify-center"
        title="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>

      {/* Document Header */}
      <div className="p-4 bg-iron-grey border-b-2 border-dim-grey shadow-sm flex-shrink-0">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-white mb-2 leading-tight">
              {document.title}
            </h1>
            <a
              href={document.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cool-steel hover:text-white flex items-center gap-1 w-fit"
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
                  ? 'bg-white text-iron-grey' 
                  : 'bg-dim-grey text-white hover:bg-white hover:text-iron-grey'
              }`}
              title="Toggle favorite"
            >
              <Star size={18} fill={document.isFavorite ? 'currentColor' : 'none'} />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowFolderMenu(!showFolderMenu)}
                className="p-2 bg-dim-grey text-white hover:bg-white hover:text-iron-grey rounded-lg transition-all"
                title="Move to folder"
              >
                <FolderInput size={18} />
              </button>

              {showFolderMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-dim-grey rounded-lg shadow-xl z-10 overflow-hidden max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      onMoveToFolder(document.id, null);
                      setShowFolderMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-iron-grey hover:bg-sand-dune font-medium"
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
                      className="w-full text-left px-4 py-2.5 text-sm text-iron-grey hover:bg-sand-dune font-medium border-t border-dim-grey/20"
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
                  ? 'bg-white text-iron-grey' 
                  : 'bg-dim-grey text-white hover:bg-white hover:text-iron-grey'
              }`}
              title="Highlight mode"
            >
              <Highlighter size={18} />
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 bg-dim-grey text-white hover:bg-white hover:text-iron-grey rounded-lg transition-all relative"
              title="Toggle comments"
            >
              <MessageSquare size={18} />
              {document.comments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cool-steel text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {document.comments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => onDelete(document.id)}
              className="p-2 bg-dim-grey text-white hover:bg-red-600 rounded-lg transition-all"
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'toc'
                ? 'bg-white text-iron-grey shadow-lg'
                : 'bg-dim-grey text-white hover:bg-white hover:text-iron-grey'
            }`}
          >
            <List size={16} />
            Contents ({provisions.length})
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'content'
                ? 'bg-white text-iron-grey shadow-lg'
                : 'bg-dim-grey text-white hover:bg-white hover:text-iron-grey'
            }`}
          >
            <FileText size={16} />
            Provisions
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'notes'
                ? 'bg-white text-iron-grey shadow-lg'
                : 'bg-dim-grey text-white hover:bg-white hover:text-iron-grey'
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
                    className="w-full text-left px-4 py-3 hover:bg-sand-dune rounded-lg transition-colors group border border-transparent hover:border-iron-grey"
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-bold text-iron-grey min-w-[3rem] text-right">
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
              <div className="bg-sand-dune border-b-2 border-dim-grey px-8 py-4 flex items-center justify-between flex-shrink-0">
                <button
                  onClick={() => {
                    setCurrentProvisionIndex(currentProvisionIndex - 1);
                    scrollToTop();
                  }}
                  disabled={!hasPrevious}
                  className="flex items-center gap-2 px-4 py-2 bg-iron-grey text-white rounded-lg hover:bg-dim-grey transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
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
                  onClick={() => {
                    setCurrentProvisionIndex(currentProvisionIndex + 1);
                    scrollToTop();
                  }}
                  disabled={!hasNext}
                  className="flex items-center gap-2 px-4 py-2 bg-iron-grey text-white rounded-lg hover:bg-dim-grey transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
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
              <div className="bg-sand-dune border-2 border-iron-grey/30 rounded-lg p-6">
                <p className="text-iron-grey mb-4">
                  Explanatory notes are not currently available through the API.
                  You can view them directly on legislation.gov.uk.
                </p>
                <a
                  href={`${document.url.split('/data.htm')[0].replace(/\/\d{4}-\d{2}-\d{2}/, '')}/notes/contents`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-iron-grey text-white rounded-lg hover:bg-dim-grey transition-all font-semibold"
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
          <div className="w-80 border-l-2 border-dim-grey bg-sand-dune flex flex-col shadow-lg overflow-hidden">
            <div className="p-4 bg-iron-grey border-b-2 border-dim-grey flex-shrink-0">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare size={18} />
                Comments ({document.comments.length})
              </h2>
              
              <div className="space-y-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2.5 bg-white text-iron-grey placeholder-dim-grey/60 text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cool-steel border border-dim-grey/30"
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="w-full bg-white text-iron-grey font-semibold py-2.5 rounded-lg hover:bg-cool-steel hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div key={comment.id} className="p-3 bg-white rounded-lg border border-dim-grey/20 shadow-sm">
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
