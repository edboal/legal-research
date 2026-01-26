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
        
        // Clean URL - remove /contents and dates
        url = url.replace('/contents', '').split('/202')[0].split('/199')[0].split('/200')[0].split('/201')[0];
        
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
      console.log('🔍 Fetching document:', url);
      
      // Clean URL to base
      let baseUrl = url
        .replace('/contents', '')
        .replace('/data.htm', '')
        .replace('/data.html', '');
      
      // Remove dates/versions
      baseUrl = baseUrl.split('/enacted')[0].split('/202')[0].split('/199')[0].split('/200')[0].split('/201')[0];
      
      console.log('🧹 Cleaned base URL:', baseUrl);
      
      // ALWAYS try /enacted first - this bypasses version selection
      const enactedUrl = `${baseUrl}/enacted`;
      console.log('📜 Trying enacted version:', enactedUrl);
      
      const proxyUrl = `/api/legislation?url=${encodeURIComponent(enactedUrl)}`;
      const response = await fetch(proxyUrl);
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await response.text();
      console.log('📄 HTML received, length:', html.length);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Check the body text
      const bodyText = doc.body.textContent || '';
      console.log('📝 Body text preview:', bodyText.substring(0, 200));
      
      // More aggressive version selection detection
      const isVersionPage = 
        bodyText.includes('Latest available') ||
        bodyText.includes('Point in Time') ||
        bodyText.includes('Original (As enacted)') ||
        bodyText.includes('More Resources') && html.length < 20000;
      
      if (isVersionPage) {
        console.log('⚠️ Still got version selection page!');
        console.log('📋 Full body text:', bodyText);
        
        // Return error message
        return `
          <div style="padding: 30px; background: #fff3cd; border: 3px solid #ffc107; border-radius: 10px; margin: 20px;">
            <h2 style="color: #856404; margin-top: 0;">⚠️ Version Selection Page Detected</h2>
            <p style="color: #856404; font-size: 16px;">The legislation.gov.uk website returned a version selection page instead of the document content.</p>
            <p style="color: #856404;"><strong>Tried URL:</strong> <code>${enactedUrl}</code></p>
            <p style="margin: 20px 0;">
              <a href="${enactedUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Open Directly on legislation.gov.uk →
              </a>
            </p>
            <details style="margin-top: 20px; padding: 15px; background: white; border: 1px solid #ddd; border-radius: 5px;">
              <summary style="cursor: pointer; font-weight: bold; color: #666;">Debug Information</summary>
              <pre style="font-size: 12px; overflow: auto; margin-top: 10px;">${bodyText.substring(0, 1000)}</pre>
            </details>
          </div>
        `;
      }
      
      // Try to find content
      const selectors = [
        '#viewLegContents',
        '#content',
        '.LegContent', 
        '#legislation',
        'article',
        'main'
      ];
      
      let content = null;
      
      for (const selector of selectors) {
        const el = doc.querySelector(selector);
        if (el && el.textContent && el.textContent.length > 500) {
          content = el;
          console.log('✅ Found content with selector:', selector);
          break;
        }
      }
      
      if (!content) {
        console.log('❌ No content selector worked, using body');
        content = doc.body;
      }
      
      // Remove unwanted elements
      const unwanted = content.querySelectorAll(
        'script, style, nav, header, footer, .navigation, .breadcrumb, ' +
        '.toolTip, .LegNavigation, .printOptions, .moreResources, ' +
        '.accessKey, #layout1, .LegNav, .LegBreadcrumb'
      );
      
      console.log('🗑️ Removing', unwanted.length, 'unwanted elements');
      unwanted.forEach(el => el.remove());
      
      const finalHtml = content.innerHTML;
      console.log('✨ Final content length:', finalHtml.length);
      
      // Validate we have real content
      if (finalHtml.length < 500) {
        throw new Error('Content too short');
      }
      
      return finalHtml;
      
    } catch (error) {
      console.error('❌ Error fetching document:', error);
      return `
        <div style="padding: 30px; background: #f8d7da; border: 3px solid #dc3545; border-radius: 10px; margin: 20px;">
          <h2 style="color: #721c24; margin-top: 0;">❌ Failed to Load Document</h2>
          <p style="color: #721c24; font-size: 16px;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <p style="color: #721c24;"><strong>Attempted URL:</strong> <code>${url}</code></p>
          <p style="margin: 20px 0;">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Open Directly on legislation.gov.uk →
            </a>
          </p>
        </div>
      `;
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
        snippet: 'An Act to make provision to require Ministers of the Crown and others...',
        source: 'legislation' as const,
      },
    ].filter(result => 
      !query || result.title.toLowerCase().includes(query.toLowerCase())
    );
  },
};
