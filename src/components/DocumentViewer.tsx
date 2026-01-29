import { useState, useEffect, useMemo, useRef } from 'react';
import { Star, FolderInput, Trash2, ExternalLink, 
         ChevronDown, ChevronRight, ArrowUp, Search, AlertCircle, 
         CheckCircle, AlertTriangle, Loader, ChevronLeft as PrevIcon, 
         ChevronRight as NextIcon, Highlighter, PanelLeftClose, PanelLeftOpen,
         StickyNote, X, Info } from 'lucide-react';
import type { Document as LegislationDocument, Folder, Comment, Highlight } from '../types';

interface DocumentViewerProps {
  document: LegislationDocument | null;
  folders: Folder[];
  onToggleFavorite: (documentId: string) => void;
  onMoveToFolder: (documentId: string, folderId: string | null) => void;
  onDelete: (documentId: string) => void;
  onAddComment: (documentId: string, comment: Comment) => void;
  onAddHighlight?: (documentId: string, highlight: Highlight) => void;
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

interface StatusInfo {
  label: string;
  color: string;
  icon: any;
  tooltip: string;
}

const HIGHLIGHT_COLORS = [
  { name: 'Yellow', color: '#fef08a', border: '#fde047' },
  { name: 'Green', color: '#bbf7d0', border: '#86efac' },
  { name: 'Blue', color: '#bfdbfe', border: '#93c5fd' },
  { name: 'Pink', color: '#fbcfe8', border: '#f9a8d4' },
];

type RightPanelTab = 'notes' | 'relationships' | null;

export function DocumentViewer({
  document,
  folders,
  onToggleFavorite,
  onMoveToFolder,
  onDelete,
  onAddComment,
  onAddHighlight,
}: DocumentViewerProps) {
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>(null);
  const [newComment, setNewComment] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [notesSearchQuery, setNotesSearchQuery] = useState('');
  const [tableOfContents, setTableOfContents] = useState<TOCItem[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedProvision, setSelectedProvision] = useState<TOCItem | null>(null);
  const [currentProvisionIndex, setCurrentProvisionIndex] = useState(0);
  const [provisionContent, setProvisionContent] = useState<string>('');
  const [loadingTOC, setLoadingTOC] = useState(false);
  const [loadingProvision, setLoadingProvision] = useState(false);
  const [tocWidth, setTocWidth] = useState(384);
  const [isResizing, setIsResizing] = useState(false);
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const [highlightMode, setHighlightMode] = useState(false);
  const [selectedHighlightColor, setSelectedHighlightColor] = useState(0);
  const [documentStatus, setDocumentStatus] = useState<StatusInfo | null>(null);
  const [displayTheme, setDisplayTheme] = useState<'light' | 'dark' | 'sepia'>('light');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>('medium');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setTocWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.document.addEventListener('mousemove', handleMouseMove);
      window.document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.document.removeEventListener('mousemove', handleMouseMove);
      window.document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const flatProvisions = useMemo(() => {
    const flatten = (items: TOCItem[]): TOCItem[] => {
      return items.reduce((acc: TOCItem[], item) => {
        acc.push(item);
        if (item.children.length > 0) {
          acc.push(...flatten(item.children));
        }
        return acc;
      }, []);
    };
    return flatten(tableOfContents);
  }, [tableOfContents]);

  useEffect(() => {
    if (!document) return;

    const fetchTOC = async () => {
      setLoadingTOC(true);
      try {
        const urlParts = document.url.match(/^(https:\/\/www\.legislation\.gov\.uk\/[^\/]+\/[^\/]+\/[^\/]+)/);
        const baseUrl = urlParts ? urlParts[1] : document.url.split('/data.htm')[0].replace(/\/\d{4}-\d{2}-\d{2}/, '');
        
        const tocUrl = `${baseUrl}/contents/data.xml`;
        
        const response = await fetch(`/api/legislation?url=${encodeURIComponent(tocUrl)}`);
        if (!response.ok) throw new Error('Failed to fetch TOC');
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const metadata = xmlDoc.querySelector('Metadata');
        const status = extractStatusFromMetadata(metadata);
        setDocumentStatus(status);
        
        const toc = parseTOCFromXML(xmlDoc);
        setTableOfContents(toc);
        setExpandedItems(new Set());
        
      } catch (error) {
        console.error('Error fetching TOC:', error);
        fallbackTOCParsing();
      } finally {
        setLoadingTOC(false);
      }
    };

    fetchTOC();
  }, [document?.id]);

  useEffect(() => {
    if (!document) return;
    
    const fetchRelationships = async () => {
      setLoadingRelationships(true);
      try {
        const urlParts = document.url.match(/^(https:\/\/www\.legislation\.gov\.uk\/[^\/]+\/[^\/]+\/[^\/]+)/);
        const baseUrl = urlParts ? urlParts[1] : document.url.split('/data.htm')[0].replace(/\/\d{4}-\d{2}-\d{2}/, '');
        
        const effectsUrl = `${baseUrl}/effects/data.xml`;
        const effectsResponse = await fetch(`/api/legislation?url=${encodeURIComponent(effectsUrl)}`);
        
        console.log('Effects URL:', effectsUrl);
        console.log('Response status:', effectsResponse.status);
        
        if (effectsResponse.ok) {
          const xmlText = await effectsResponse.text();
          console.log('Effects XML length:', xmlText.length);
          console.log('First 500 chars:', xmlText.substring(0, 500));
          
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
          
          const relationships = parseRelationships(xmlDoc, baseUrl);
          console.log('Parsed relationships:', relationships);
          setRelationshipsData(relationships);
        } else {
          console.log('Failed to fetch effects, trying /changes endpoint');
          const changesUrl = `${baseUrl}/changes/data.xml`;
          const changesResponse = await fetch(`/api/legislation?url=${encodeURIComponent(changesUrl)}`);
          
          if (changesResponse.ok) {
            const xmlText = await changesResponse.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
            const relationships = parseRelationships(xmlDoc, baseUrl);
            setRelationshipsData(relationships);
          } else {
            console.log('No effects or changes data available for this legislation');
            setRelationshipsData({ 
              nodes: [{ 
                id: baseUrl, 
                name: document?.title || 'Current Legislation', 
                type: 'current', 
                url: baseUrl 
              }], 
              links: [] 
            });
          }
        }
      } catch (error) {
        console.error('Error fetching relationships:', error);
        setRelationshipsData(null);
      } finally {
        setLoadingRelationships(false);
      }
    };
    
    fetchRelationships();
  }, [document?.id]);

  const parseRelationships = (xmlDoc: XMLDocument, currentUrl: string) => {
    const nodes: any[] = [];
    const links: any[] = [];
    
    const currentTitle = document?.title || 'Current Legislation';
    nodes.push({
      id: currentUrl,
      name: currentTitle,
      type: 'current',
      url: currentUrl
    });
    
    const effects = xmlDoc.querySelectorAll('Effect');
    effects.forEach((effect: Element) => {
      const affectedURI = effect.querySelector('AffectedProvisions')?.getAttribute('URI');
      const affectedTitle = effect.querySelector('AffectedTitle')?.textContent || 'Unknown Legislation';
      const affectingURI = effect.querySelector('AffectingProvisions')?.getAttribute('URI');
      const affectingTitle = effect.querySelector('AffectingTitle')?.textContent || 'Unknown Legislation';
      const effectType = effect.getAttribute('Type') || 'affects';
      
      if (affectedURI && affectedURI !== currentUrl) {
        if (!nodes.find(n => n.id === affectedURI)) {
          nodes.push({
            id: affectedURI,
            name: affectedTitle,
            type: 'affected',
            url: affectedURI
          });
        }
        links.push({
          source: currentUrl,
          target: affectedURI,
          type: effectType
        });
      }
      
      if (affectingURI && affectingURI !== currentUrl) {
        if (!nodes.find(n => n.id === affectingURI)) {
          nodes.push({
            id: affectingURI,
            name: affectingTitle,
            type: 'affecting',
            url: affectingURI
          });
        }
        links.push({
          source: affectingURI,
          target: currentUrl,
          type: effectType
        });
      }
    });
    
    return { nodes, links };
  };

  const extractStatusFromMetadata = (metadata: Element | null): StatusInfo => {
    if (!metadata) {
      return {
        label: 'Unknown',
        color: 'bg-gray-200 text-gray-700',
        icon: AlertCircle,
        tooltip: 'Status information not available.'
      };
    }

    const enacted = metadata.querySelector('EnactmentDate, Made');
    const modified = metadata.querySelector('Modified');
    const isEnacted = document?.url.toLowerCase().includes('/enacted');
    const hasModifications = metadata.querySelector('UnappliedEffects Effect');
    
    if (isEnacted) {
      return {
        label: 'As Enacted',
        color: 'bg-status-green/20 text-status-green',
        icon: CheckCircle,
        tooltip: `This is the original version as ${enacted ? 'enacted on ' + enacted.textContent : 'initially made'}.`
      };
    } else if (hasModifications) {
      return {
        label: 'Revised (Changes Pending)',
        color: 'bg-status-amber/20 text-status-amber',
        icon: AlertTriangle,
        tooltip: 'This version includes applied changes but has outstanding modifications not yet incorporated.'
      };
    } else if (modified) {
      return {
        label: 'Revised',
        color: 'bg-status-blue/20 text-status-blue',
        icon: CheckCircle,
        tooltip: 'This is the revised version incorporating all known amendments.'
      };
    } else {
      return {
        label: 'Latest Available',
        color: 'bg-status-blue/20 text-status-blue',
        icon: AlertCircle,
        tooltip: 'This is the latest available version of this legislation.'
      };
    }
  };

  const parseTOCFromXML = (xmlDoc: XMLDocument): TOCItem[] => {
    const items: TOCItem[] = [];
    
    // First, get top-level sections (before any Parts/Schedules)
    const topLevelSections = xmlDoc.querySelectorAll('Contents > ContentsItem');
    
    topLevelSections.forEach((item: Element, index: number) => {
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
    
    // Then get Parts with their nested sections
    const contentsParts = xmlDoc.querySelectorAll('ContentsPart');
    
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
    
    // Finally get Schedules
    const contentsSchedules = xmlDoc.querySelectorAll('ContentsSchedule');
    
    contentsSchedules.forEach((schedule: Element, index: number) => {
      const numberEl = schedule.querySelector('ContentsNumber');
      const titleEl = schedule.querySelector('ContentsTitle');
      const contentRef = schedule.getAttribute('ContentRef') || `schedule-${index}`;
      const documentURI = schedule.getAttribute('DocumentURI') || '';
      
      let number = numberEl?.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
      let title = titleEl?.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
      
      const scheduleItem: TOCItem = {
        id: contentRef,
        number,
        title,
        url: documentURI,
        status: schedule.getAttribute('Status') || undefined,
        children: [],
        level: 0
      };
      
      const contentsItems = schedule.querySelectorAll(':scope > ContentsItem, :scope > ContentsPblock > ContentsItem');
      
      contentsItems.forEach((item: Element, itemIndex: number) => {
        const itemNumberEl = item.querySelector('ContentsNumber');
        const itemTitleEl = item.querySelector('ContentsTitle');
        const itemContentRef = item.getAttribute('ContentRef') || `item-schedule-${index}-${itemIndex}`;
        const itemDocumentURI = item.getAttribute('DocumentURI') || '';
        
        let itemNumber = itemNumberEl?.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
        let itemTitle = itemTitleEl?.textContent?.replace(/\[F\d+\]/g, '').trim() || '';
        
        scheduleItem.children.push({
          id: itemContentRef,
          number: itemNumber,
          title: itemTitle,
          url: itemDocumentURI,
          status: item.getAttribute('Status') || undefined,
          children: [],
          level: 1
        });
      });
      
      items.push(scheduleItem);
    });
    
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

  const handleInternalLink = (href: string) => {
    const sectionMatch = href.match(/section-(\d+)|article-(\d+)|regulation-(\d+)/i);
    if (sectionMatch) {
      const sectionNum = sectionMatch[1] || sectionMatch[2] || sectionMatch[3];
      const provision = flatProvisions.find(p => 
        p.number === sectionNum || p.id.includes(sectionNum)
      );
      if (provision) {
        const idx = flatProvisions.indexOf(provision);
        fetchProvision(provision, idx);
      }
    }
  };

  const fetchProvision = async (item: TOCItem, index?: number) => {
    setLoadingProvision(true);
    setSelectedProvision(item);
    
    if (index !== undefined) {
      setCurrentProvisionIndex(index);
    } else {
      const idx = flatProvisions.findIndex(p => p.id === item.id);
      setCurrentProvisionIndex(idx >= 0 ? idx : 0);
    }
    
    try {
      if (!item.url) throw new Error('No URL available');
      
      const xmlUrl = item.url.includes('/data.xml') ? item.url : `${item.url}/data.xml`;
      
      const response = await fetch(`/api/legislation?url=${encodeURIComponent(xmlUrl)}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      
      const body = xmlDoc.querySelector('Body, Schedules');
      if (body) {
        const processedContent = processProvisionXML(body, xmlDoc);
        setProvisionContent(processedContent);
      } else {
        setProvisionContent('<p class="text-neutral-600 italic">Content not available</p>');
      }
      
    } catch (error) {
      console.error('Error:', error);
      setProvisionContent(`
        <div class="p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
          <h3 class="font-bold text-yellow-900 mb-2">Unable to Load</h3>
          <a href="${item.url}" target="_blank" class="text-blue-600 underline hover:text-blue-800">View on legislation.gov.uk</a>
        </div>
      `);
    } finally {
      setLoadingProvision(false);
      scrollToTop();
    }
  };

  const processProvisionXML = (body: Element, xmlDoc: XMLDocument): string => {
    const clone = body.cloneNode(true) as Element;
    
    const commentaryRefs = Array.from(clone.querySelectorAll('CommentaryRef'));
    const accordionsToInsert: { provision: Element, html: string }[] = [];
    
    commentaryRefs.forEach((ref: Element) => {
      const commentaryId = ref.getAttribute('Ref');
      
      if (commentaryId) {
        const commentary = xmlDoc.querySelector(`Commentary[id="${commentaryId}"]`);
        if (commentary) {
          const type = commentary.getAttribute('Type');
          const text = commentary.textContent || '';
          
          let title = 'Note';
          if (type === 'F' || type === 'M') {
            title = 'Textual Amendment';
          } else if (type === 'I' || type === 'C') {
            title = 'Commencement Information';
          }
          
          const parentProvision = ref.closest('P1, P2, P3, P4');
          if (parentProvision) {
            const accordionHtml = `
              <div class="amendment-accordion">
                <button class="accordion-button" onclick="this.classList.toggle('active'); const content = this.nextElementSibling; content.style.display = content.style.display === 'none' ? 'block' : 'none';">
                  <span style="display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    ${title}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
                <div class="accordion-content" style="display: none;">${text}</div>
              </div>
            `;
            
            accordionsToInsert.push({ provision: parentProvision, html: accordionHtml });
          }
        }
      }
      
      ref.remove();
    });
    
    accordionsToInsert.forEach(({ provision, html }) => {
      const div = window.document.createElement('div');
      div.innerHTML = html;
      provision.parentNode?.insertBefore(div.firstElementChild!, provision.nextSibling);
    });
    
    const allElements = clone.querySelectorAll('*');
    allElements.forEach(el => {
      const attributes = Array.from(el.attributes);
      attributes.forEach(attr => {
        if (!['class', 'style', 'href', 'onclick', 'data-ref'].includes(attr.name)) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    const references = clone.querySelectorAll('Reference, InternalLink, Citation');
    references.forEach((ref: Element) => {
      const href = ref.getAttribute('URI') || ref.getAttribute('Ref');
      const text = ref.textContent || '';
      
      if (href) {
        const anchor = window.document.createElement('a');
        anchor.textContent = text;
        anchor.href = '#';
        anchor.className = 'internal-link';
        anchor.setAttribute('data-ref', href);
        anchor.onclick = (e) => {
          e.preventDefault();
          handleInternalLink(href);
        };
        ref.parentNode?.replaceChild(anchor, ref);
      } else {
        const textNode = window.document.createTextNode(text);
        ref.parentNode?.replaceChild(textNode, ref);
      }
    });
    
    const tagsToFlatten = [
      'Substitution', 'Addition', 'Repeal', 'Abbreviation', 
      'Emphasis', 'Strong', 'SmallCaps', 'Text', 'Para'
    ];
    
    tagsToFlatten.forEach(tagName => {
      const elements = clone.querySelectorAll(tagName);
      elements.forEach(el => {
        const text = el.textContent || '';
        const textNode = window.document.createTextNode(text);
        el.parentNode?.replaceChild(textNode, el);
      });
    });
    
    const serializer = new XMLSerializer();
    return serializer.serializeToString(clone);
  };

  const navigateProvision = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentProvisionIndex - 1 : currentProvisionIndex + 1;
    if (newIndex >= 0 && newIndex < flatProvisions.length) {
      fetchProvision(flatProvisions[newIndex], newIndex);
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

  const filteredNotes = useMemo(() => {
    if (!notesSearchQuery.trim()) return document?.comments || [];
    const query = notesSearchQuery.toLowerCase();
    return (document?.comments || []).filter(comment => 
      comment.text.toLowerCase().includes(query)
    );
  }, [document?.comments, notesSearchQuery]);

  const handleTextSelection = () => {
    if (!highlightMode || !document) return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const span = window.document.createElement('span');
    const color = HIGHLIGHT_COLORS[selectedHighlightColor];
    span.style.backgroundColor = color.color;
    span.style.borderBottom = `2px solid ${color.border}`;
    span.className = 'user-highlight';
    
    const highlightId = crypto.randomUUID();
    span.setAttribute('data-highlight-id', highlightId);
    span.setAttribute('data-highlight-color', selectedHighlightColor.toString());
    
    span.onclick = (e) => {
      e.stopPropagation();
      if (confirm('Remove this highlight?')) {
        const parent = span.parentNode;
        if (parent) {
          const text = window.document.createTextNode(span.textContent || '');
          parent.replaceChild(text, span);
        }
      }
    };

    try {
      range.surroundContents(span);
      selection.removeAllRanges();
      
      // Save highlight persistently
      if (onAddHighlight) {
        const highlight: Highlight = {
          id: highlightId,
          range: {
            start: 0, // Position in provision
            end: range.toString().length
          },
          color: color.color,
          note: '',
          createdAt: new Date(),
        };
        onAddHighlight(document.id, highlight);
      }
    } catch (e) {
      console.error('Could not highlight selection:', e);
    }
  };

  const StatusIcon = documentStatus?.icon || AlertCircle;

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !document) return;
    onAddComment(document.id, {
      id: crypto.randomUUID(),
      position: currentProvisionIndex,
      text: newComment.trim(),
      timestamp: new Date(),
    });
    setNewComment('');
  };

  const renderTOCItem = (item: TOCItem, globalIndex: number) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children.length > 0;
    const isSelected = selectedProvision?.id === item.id;
    
    return (
      <div key={item.id}>
        <div 
          className={`flex items-start gap-2 px-3 py-2 hover:bg-neutral-50 rounded-lg cursor-pointer group ${
            isSelected ? 'bg-primary-600/20 border-l-4 border-bronze' : ''
          }`}
          style={{ paddingLeft: `${item.level * 1.5 + 0.75}rem` }}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(item.id);
              }}
              className="mt-1 text-neutral-600 hover:text-neutral-800 flex-shrink-0"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          
          <div 
            onClick={() => fetchProvision(item, globalIndex)}
            className="flex-1 min-w-0"
          >
            <div className="flex items-baseline gap-2">
              {item.number && (
                <span className="font-bold text-neutral-800 text-sm flex-shrink-0">
                  {item.number}
                </span>
              )}
              <span className="text-neutral-800 text-sm group-hover:text-primary-600">
                {item.title}
              </span>
              {item.status && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex-shrink-0">
                  {item.status}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {item.children.map((child, idx) => {
              const childGlobalIndex = globalIndex + 1 + idx;
              return renderTOCItem(child, childGlobalIndex);
            })}
          </div>
        )}
      </div>
    );
  };

  if (!document) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-50">
        <div className="text-center px-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-neutral-700/20 flex items-center justify-center">
            <span className="text-4xl text-neutral-800">§</span>
          </div>
          <p className="text-xl font-semibold text-neutral-800 mb-2">No Document Selected</p>
          <p className="text-sm text-neutral-600">Search for legislation or browse your saved documents</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50 relative">
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-neutral-800 text-white rounded-full shadow-lg hover:bg-neutral-600 transition-all z-50 flex items-center justify-center"
        title="Scroll to top"
      >
        <ArrowUp size={24} />
      </button>

      {showCopyright && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl mx-4 p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center gap-2">
                <Info size={24} className="text-primary-600" />
                Copyright & Licensing
              </h2>
              <button onClick={() => setShowCopyright(false)} className="text-neutral-600 hover:text-neutral-800">
                <X size={24} />
              </button>
            </div>
            <div className="text-sm text-neutral-800 space-y-4 leading-relaxed">
              <p>
                All content is available under the <strong>Open Government Licence v3.0</strong> except where otherwise stated.
              </p>
              <p>
                This site additionally contains content derived from <strong>EUR-Lex</strong>, reused under the terms of the Commission Decision 2011/833/EU on the reuse of documents from the EU institutions.
              </p>
              <p>
                For more information see the <a href="https://eur-lex.europa.eu/content/legal-notice/legal-notice.html" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline hover:text-neutral-800">EUR-Lex public statement on re-use</a>.
              </p>
              <div className="pt-4 border-t border-neutral-300/30 font-semibold">
                © Crown and database right
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-neutral-800 border-b-2 border-neutral-300 shadow-sm flex-shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-lg font-bold text-white leading-tight">
                {document.title}
              </h1>
              
              {documentStatus && (
                <div className="group relative">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${documentStatus.color} text-xs font-semibold border-2 border-current`}>
                    <StatusIcon size={14} />
                    <span>{documentStatus.label}</span>
                  </div>
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white border-2 border-iron-grey rounded-lg shadow-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <p className="text-sm text-neutral-800">{documentStatus.tooltip}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4 flex-wrap text-sm">
              <a href={document.url} target="_blank" rel="noopener noreferrer" className="text-neutral-100 hover:text-white flex items-center gap-1">
                <ExternalLink size={14} />
                <span>View on legislation.gov.uk</span>
              </a>

              <button
                onClick={() => setShowCopyright(true)}
                className="text-neutral-100 hover:text-white flex items-center gap-1"
              >
                <Info size={14} />
                <span>Copyright & Licensing</span>
              </button>
            </div>
          </div>

          <div className="flex gap-1.5 flex-shrink-0">
            <button onClick={() => onToggleFavorite(document.id)} className={`p-2 rounded-lg transition-all ${document.isFavorite ? 'bg-white text-neutral-800' : 'bg-neutral-700 text-white hover:bg-white hover:text-neutral-800'}`} title="Toggle favorite">
              <Star size={18} fill={document.isFavorite ? 'currentColor' : 'none'} />
            </button>

            <div className="relative">
              <button onClick={() => setShowFolderMenu(!showFolderMenu)} className="p-2 bg-neutral-700 text-white hover:bg-white hover:text-neutral-800 rounded-lg transition-all" title="Move to folder">
                <FolderInput size={18} />
              </button>

              {showFolderMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-neutral-300 rounded-lg shadow-xl z-10 max-h-64 overflow-y-auto">
                  <button onClick={() => { onMoveToFolder(document.id, null); setShowFolderMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-neutral-800 hover:bg-neutral-50 font-medium">
                    Unfiled
                  </button>
                  {folders.map(folder => (
                    <button key={folder.id} onClick={() => { onMoveToFolder(document.id, folder.id); setShowFolderMenu(false); }} className="w-full text-left px-4 py-2.5 text-sm text-neutral-800 hover:bg-neutral-50 font-medium border-t border-neutral-300/20">
                      {folder.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setHighlightMode(!highlightMode)} 
                className={`p-2 rounded-lg transition-all ${highlightMode ? 'bg-white text-neutral-800' : 'bg-neutral-700 text-white hover:bg-white hover:text-neutral-800'}`}
                title="Highlight mode"
              >
                <Highlighter size={18} />
              </button>

              {highlightMode && (
                <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-iron-grey rounded-lg shadow-xl z-10 p-2">
                  <div className="text-xs font-bold text-neutral-800 mb-2 px-2">Highlight Color:</div>
                  {HIGHLIGHT_COLORS.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedHighlightColor(idx)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-neutral-50 ${selectedHighlightColor === idx ? 'bg-neutral-50' : ''}`}
                    >
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: color.color, border: `2px solid ${color.border}` }} />
                      <span className="text-sm text-neutral-800">{color.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => onDelete(document.id)} className="p-2 bg-neutral-700 text-white hover:bg-red-600 rounded-lg transition-all" title="Delete document">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {!tocCollapsed && (
          <div 
            className="border-r-2 border-neutral-300 bg-white flex flex-col overflow-hidden relative"
            style={{ width: `${tocWidth}px`, minWidth: '200px', maxWidth: '600px' }}
          >
            <div className="p-4 border-b border-neutral-300 flex items-center justify-between">
              <h2 className="text-lg font-bold text-neutral-800">Contents</h2>
              <button
                onClick={() => setTocCollapsed(true)}
                className="p-1.5 hover:bg-neutral-50 rounded transition-colors"
                title="Hide table of contents"
              >
                <PanelLeftClose size={18} className="text-neutral-600" />
              </button>
            </div>

            <div className="px-4 py-3 border-b border-neutral-300">
              <div className="relative">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search provisions..." className="w-full px-4 py-2 pl-10 bg-neutral-50 text-neutral-800 placeholder-dim-grey/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-bronze border border-neutral-300/30 text-sm" />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-600" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2">
              {loadingTOC ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader className="w-8 h-8 text-primary-600 animate-spin mb-2" />
                  <p className="text-sm text-neutral-600">Loading contents...</p>
                </div>
              ) : filteredTOC.length > 0 ? (
                (() => {
                  let globalIdx = 0;
                  return filteredTOC.map(item => {
                    const startIdx = globalIdx;
                    globalIdx += 1 + item.children.length;
                    return renderTOCItem(item, startIdx);
                  });
                })()
              ) : (
                <div className="text-center py-8 text-neutral-600 text-sm">
                  {searchQuery ? `No match for "${searchQuery}"` : 'No contents available'}
                </div>
              )}
            </div>

            <div
              className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-neutral-600 transition-colors"
              onMouseDown={() => setIsResizing(true)}
            />
          </div>
        )}

        {tocCollapsed && (
          <div className="border-r-2 border-neutral-300 bg-white p-2">
            <button
              onClick={() => setTocCollapsed(false)}
              className="p-2 hover:bg-neutral-50 rounded-lg transition-colors"
              title="Show table of contents"
            >
              <PanelLeftOpen size={20} className="text-neutral-800" />
            </button>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedProvision && (
            <div className="bg-neutral-50 border-b-2 border-neutral-300 px-6 py-3 flex items-center justify-between flex-shrink-0">
              <button
                onClick={() => navigateProvision('prev')}
                disabled={currentProvisionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm"
              >
                <PrevIcon size={16} />
                Previous
              </button>
              
              <div className="text-center">
                <div className="text-xs text-neutral-600 font-medium">
                  {currentProvisionIndex + 1} of {flatProvisions.length}
                </div>
                <div className="text-sm font-bold text-neutral-800">
                  {selectedProvision.number} {selectedProvision.title}
                </div>
              </div>

              <button
                onClick={() => navigateProvision('next')}
                disabled={currentProvisionIndex === flatProvisions.length - 1}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-800 text-white rounded-lg hover:bg-neutral-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm"
              >
                Next
                <NextIcon size={16} />
              </button>
            </div>
          )}

          {selectedProvision && (
            <div className="bg-neutral-100 border-b border-neutral-200 px-6 py-2 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Display</span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDisplayTheme('light')}
                    className={`p-2 rounded transition-all flex items-center justify-center ${
                      displayTheme === 'light'
                        ? 'bg-neutral-800'
                        : 'bg-white hover:bg-neutral-50 border border-neutral-300'
                    }`}
                    title="Light theme"
                  >
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-neutral-400"></div>
                  </button>
                  <button
                    onClick={() => setDisplayTheme('dark')}
                    className={`p-2 rounded transition-all flex items-center justify-center ${
                      displayTheme === 'dark'
                        ? 'bg-neutral-800'
                        : 'bg-white hover:bg-neutral-50 border border-neutral-300'
                    }`}
                    title="Dark theme"
                  >
                    <div className="w-5 h-5 rounded-full bg-neutral-900"></div>
                  </button>
                  <button
                    onClick={() => setDisplayTheme('sepia')}
                    className={`p-2 rounded transition-all flex items-center justify-center ${
                      displayTheme === 'sepia'
                        ? 'bg-neutral-800'
                        : 'bg-white hover:bg-neutral-50 border border-neutral-300'
                    }`}
                    title="Sepia theme"
                  >
                    <div className="w-5 h-5 rounded-full" style={{backgroundColor: '#f5f1e8'}}></div>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Font Size</span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFontSize('small')}
                    className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                      fontSize === 'small'
                        ? 'bg-neutral-800 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-300'
                    }`}
                    title="Small font"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('medium')}
                    className={`px-3 py-1 text-sm font-medium rounded transition-all ${
                      fontSize === 'medium'
                        ? 'bg-neutral-800 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-300'
                    }`}
                    title="Medium font"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('large')}
                    className={`px-3 py-1 text-base font-medium rounded transition-all ${
                      fontSize === 'large'
                        ? 'bg-neutral-800 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-300'
                    }`}
                    title="Large font"
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('xlarge')}
                    className={`px-3 py-1 text-lg font-medium rounded transition-all ${
                      fontSize === 'xlarge'
                        ? 'bg-neutral-800 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-50 border border-neutral-300'
                    }`}
                    title="Extra large font"
                  >
                    A
                  </button>
                </div>
              </div>
            </div>
          )}

          <div 
            ref={contentRef} 
            className="flex-1 overflow-y-auto bg-white"
            onMouseUp={handleTextSelection}
          >
            {loadingProvision ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-lg text-neutral-800">Loading provision...</p>
              </div>
            ) : selectedProvision ? (
              <div className="p-8 max-w-4xl mx-auto">
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    {selectedProvision.number && (
                      <span className="text-2xl font-bold text-primary-600">
                        {selectedProvision.number}
                      </span>
                    )}
                    <h2 className="text-2xl font-bold text-neutral-800">
                      {selectedProvision.title}
                    </h2>
                  </div>
                  {selectedProvision.status && (
                    <span className="inline-block px-3 py-1 text-sm rounded bg-amber-100 text-amber-800 font-medium">
                      {selectedProvision.status}
                    </span>
                  )}
                </div>
                
                <div 
                  className="legislation-provision" 
                  data-theme={displayTheme}
                  data-font-size={fontSize}
                  dangerouslySetInnerHTML={{ __html: provisionContent }} 
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-center px-8">
                <div>
                  <p className="text-xl font-semibold text-neutral-800 mb-2">
                    Select a provision
                  </p>
                  <p className="text-sm text-neutral-600">
                    Click any item in the table of contents
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {rightPanelTab === 'relationships' && (
          <div className="w-[600px] border-l-2 border-neutral-300 bg-white flex flex-col shadow-lg overflow-hidden">
            <div className="bg-neutral-800 border-b-2 border-neutral-300 flex-shrink-0">
              <div className="flex items-center justify-between p-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3"/>
                    <circle cx="12" cy="5" r="2"/>
                    <circle cx="5" cy="12" r="2"/>
                    <circle cx="19" cy="12" r="2"/>
                    <circle cx="12" cy="19" r="2"/>
                    <line x1="12" y1="7" x2="12" y2="9"/>
                    <line x1="7" y1="12" x2="9" y2="12"/>
                    <line x1="15" y1="12" x2="17" y2="12"/>
                    <line x1="12" y1="15" x2="12" y2="17"/>
                  </svg>
                  Legislation Relationships
                </h3>
                <button
                  onClick={() => setRightPanelTab(null)}
                  className="text-white hover:text-primary-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-neutral-50">
              {loadingRelationships ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                  <p className="text-sm text-neutral-800">Loading relationships...</p>
                </div>
              ) : relationshipsData && relationshipsData.nodes.length > 1 ? (
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-bronze/30">
                    <h4 className="font-bold text-neutral-800 mb-3 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="16 18 22 12 16 6"/>
                        <polyline points="8 6 2 12 8 18"/>
                      </svg>
                      This Legislation Affects
                    </h4>
                    {relationshipsData.links
                      .filter((link: any) => link.source === relationshipsData.nodes[0].id)
                      .map((link: any, idx: number) => {
                        const targetNode = relationshipsData.nodes.find((n: any) => n.id === link.target);
                        return (
                          <div key={idx} className="mb-3 p-3 bg-neutral-50 rounded border border-neutral-300/20">
                            <div className="flex items-start gap-2">
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded font-semibold uppercase">
                                {link.type}
                              </span>
                              <a 
                                href={targetNode?.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-neutral-800 hover:text-primary-600 flex items-center gap-1"
                              >
                                {targetNode?.name}
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    {relationshipsData.links.filter((link: any) => link.source === relationshipsData.nodes[0].id).length === 0 && (
                      <p className="text-sm text-neutral-600 italic">No outgoing relationships found</p>
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-bronze/30">
                    <h4 className="font-bold text-neutral-800 mb-3 flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6"/>
                        <polyline points="15 18 21 12 15 6"/>
                      </svg>
                      This Legislation Is Affected By
                    </h4>
                    {relationshipsData.links
                      .filter((link: any) => link.target === relationshipsData.nodes[0].id)
                      .map((link: any, idx: number) => {
                        const sourceNode = relationshipsData.nodes.find((n: any) => n.id === link.source);
                        return (
                          <div key={idx} className="mb-3 p-3 bg-neutral-50 rounded border border-neutral-300/20">
                            <div className="flex items-start gap-2">
                              <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded font-semibold uppercase">
                                {link.type}
                              </span>
                              <a 
                                href={sourceNode?.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-neutral-800 hover:text-primary-600 flex items-center gap-1"
                              >
                                {sourceNode?.name}
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    {relationshipsData.links.filter((link: any) => link.target === relationshipsData.nodes[0].id).length === 0 && (
                      <p className="text-sm text-neutral-600 italic">No incoming relationships found</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-neutral-600 py-12">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-auto mb-4 opacity-30">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p className="text-sm">No relationship data available for this legislation</p>
                </div>
              )}
            </div>
          </div>
        )}

        {rightPanelTab === 'notes' && (
          <div className="w-80 border-l-2 border-neutral-300 bg-white flex flex-col shadow-lg overflow-hidden">
            <div className="bg-neutral-800 border-b-2 border-neutral-300 flex-shrink-0">
              <div className="flex items-center justify-between p-4 border-b border-neutral-300/30">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <StickyNote size={16} />
                  User Notes ({document.comments.length})
                </h3>
                <button
                  onClick={() => setRightPanelTab(null)}
                  className="text-white hover:text-primary-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-4 space-y-2">
                <div className="relative mb-2">
                  <input 
                    type="text" 
                    value={notesSearchQuery} 
                    onChange={(e) => setNotesSearchQuery(e.target.value)} 
                    placeholder="Search notes..." 
                    className="w-full px-3 py-2 pl-9 bg-white text-neutral-800 placeholder-dim-grey/60 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-bronze border border-neutral-300/30"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-600" />
                </div>
                
                <textarea 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)} 
                  placeholder="Add a note..." 
                  className="w-full px-3 py-2.5 bg-white text-neutral-800 placeholder-dim-grey/60 text-sm rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-bronze border border-neutral-300/30" 
                  rows={3} 
                />
                <button 
                  onClick={handleAddComment} 
                  disabled={!newComment.trim()} 
                  className="w-full bg-white text-neutral-800 font-semibold py-2.5 rounded-lg hover:bg-neutral-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                >
                  Add Note
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
              {filteredNotes.length === 0 ? (
                <div className="text-center text-neutral-600/60 py-8 italic text-sm">
                  {notesSearchQuery ? `No notes match "${notesSearchQuery}"` : 'No notes yet'}
                </div>
              ) : (
                filteredNotes.map(comment => (
                  <div key={comment.id} className="p-3 bg-white rounded-lg border border-neutral-300/20 shadow-sm">
                    <div className="text-xs text-neutral-600/70 mb-1.5 font-medium">
                      {comment.timestamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-sm text-neutral-800 leading-relaxed">{comment.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {rightPanelTab === null && (
          <div className="border-l-2 border-neutral-300 bg-white p-2 flex flex-col gap-2">
            <button
              onClick={() => setRightPanelTab('relationships')}
              className="p-2 hover:bg-neutral-50 rounded-lg transition-colors relative"
              title="Legislation Relationships"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-800">
                <circle cx="12" cy="12" r="3"/>
                <circle cx="12" cy="5" r="2"/>
                <circle cx="5" cy="12" r="2"/>
                <circle cx="19" cy="12" r="2"/>
                <circle cx="12" cy="19" r="2"/>
                <line x1="12" y1="7" x2="12" y2="9"/>
                <line x1="7" y1="12" x2="9" y2="12"/>
                <line x1="15" y1="12" x2="17" y2="12"/>
                <line x1="12" y1="15" x2="12" y2="17"/>
              </svg>
            </button>
            
            <button
              onClick={() => setRightPanelTab('notes')}
              className="p-2 hover:bg-neutral-50 rounded-lg transition-colors relative"
              title="User Notes"
            >
              <StickyNote size={20} className="text-neutral-800" />
              {document.comments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {document.comments.length}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
