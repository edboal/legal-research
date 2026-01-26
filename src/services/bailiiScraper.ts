import type { SearchResult } from '../types';

const BAILII_BASE = 'https://www.bailii.org';

export const bailiiScraper = {
  async search(query: string): Promise<SearchResult[]> {
    try {
      // BAILII search URL format
      const searchUrl = `${BAILII_BASE}/cgi-bin/lucy_search_1.cgi?query=${encodeURIComponent(query)}`;
      
      // Note: This will likely hit CORS. In production, use Vercel serverless function
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        throw new Error('Search failed');
      }

      // TODO: Parse HTML response
      return [];
      
    } catch (error) {
      console.error('BAILII search error:', error);
      // Return mock data for development
      return this.getMockResults(query);
    }
  },

  async getDocument(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch case');
      }

      const html = await response.text();
      
      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // BAILII typically has content in the main body
      const content = doc.querySelector('body');
      
      if (!content) {
        throw new Error('Could not parse case content');
      }

      // Clean up the HTML - remove scripts, navigation, etc.
      const scripts = content.querySelectorAll('script, style, nav, header, footer');
      scripts.forEach(el => el.remove());
      
      return content.innerHTML;
      
    } catch (error) {
      console.error('Error fetching BAILII document:', error);
      throw error;
    }
  },

  // Mock data for development/testing
  getMockResults(query: string): SearchResult[] {
    return [
      {
        title: 'Caparo Industries plc v Dickman [1990] UKHL 2',
        url: `${BAILII_BASE}/uk/cases/UKHL/1990/2.html`,
        snippet: 'Leading case on duty of care in negligence. Established the three-stage test for establishing duty of care...',
        source: 'bailii' as const,
      },
      {
        title: 'Salomon v A Salomon & Co Ltd [1896] UKHL 1',
        url: `${BAILII_BASE}/uk/cases/UKHL/1896/1.html`,
        snippet: 'Foundational case establishing the principle of corporate separate legal personality...',
        source: 'bailii' as const,
      },
      {
        title: 'Donoghue v Stevenson [1932] UKHL 100',
        url: `${BAILII_BASE}/uk/cases/UKHL/1932/100.html`,
        snippet: 'Landmark case that established the modern concept of negligence in tort law...',
        source: 'bailii' as const,
      },
    ].filter(result => 
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.snippet.toLowerCase().includes(query.toLowerCase())
    );
  },
};
