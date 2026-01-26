import { useState, useMemo, useRef, useEffect } from 'react';
import { Star, FolderInput, Trash2, MessageSquare, Highlighter, ExternalLink, 
         ChevronLeft, ChevronRight, List, ArrowUp, Search, AlertCircle, 
         CheckCircle, AlertTriangle } from 'lucide-react';
import type { Document, Folder, Comment } from '../types';

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
  number: string;
}

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
  const [currentProvisionIndex, setCurrentProvisionIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTOC, setShowTOC] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  // Parse document into GROUPED provisions (not line-by-line)
  const provisions = useMemo(() => {
    if (!document?.content) return [];
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(document.content, 'text/html');
    const provisionsList: Provision[] = [];
    
    // Strategy 1: Look for major provision containers (sections, parts, chapters)
    const majorContainers = doc.querySelectorAll('.LegP1Group, .LegPart, .LegChapter');
    
    if (majorContainers.length > 0) {
      majorContainers.forEach((container, index) => {
        const titleEl = container.querySelector('.LegP1GroupTitle, .LegPartTitle, .LegChapterTitle');
        let title = titleEl?.textContent?.trim() || `Provision ${index + 1}`;
        title = title.replace(/\s*U\.K\.\s*$/i, '').trim();
        
        const numberEl = container.querySelector('.LegP1No, .LegPartNo, .LegChapterNo');
        const number = numberEl?.textContent?.trim() || `${index + 1}`;
        
        const content = container.outerHTML;
        
        // Only add if has substantial content (not just a title)
        if (content.length > 500) {
          provisionsList.push({
            id: `provision-${index}`,
            title,
            number,
            content
          });
        }
      });
    }
    
    // Strategy 2: If no major containers, group by sections
    if (provisionsList.length === 0) {
      const sections = doc.querySelectorAll('section, .LegSection, [class*="Section"]');
      
      sections.forEach((section, index) => {
        const titleEl = section.querySelector('h1, h2, h3, .LegSectionTitle');
        let title = titleEl?.textContent?.trim() || `Section ${index + 1}`;
        title = title.replace(/\s*U\.K\.\s*$/i, '').trim();
        
        const content = section.outerHTML;
        
        if (content.length > 500) {
          provisionsList.push({
            id: `section-${index}`,
            title,
            number: `${index + 1}`,
            content
          });
        }
      });
    }
    
    // Strategy 3: Fallback - group by major headings with following content
    if (provisionsList.length === 0) {
      const headings = doc.querySelectorAll('h1, h2, .LegHeading');
      
      headings.forEach((heading, index) => {
        let title = heading.textContent?.trim() || `Section ${index + 1}`;
        title = title.replace(/\s*U\.K\.\s*$/i, '').trim();
        
        // Collect content until next heading
        let contentHtml = heading.outerHTML;
        let sibling = heading.nextElementSibling;
        
        while (sibling && !sibling.matches('h1, h2, .LegHeading')) {
          contentHtml += sibling.outerHTML;
          sibling = sibling.nextElementSibling;
        }
        
        if (contentHtml.length > 500) {
          provisionsList.push({
            id: `heading-${index}`,
            title,
            number: `${index + 1}`,
            content: contentHtml
          });
        }
      });
    }
    
    // Last resort: show entire document
    if (provisionsList.length === 0) {
      provisionsList.push({
        id: 'full-document',
        title: 'Full Document',
        number: '1',
        content: doc.body.innerHTML
      });
    }
    
    return provisionsList;
  }, [document?.content]);

  // Filter provisions based on search query
  const filteredProvisions = useMemo(() => {
    if (!searchQuery.trim()) return provisions;
    
    const query = searchQuery.toLowerCase();
    return provisions.filter(p => 
      p.title.toLowerCase().includes(query) ||
      p.number.toLowerCase().includes(query)
    );
  }, [provisions, searchQuery]);

  // Determine document status
  const getDocumentStatus = () => {
    if (!document) return null;
    
    const url = document.url.toLowerCase();
    
    if (url.includes('/enacted')) {
      return {
        type: 'enacted',
        label: 'As Enacted',
        color: 'bg-status-green/20 text-status-green',
        icon: CheckCircle,
        tooltip: 'This is the original version of the legislation as it was initially enacted or made.'
      };
    } else if (url.includes('/data.htm') || /\/\d{4}-\d{2}-\d{2}/.test(url)) {
      return {
        type: 'revised',
        label: 'Revised',
        color: 'bg-status-amber/20 text-status-amber',
        icon: AlertTriangle,
        tooltip: 'This is a revised version that may incorporate subsequent amendments and changes.'
      };
    } else {
      return {
        type: 'latest',
        label: 'Latest',
        color: 'bg-status-blue/20 text-status-blue',
        icon: AlertCircle,
        tooltip: 'This is the latest available version of the legislation.'
      };
    }
  };

  const status = getDocumentStatus();

  // Scroll to top of content area
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset when document changes
  useEffect(() => {
    setCurrentProvisionIndex(0);
    setSearchQuery('');
    setShowTOC(true);
  }, [document?.id]);

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

  const currentProvision = filteredProvisions[currentProvisionIndex];
  const hasPrevious = currentProvisionIndex > 0;
  const hasNext = currentProvisionIndex < filteredProvisions.length - 1;

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
    setShowTOC(false);
    scrollToTop();
  };

  const StatusIcon = status?.icon || AlertCircle;

  return (
    <div className="h-full flex flex-col bg-sand-dune relative">
      {/* Scroll to Top Button - Fixed Position */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-iron-grey text-white rounded-full shadow-lg hover:bg-bronze transition-all z-50 flex items-center justify-center"
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>

      {/* Header */}
      <div className="p-4 bg-iron-grey border-b-2 border-dim-grey shadow-sm flex-shrink-0">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-lg font-bold text-white leading-tight">
                {document.title}
              </h1>
              
              {/* Status Indicator */}
              {status && (
                <div className="group relative">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.color} text-xs font-semibold border-2 border-current`}>
                    <StatusIcon size={14} />
                    <span>{status.label}</span>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white border-2 border-iron-grey rounded-lg shadow-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <p className="text-sm text-iron-grey">{status.tooltip}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <a
                href={document.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cool-steel hover:text-white flex items-center gap-1"
              >
                <ExternalLink size={14} />
                <span>View on legislation.gov.uk</span>
              </a>
              
              {/* Outstanding Changes Link */}
              <a
                href={`${document.url.split('/data.htm')[0].replace(/\/\d{4}-\d{2}-\d{2}/, '')}/changes`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-bronze hover:text-white flex items-center gap-1 font-medium"
              >
                <AlertTriangle size={14} />
                <span>View Outstanding Changes</span>
              </a>
            </div>
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
              onClick={() => setShowComments(!showComments)}
              className="p-2 bg-dim-grey text-white hover:bg-white hover:text-iron-grey rounded-lg transition-all relative"
              title="Toggle comments"
            >
              <MessageSquare size={18} />
              {document.comments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-bronze text-white text-xs font-bold rounded-full flex items-center justify-center">
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

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowTOC(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              showTOC
                ? 'bg-white text-iron-grey shadow-lg'
                : 'bg-dim-grey text-white hover:bg-white hover:text-iron-grey'
            }`}
          >
            <List size={16} />
            Contents ({provisions.length})
          </button>
          <button
            onClick={() => setShowTOC(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              !showTOC
                ? 'bg-white text-iron-grey shadow-lg'
                : 'bg-dim-grey text-white hover:bg-white hover:text-iron-grey'
            }`}
          >
            Provisions
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div ref={contentRef} className="flex-1 overflow-y-auto bg-white">
          {/* Table of Contents */}
          {showTOC && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-iron-grey">Table of Contents</h2>
                
                {/* Live Search */}
                <div className="relative w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search provisions..."
                    className="w-full px-4 py-2 pl-10 bg-sand-dune text-iron-grey placeholder-dim-grey/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-iron-grey border border-dim-grey/30"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-dim-grey" />
                </div>
              </div>
              
              <div className="space-y-1">
                {filteredProvisions.map((provision, index) => (
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
                
                {filteredProvisions.length === 0 && (
                  <div className="text-center py-8 text-dim-grey">
                    No provisions match "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Provision Content */}
          {!showTOC && currentProvision && (
            <div className="flex flex-col h-full">
              {/* Navigation Bar */}
              <div className="bg-sand-dune border-b-2 border-dim-grey px-8 py-4 flex items-center justify-between flex-shrink-0">
                <button
                  onClick={() => {
                    setCurrentProvisionIndex(currentProvisionIndex - 1);
                    scrollToTop();
                  }}
                  disabled={!hasPrevious}
                  className="flex items-center gap-2 px-4 py-2 bg-iron-grey text-white rounded-lg hover:bg-bronze transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                
                <div className="text-center">
                  <div className="text-sm text-dim-grey font-medium">
                    Provision {currentProvisionIndex + 1} of {filteredProvisions.length}
                  </div>
                  <div className="text-lg font-bold text-iron-grey">
                    {currentProvision.number} - {currentProvision.title}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCurrentProvisionIndex(currentProvisionIndex + 1);
                    scrollToTop();
                  }}
                  disabled={!hasNext}
                  className="flex items-center gap-2 px-4 py-2 bg-iron-grey text-white rounded-lg hover:bg-bronze transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Provision Content */}
              <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <div 
                    className="legislation-provision prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: currentProvision.content }}
                  />
                </div>
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
                  className="w-full px-3 py-2.5 bg-white text-iron-grey placeholder-dim-grey/60 text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-bronze border border-dim-grey/30"
                  rows={3}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="w-full bg-white text-iron-grey font-semibold py-2.5 rounded-lg hover:bg-bronze hover:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
