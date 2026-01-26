import { useState, useEffect, useMemo, useRef } from 'react';
import { Star, FolderInput, Trash2, MessageSquare, ExternalLink, 
         ChevronDown, ChevronRight, ArrowUp, Search, AlertCircle, 
         CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import type { Document as LegislationDocument, Folder, Comment } from '../types';

interface DocumentViewerProps {
  document: LegislationDocument | null;
  folders: Folder[];
  onToggleFavorite: (documentId: string) => void;
  onMoveToFolder: (documentId: string, folderId: string | null) => void;
  onDelete: (documentId: string) => void;
  onAddComment: (documentId: string, comment: Comment) => void;
}

interface TOCItem {
  id: string;
  number: string;
  title: string;
  url: string;
  status?: string;
  children: TOCItem[];
  level: number;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [tableOfContents, setTableOfContents] = useState<TOCItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedProvision, setSelectedProvision] = useState<TOCItem | null>(null);
  const [provisionContent, setProvisionContent] = useState<string>('');
  const [loadingTOC, setLoadingTOC] = useState(false);
  const [loadingProvision, setLoadingProvision] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch Table of Contents
  useEffect(() => {
    if (!document) return;

    const fetchTOC = async () => {
      setLoadingTOC(true);
      try {
        const baseUrl = document.url.split('/data.htm')[0].replace(/\/\d{4}-\d{2}-\d{2}/, '');
        const tocUrl = `${baseUrl}/contents/data.xml`;
        
        console.log('Fetching TOC from:', tocUrl);
        
        const response = await fetch(`/api/legislation?url=${encodeURIComponent(tocUrl)}`);
        if (!response.ok) throw new Error('Failed to fetch TOC');
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const toc = parseTOCFromXML(xmlDoc);
        setTableOfContents(toc);
        
        // Auto-expand first level
        const firstLevelIds = toc.map(item => item.id);
        setExpandedItems(new Set(firstLevelIds));
        
      } catch (error) {
        console.error('Error fetching TOC:', error);
        fallbackTOCParsing();
      } finally {
        setLoadingTOC(false);
      }
    };

    fetchTOC();
  }, [document?.id]);

  // Parse TOC from CLML XML
  const parseTOCFromXML = (xmlDoc: XMLDocument): TOCItem[] => {
    const items: TOCItem[] = [];
    
    const contentsParts = xmlDoc.querySelectorAll('ContentsPart, ContentsSchedule');
    
    contentsParts.forEach((part: Element, index: number) => {
      const numberEl = part.querySelector('ContentsNumber');
      const titleEl = part.querySelector('ContentsTitle');
      const contentRef = part.getAttribute('ContentRef') || `part-${index}`;
      const documentURI = part.getAttribute('DocumentURI') || '';
      
      let number = numberEl?.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
      let title = titleEl?.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
      
      const partItem: TOCItem = {
        id: contentRef,
        number,
        title,
        url: documentURI,
        status: part.getAttribute('Status') || undefined,
        children: [],
        level: 0
      };
      
      const contentsItems = part.querySelectorAll(':scope > ContentsItem, :scope > ContentsPblock > ContentsItem');
      
      contentsItems.forEach((item: Element, itemIndex: number) => {
        const itemNumberEl = item.querySelector('ContentsNumber');
        const itemTitleEl = item.querySelector('ContentsTitle');
        const itemContentRef = item.getAttribute('ContentRef') || `item-${index}-${itemIndex}`;
        const itemDocumentURI = item.getAttribute('DocumentURI') || '';
        
        let itemNumber = itemNumberEl?.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
        let itemTitle = itemTitleEl?.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
        
        partItem.children.push({
          id: itemContentRef,
          number: itemNumber,
          title: itemTitle,
          url: itemDocumentURI,
          status: item.getAttribute('Status') || undefined,
          children: [],
          level: 1
        });
      });
      
      items.push(partItem);
    });
    
    if (items.length === 0) {
      const topLevelItems = xmlDoc.querySelectorAll('Contents > ContentsItem, TableOfContents > ContentsItem');
      
      topLevelItems.forEach((item: Element, index: number) => {
        const numberEl = item.querySelector('ContentsNumber');
        const titleEl = item.querySelector('ContentsTitle');
        const contentRef = item.getAttribute('ContentRef') || `section-${index}`;
        const documentURI = item.getAttribute('DocumentURI') || '';
        
        let number = numberEl?.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
        let title = titleEl?.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
        
        items.push({
          id: contentRef,
          number,
          title,
          url: documentURI,
          status: item.getAttribute('Status') || undefined,
          children: [],
          level: 0
        });
      });
    }
    
    return items;
  };

  const fallbackTOCParsing = () => {
    if (!document?.content) return;
    
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(document.content, 'text/html');
    const items: TOCItem[] = [];
    
    const headings = htmlDoc.querySelectorAll('h1, h2, .LegP1GroupTitle, .LegHeading');
    
    headings.forEach((heading: Element, index: number) => {
      let title = heading.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
      
      items.push({
        id: `heading-${index}`,
        number: `${index + 1}`,
        title,
        url: document.url,
        children: [],
        level: 0
      });
    });
    
    setTableOfContents(items);
  };

  const fetchProvision = async (item: TOCItem) => {
    setLoadingProvision(true);
    setSelectedProvision(item);
    
    try {
      if (!item.url) {
        throw new Error('No URL available');
      }
      
      const xmlUrl = item.url.includes('/data.xml') ? item.url : `${item.url}/data.xml`;
      console.log('Fetching provision:', xmlUrl);
      
      const response = await fetch(`/api/legislation?url=${encodeURIComponent(xmlUrl)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const body = xmlDoc.querySelector('Body, Schedules');
      if (body) {
        const tempDiv = window.document.createElement('div');
        tempDiv.innerHTML = new XMLSerializer().serializeToString(body);
        setProvisionContent(tempDiv.innerHTML);
      } else {
        setProvisionContent('<p>Content not available</p>');
      }
      
    } catch (error) {
      console.error('Error:', error);
      setProvisionContent(`
        <div class="p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
          <h3 class="font-bold text-yellow-900">Unable to Load</h3>
          <a href="${item.url}" target="_blank" class="text-blue-600 underline">View on legislation.gov.uk</a>
        </div>
      `);
    } finally {
      setLoadingProvision(false);
      scrollToTop();
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredTOC = useMemo(() => {
    if (!searchQuery.trim()) return tableOfContents;
    
    const query = searchQuery.toLowerCase();
    
    const filterItems = (items: TOCItem[]): TOCItem[] => {
      return items.map(item => {
        const matches = 
          item.title.toLowerCase().includes(query) ||
          item.number.toLowerCase().includes(query);
        
        const filteredChildren = filterItems(item.children);
        
        if (matches || filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }
        return null;
      }).filter((item): item is TOCItem => item !== null);
    };
    
    return filterItems(tableOfContents);
  }, [tableOfContents, searchQuery]);

  const getDocumentStatus = () => {
    if (!document) return null;
    
    const url = document.url.toLowerCase();
    
    if (url.includes('/enacted')) {
      return {
        label: 'As Enacted',
        color: 'bg-status-green/20 text-status-green',
        icon: CheckCircle,
        tooltip: 'Original version as enacted.'
      };
    } else if (url.includes('/data.htm') || /\/\d{4}-\d{2}-\d{2}/.test(url)) {
      return {
        label: 'Revised',
        color: 'bg-status-amber/20 text-status-amber',
        icon: AlertTriangle,
        tooltip: 'Revised with amendments.'
      };
    } else {
      return {
        label: 'Latest',
        color: 'bg-status-blue/20 text-status-blue',
        icon: AlertCircle,
        tooltip: 'Latest available.'
      };
    }
  };

  const status = getDocumentStatus();
  const StatusIcon = status?.icon || AlertCircle;

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !document) return;
    onAddComment(document.id, {
      id: crypto.randomUUID(),
      position: 0,
      text: newComment.trim(),
      timestamp: new Date(),
    });
    setNewComment('');
  };

  const renderTOCItem = (item: TOCItem) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children.length > 0;
    const isSelected = selectedProvision?.id === item.id;
    
    return (
      <div key={item.id}>
        <div 
          className={`flex items-start gap-2 px-3 py-2 hover:bg-sand-dune rounded-lg cursor-pointer group ${
            isSelected ? 'bg-bronze/20 border-l-4 border-bronze' : ''
          }`}
          style={{ paddingLeft: `${item.level * 1.5 + 0.75}rem` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
              className="mt-1 text-dim-grey hover:text-iron-grey"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          <div 
            onClick={() => fetchProvision(item)}
            className="flex-1 min-w-0"
          >
            <div className="flex items-baseline gap-2 flex-wrap">
              {item.number && (
                <span className="font-bold text-iron-grey text-sm whitespace-nowrap">
                  {item.number}
                </span>
              )}
              <span className="text-iron-grey text-sm group-hover:text-bronze">
                {item.title}
              </span>
              {item.status && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {item.status}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {item.children.map(child => renderTOCItem(child))}
          </div>
        )}
      </div>
    );
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

  return (
    <div className="h-full flex flex-col bg-sand-dune relative">
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-iron-grey text-white rounded-full shadow-lg hover:bg-bronze transition-all z-50 flex items-center justify-center"
      >
        <ArrowUp size={24} />
      </button>

      <div className="p-4 bg-iron-grey border-b-2 border-dim-grey shadow-sm flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-lg font-bold text-white leading-tight">
                {document.title}
              </h1>
              
              {status && (
                <div className="group relative">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${status.color} text-xs font-semibold border-2 border-current`}>
                    <StatusIcon size={14} />
                    <span>{status.label}</span>
                  </div>
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white border-2 border-iron-grey rounded-lg shadow-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <p className="text-sm text-iron-grey">{status.tooltip}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 flex-wrap text-sm">
              <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-cool-steel hover:text-white flex items-center gap-1">
                <ExternalLink size={14} />
                <span>View on legislation.gov.uk</span>
              </a>
              
              <a href={`${document.url.split('/data.htm')[0].replace(/\/\d{4}-\d{2}-\d{2}/, '')}/changes`} target="_blank" rel="noopener noreferrer" className="text-bronze hover:text-white flex items-center gap-1 font-medium">
                <AlertTriangle size={14} />
                <span>Outstanding Changes</span>
              </a>
            </div>
          </div>

          <div className="flex gap-1.5 flex-shrink-0">
            <button onClick={() => onToggleFavorite(document.id)} className={`p-2 rounded-lg transition-all ${document.isFavorite ? 'bg-white text-iron-grey' : 'bg-dim-grey text-white hover:bg-white hover:text-iron-grey'}`}>
              <Star size={18} fill={document.isFavorite ? 'currentColor' : 'none'} />
            </button>

            <div className="relative">
              <button onClick={() => setShowFolderMenu(!showFolderMenu)} className="p-2 bg-dim-grey text-white hover:bg-white hover:text-iron-grey rounded-lg transition-all">
                <FolderInput size={18} />
              </button>

              {showFolderMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-dim-grey rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
                  <button onClick={() => { onMoveToFolder(document.id, null); setShowFolderMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-iron-grey hover:bg-sand-dune font-medium">
                    Unfiled
                  </button>
                  {folders.map(folder => (
                    <button key={folder.id} onClick={() => { onMoveToFolder(document.id, folder.id); setShowFolderMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-iron-grey hover:bg-sand-dune font-medium border-t border-dim-grey/20">
                      {folder.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => setShowComments(!showComments)} className="p-2 bg-dim-grey text-white hover:bg-white hover:text-iron-grey rounded-lg transition-all relative">
              <MessageSquare size={18} />
              {document.comments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-bronze text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {document.comments.length}
                </span>
              )}
            </button>

            <button onClick={() => onDelete(document.id)} className="p-2 bg-dim-grey text-white hover:bg-red-600 rounded-lg transition-all">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-96 border-r-2 border-dim-grey bg-white flex flex-col overflow-hidden">
          <div className="p-4 border-b border-dim-grey">
            <h2 className="text-lg font-bold text-iron-grey mb-3">Table of Contents</h2>
            
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search provisions..." className="w-full px-4 py-2 pl-10 bg-sand-dune text-iron-grey placeholder-dim-grey/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-bronze border border-dim-grey/30 text-sm" />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-dim-grey" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {loadingTOC ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader className="w-8 h-8 text-bronze animate-spin mb-2" />
                <p className="text-sm text-dim-grey">Loading contents...</p>
              </div>
            ) : filteredTOC.length > 0 ? (
              filteredTOC.map(item => renderTOCItem(item))
            ) : (
              <div className="text-center py-8 text-dim-grey text-sm">
                {searchQuery ? `No match for "${searchQuery}"` : 'No contents available'}
              </div>
            )}
          </div>
        </div>

        <div ref={contentRef} className="flex-1 overflow-y-auto bg-white">
          {loadingProvision ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader className="w-12 h-12 text-bronze animate-spin mb-4" />
              <p className="text-lg text-iron-grey">Loading provision...</p>
            </div>
          ) : selectedProvision ? (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  {selectedProvision.number && (
                    <span className="text-2xl font-bold text-bronze">
                      {selectedProvision.number}
                    </span>
                  )}
                  <h2 className="text-2xl font-bold text-iron-grey">
                    {selectedProvision.title}
                  </h2>
                </div>
                {selectedProvision.status && (
                  <span className="inline-block px-3 py-1 text-sm rounded bg-amber-100 text-amber-800 font-medium">
                    {selectedProvision.status}
                  </span>
                )}
              </div>
              
              <div className="legislation-provision prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: provisionContent }} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center px-8">
              <div>
                <p className="text-xl font-semibold text-iron-grey mb-2">
                  Select a provision
                </p>
                <p className="text-sm text-dim-grey">
                  Click any item in the left panel
                </p>
              </div>
            </div>
          )}
        </div>

        {showComments && (
          <div className="w-80 border-l-2 border-dim-grey bg-sand-dune flex flex-col shadow-lg overflow-hidden">
            <div className="p-4 bg-iron-grey border-b-2 border-dim-grey flex-shrink-0">
              <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <MessageSquare size={18} />
                Comments ({document.comments.length})
              </h2>
              
              <div className="space-y-2">
                <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="w-full px-3 py-2.5 bg-white text-iron-grey placeholder-dim-grey/60 text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-bronze border border-dim-grey/30" rows={3} />
                <button onClick={handleAddComment} disabled={!newComment.trim()} className="w-full bg-white text-iron-grey font-semibold py-2.5 rounded-lg hover:bg-bronze hover:text-white transition-all shadow-sm disabled:opacity-50">
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
                      {comment.timestamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
