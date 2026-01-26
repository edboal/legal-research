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
        
        // Only remove /contents, keep the full legislation ID
        url = url.replace('/contents', '');
        
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
      
      // Clean URL - remove /contents, data extensions, and date paths
      let baseUrl = url
        .replace('/contents', '')
        .replace('/data.htm', '')
        .replace('/data.html', '');
      
      // Remove date paths like /2026-01-06 or /enacted
      baseUrl = baseUrl.replace(/\/\d{4}-\d{2}-\d{2}/g, '');
      baseUrl = baseUrl.replace(/\/enacted/g, '');
      
      console.log('🧹 Cleaned base URL:', baseUrl);
      
      // Try multiple strategies in order
      const strategies = [
        { url: baseUrl, desc: 'base URL' },
        { url: `${baseUrl}/enacted`, desc: 'enacted version' },
        { url: `${baseUrl}/contents`, desc: 'contents page' },
      ];
      
      for (const strategy of strategies) {
        console.log(`📜 Strategy ${strategies.indexOf(strategy) + 1}: Trying ${strategy.desc}:`, strategy.url);
        
        const proxyUrl = `/api/legislation?url=${encodeURIComponent(strategy.url)}`;
        const response = await fetch(proxyUrl);
        
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
          console.log(`❌ Failed with ${response.status}, trying next strategy`);
          continue;
        }

        const html = await response.text();
        console.log('📄 HTML received, length:', html.length);
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Check if this is a version selection page
        const bodyText = doc.body.textContent || '';
        
        // More specific detection - look for the actual version selection UI elements
        const hasVersionUI = doc.querySelector('.LegVersions') || 
                            doc.querySelector('[class*="version"]') ||
                            (bodyText.includes('Latest available') && 
                             bodyText.includes('Point in Time') && 
                             bodyText.includes('Original') &&
                             html.length < 30000);
        
        if (hasVersionUI) {
          console.log('⚠️ Version selection page detected, trying next strategy');
          continue;
        }
        
        // Try to find actual legislation content
        const selectors = [
          '#viewLegContents',
          '#content',
          '.LegContent',
          'article',
          'main'
        ];
        
        let content = null;
        
        for (const selector of selectors) {
          const el = doc.querySelector(selector);
          if (el && el.textContent && el.textContent.length > 1000) {
            content = el;
            console.log('✅ Found content with selector:', selector);
            break;
          }
        }
        
        if (!content) {
          console.log('⚠️ No content found with selectors, trying next strategy');
          continue;
        }
        
        // Remove unwanted elements
        const unwanted = content.querySelectorAll(
          'script, style, nav, header, footer, .navigation, .breadcrumb, ' +
          '.toolTip, .LegNavigation, .printOptions, .moreResources, ' +
          '.accessKey, #layout1, .LegNav, .LegBreadcrumb, .LegVersions'
        );
        
        console.log('🗑️ Removing', unwanted.length, 'unwanted elements');
        unwanted.forEach(el => el.remove());
        
        const finalHtml = content.innerHTML;
        console.log('✨ Final content length:', finalHtml.length);
        
        // Validate we have real content (not just navigation)
        if (finalHtml.length > 1000 && !finalHtml.includes('Skip to main content')) {
          console.log('✅ SUCCESS! Returning content from strategy:', strategy.desc);
          return finalHtml;
        }
        
        console.log('⚠️ Content too short or invalid, trying next strategy');
      }
      
      // All strategies failed
      console.error('❌ All strategies failed');
      return `
        <div style="padding: 30px; background: #fff3cd; border: 3px solid #ffc107; border-radius: 10px; margin: 20px;">
          <h2 style="color: #856404; margin-top: 0;">⚠️ Unable to Load Document</h2>
          <p style="color: #856404; font-size: 16px;">All loading strategies failed to retrieve the document content.</p>
          <p style="color: #856404;"><strong>Original URL:</strong> <code>${url}</code></p>
          <p style="color: #856404;"><strong>Base URL:</strong> <code>${baseUrl}</code></p>
          <p style="margin: 20px 0;">
            <a href="${baseUrl}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Open on legislation.gov.uk →
            </a>
          </p>
          <p style="font-size: 14px; color: #666;">
            This legislation may require manual version selection or have restricted access.
          </p>
        </div>
      `;
      
    } catch (error) {
      console.error('❌ Error fetching document:', error);
      return `
        <div style="padding: 30px; background: #f8d7da; border: 3px solid #dc3545; border-radius: 10px; margin: 20px;">
          <h2 style="color: #721c24; margin-top: 0;">❌ Error Loading Document</h2>
          <p style="color: #721c24; font-size: 16px;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          <p style="margin: 20px 0;">
            <a href="${url}" target="_blank" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Open on legislation.gov.uk →
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
