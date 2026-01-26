import type { SearchResult } from '../types';

const LEGISLATION_BASE = 'https://www.legislation.gov.uk';
const USE_PROXY = true;

// Legislation types available on legislation.gov.uk
export const LEGISLATION_TYPES = {
  ukpga: 'UK Public General Acts',
  ukla: 'UK Local Acts',
  asp: 'Acts of the Scottish Parliament',
  asc: 'Acts of Senedd Cymru',
  anaw: 'Acts of the National Assembly for Wales',
  mwa: 'Measures of the National Assembly for Wales',
  ukcm: 'UK Church Measures',
  uksi: 'UK Statutory Instruments',
  ssi: 'Scottish Statutory Instruments',
  wsi: 'Wales Statutory Instruments',
  nisr: 'Northern Ireland Statutory Rules',
  ukci: 'UK Church Instruments',
} as const;

export type LegislationType = keyof typeof LEGISLATION_TYPES;

export interface LegislationSearchParams {
  title?: string;
  type?: LegislationType | '*'; // * for all types
  year?: number;
  number?: number;
  startYear?: number;
  endYear?: number;
  resultsCount?: number; // Default is 20
}

export const legislationAPI = {
  /**
   * Search legislation using the Atom feed API
   * @see https://www.legislation.gov.uk/developer/searching
   */
  async search(params: LegislationSearchParams): Promise<SearchResult[]> {
    if (!USE_PROXY) {
      return this.getMockResults(params.title || '');
    }

    try {
      // Build search query
      const queryParams = new URLSearchParams();
      
      if (params.title) queryParams.append('title', params.title);
      if (params.type) queryParams.append('type', params.type);
      if (params.year) queryParams.append('year', params.year.toString());
      if (params.number) queryParams.append('number', params.number.toString());
      if (params.startYear) queryParams.append('start-year', params.startYear.toString());
      if (params.endYear) queryParams.append('end-year', params.endYear.toString());
      if (params.resultsCount) queryParams.append('results-count', params.resultsCount.toString());

      // Use Atom feed endpoint for search results
      const searchUrl = `${LEGISLATION_BASE}/all/data.feed?${queryParams.toString()}`;
      const proxyUrl = `/api/legislation?url=${encodeURIComponent(searchUrl)}`;
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        console.error('Search failed, falling back to mock data');
        return this.getMockResults(params.title || '');
      }

      const xml = await response.text();
      return this.parseAtomFeed(xml);
      
    } catch (error) {
      console.error('Legislation search error:', error);
      return this.getMockResults(params.title || '');
    }
  },

  /**
   * Parse Atom feed XML to extract search results
   */
  parseAtomFeed(xml: string): SearchResult[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const results: SearchResult[] = [];

    const entries = doc.querySelectorAll('entry');
    
    entries.forEach((entry) => {
      // Get title
      const titleEl = entry.querySelector('title');
      const title = titleEl?.textContent?.trim() || '';

      // Get link (use 'alternate' rel for HTML view)
      const linkEl = entry.querySelector('link[rel="alternate"][type="text/html"]');
      const url = linkEl?.getAttribute('href') || '';

      // Get summary/snippet
      const summaryEl = entry.querySelector('summary');
      const snippet = summaryEl?.textContent?.trim() || '';

      // Get updated date for display
      const updatedEl = entry.querySelector('updated');
      const updated = updatedEl?.textContent?.trim() || '';

      if (title && url) {
        results.push({
          title,
          url: url.startsWith('http') ? url : `${LEGISLATION_BASE}${url}`,
          snippet: snippet || `Last updated: ${updated}`,
          source: 'legislation' as const,
        });
      }
    });

    return results;
  },

  /**
   * Get document content as HTML
   */
  async getDocument(url: string): Promise<string> {
    if (!USE_PROXY) {
      return '<p>Mock document content. Enable USE_PROXY to fetch real data.</p>';
    }

    try {
      const proxyUrl = `/api/legislation?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch document');
      }

      const html = await response.text();
      
      // Parse and extract main content
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // legislation.gov.uk uses these classes for main content
      const content = doc.querySelector(
        '.LegSnippet, .LegContent, #content, .content, main'
      );
      
      if (content) {
        // Remove unwanted elements
        const unwanted = content.querySelectorAll(
          'script, style, .navigation, .breadcrumb, .footer'
        );
        unwanted.forEach(el => el.remove());
        
        return content.innerHTML;
      }
      
      // Fallback: return body content
      return doc.body.innerHTML;
      
    } catch (error) {
      console.error('Error fetching legislation document:', error);
      throw error;
    }
  },

  /**
   * Get document as XML (CLML format)
   * Useful for structured parsing
   */
  async getDocumentXML(url: string): Promise<string> {
    if (!USE_PROXY) {
      return '<mock>XML content</mock>';
    }

    try {
      // Append /data.xml to get XML representation
      const xmlUrl = url.endsWith('/') ? `${url}data.xml` : `${url}/data.xml`;
      const proxyUrl = `/api/legislation?url=${encodeURIComponent(xmlUrl)}`;
      
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch XML');
      }

      return await response.text();
    } catch (error) {
      console.error('Error fetching XML:', error);
      throw error;
    }
  },

  /**
   * Browse by type and year
   */
  async browseByType(type: LegislationType, year?: number): Promise<SearchResult[]> {
    const params: LegislationSearchParams = {
      type,
      resultsCount: 50,
    };
    
    if (year) {
      params.year = year;
    }

    return this.search(params);
  },

  /**
   * Get recent legislation (last 30 days)
   */
  async getRecent(type?: LegislationType): Promise<SearchResult[]> {
    const currentYear = new Date().getFullYear();
    return this.search({
      type: type || '*',
      startYear: currentYear - 1,
      endYear: currentYear,
      resultsCount: 50,
    });
  },

  // Mock data for development/testing
  getMockResults(query: string): SearchResult[] {
    return [
      {
        title: 'Companies Act 2006',
        url: `${LEGISLATION_BASE}/ukpga/2006/46/contents`,
        snippet: 'An Act to reform company law and restate the greater part of the enactments relating to companies...',
        source: 'legislation' as const,
      },
      {
        title: 'Employment Rights Act 1996',
        url: `${LEGISLATION_BASE}/ukpga/1996/18/contents`,
        snippet: 'An Act to consolidate enactments relating to employment rights...',
        source: 'legislation' as const,
      },
      {
        title: 'Data Protection Act 2018',
        url: `${LEGISLATION_BASE}/ukpga/2018/12/contents`,
        snippet: 'An Act to make provision for the regulation of the processing of information relating to individuals...',
        source: 'legislation' as const,
      },
      {
        title: 'Consumer Rights Act 2015',
        url: `${LEGISLATION_BASE}/ukpga/2015/15/contents`,
        snippet: 'An Act to amend the law relating to the rights of consumers...',
        source: 'legislation' as const,
      },
      {
        title: 'Equality Act 2010',
        url: `${LEGISLATION_BASE}/ukpga/2010/15/contents`,
        snippet: 'An Act to make provision to require Ministers of the Crown and others when making strategic decisions about the exercise of their functions to have regard to the desirability of reducing socio-economic inequalities...',
        source: 'legislation' as const,
      },
    ].filter(result => 
      !query || result.title.toLowerCase().includes(query.toLowerCase())
    );
  },
};
