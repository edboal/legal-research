import type { SearchResult } from '../types';

const LEGISLATION_BASE = 'https://www.legislation.gov.uk';
const USE_PROXY = true;

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
  type?: LegislationType | '*';
  year?: number;
  number?: number;
  startYear?: number;
  endYear?: number;
  resultsCount?: number;
}

export const legislationAPI = {
  async search(params: LegislationSearchParams): Promise<SearchResult[]> {
    if (!USE_PROXY) {
      return this.getMockResults(params.title || '');
    }

    try {
      const queryParams = new URLSearchParams();
      
      if (params.title) queryParams.append('title', params.title);
      if (params.type) queryParams.append('type', params.type);
      if (params.year) queryParams.append('year', params.year.toString());
      if (params.number) queryParams.append('number', params.number.toString());
      if (params.startYear) queryParams.append('start-year', params.startYear.toString());
      if (params.endYear) queryParams.append('end-year', params.endYear.toString());
      if (params.resultsCount) queryParams.append('results-count', params.resultsCount.toString());

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

  parseAtomFeed(xml: string): SearchResult[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const results: SearchResult[] = [];

    const entries = doc.querySelectorAll('entry');
    
    entries.forEach((entry) => {
      const titleEl = entry.querySelector('title');
      const title = titleEl?.textContent?.trim() || '';

      const linkEl = entry.querySelector('link[rel="alternate"][type="text/html"]');
      let url = linkEl?.getAttribute('href') || '';

      const summaryEl = entry.querySelector('summary');
      const snippet = summaryEl?.textContent?.trim() || '';

      const updatedEl = entry.querySelector('updated');
      const updated = updatedEl?.textContent?.trim() || '';

      if (title && url) {
        if (url.startsWith('http://')) {
          url = url.replace('http://', 'https://');
        }
        if (!url.startsWith('http')) {
          url = `${LEGISLATION_BASE}${url}`;
        }
        
        // Remove /contents and any date/version from the URL
        url = url.replace('/contents', '').split('/enacted')[0].split('/202')[0].split('/199')[0].split('/200')[0].split('/201')[0];
        
        results.push({
          title,
          url,
          snippet: snippet || `Last updated: ${updated}`,
          source: 'legislation' as const,
        });
      }
    });

    return results;
  },

  async getDocument(url: string): Promise<string> {
    if (!USE_PROXY) {
      return '<p>Mock document content. Enable USE_PROXY to fetch real data.</p>';
    }

    try {
      console.log('Original URL:', url);
      
      // Clean URL to base legislation ID
      let baseUrl = url
        .replace('/contents', '')
        .replace('/data.htm', '')
        .replace('/data.html', '');
      
      // Remove any date/version paths like /2026-01-19 or /enacted
      baseUrl = baseUrl.split('/enacted')[0].split('/202')[0].split('/199')[0].split('/200')[0].split('/201')[0];
      
      console.log('Base URL:', baseUrl);
      
      // Try multiple strategies to get content
      const strategies = [
        baseUrl,                           // Base URL (e.g., /ukpga/2006/46)
        `${baseUrl}/contents`,             // Contents page
        `${baseUrl}/section/1`,            // First section
        `${baseUrl}/enacted`,              // Enacted version
        `${baseUrl}/enacted/contents`,     // Enacted contents
      ];
      
      for (const tryUrl of strategies) {
        console.log('Trying:', tryUrl);
        
        const proxyUrl = `/api/legislation?url=${encodeURIComponent(tryUrl)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          console.log('Failed:', response.status);
          continue;
        }

        const html = await response.text();
        console.log('Response length:', html.length);
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Check if this is a version selection page
        const pageText = doc.body.textContent || '';
        if (pageText.includes('Latest available (Revised)') && 
            pageText.includes('Point in Time') && 
            pageText.includes('Original (As enacted)') &&
            html.length < 10000) {
          console.log('Version selection page, trying next strategy');
          continue;
        }
        
        // Try multiple content selectors
        const selectors = [
          '#viewLegContents',
          '#content',
          '.LegContent',
          'article',
          'main'
        ];
        
        let content = null;
        for (const selector of selectors) {
          content = doc.querySelector(selector);
          if (content && content.textContent && content.textContent.length > 500) {
            console.log('Found content with:', selector);
            break;
          }
        }
        
        if (!content) {
          console.log('No content found with selectors, trying body');
          content = doc.body;
        }
        
        if (content) {
          // Remove unwanted elements
          const unwanted = content.querySelectorAll(
            'script, style, nav, header, footer, .navigation, .breadcrumb, ' +
            '.toolTip, .LegNavigation, .printOptions, .moreResources, ' +
            '.accessKey, #layout1, .LegNav'
          );
          unwanted.forEach(el => el.remove());
          
          const finalHtml = content.innerHTML;
          
          // Verify we got actual content
          if (finalHtml.length > 500 && 
              !finalHtml.includes('Latest available (Revised)') && 
              !finalHtml.includes('Point in Time')) {
            console.log('Success! Content length:', finalHtml.length);
            return finalHtml;
          }
        }
      }
      
      // All strategies failed
      console.error('All strategies failed to get content');
      return `
        <div style="padding: 20px; background: #f0e68c; border: 2px solid #daa520; border-radius: 8px;">
          <h2>Unable to Load Document</h2>
          <p>The legislation content could not be retrieved from <a href="${url}" target="_blank">${url}</a></p>
          <p>Please click the link above to view it directly on legislation.gov.uk</p>
          <p style="font-size: 0.9em; color: #666;">This may be because the document requires selecting a specific version or has restricted access.</p>
        </div>
      `;
      
    } catch (error) {
      console.error('Error fetching legislation document:', error);
      throw error;
    }
  },

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

  async getRecent(type?: LegislationType): Promise<SearchResult[]> {
    const currentYear = new Date().getFullYear();
    return this.search({
      type: type || '*',
      startYear: currentYear - 1,
      endYear: currentYear,
      resultsCount: 50,
    });
  },

  getMockResults(query: string): SearchResult[] {
    return [
      {
        title: 'Companies Act 2006',
        url: `${LEGISLATION_BASE}/ukpga/2006/46`,
        snippet: 'An Act to reform company law and restate the greater part of the enactments relating to companies...',
        source: 'legislation' as const,
      },
      {
        title: 'Employment Rights Act 1996',
        url: `${LEGISLATION_BASE}/ukpga/1996/18`,
        snippet: 'An Act to consolidate enactments relating to employment rights...',
        source: 'legislation' as const,
      },
      {
        title: 'Data Protection Act 2018',
        url: `${LEGISLATION_BASE}/ukpga/2018/12`,
        snippet: 'An Act to make provision for the regulation of the processing of information relating to individuals...',
        source: 'legislation' as const,
      },
      {
        title: 'Consumer Rights Act 2015',
        url: `${LEGISLATION_BASE}/ukpga/2015/15`,
        snippet: 'An Act to amend the law relating to the rights of consumers...',
        source: 'legislation' as const,
      },
      {
        title: 'Equality Act 2010',
        url: `${LEGISLATION_BASE}/ukpga/2010/15`,
        snippet: 'An Act to make provision to require Ministers of the Crown and others when making strategic decisions...',
        source: 'legislation' as const,
      },
    ].filter(result => 
      !query || result.title.toLowerCase().includes(query.toLowerCase())
    );
  },
};
