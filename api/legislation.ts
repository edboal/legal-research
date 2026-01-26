import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter required' });
  }

  // Only allow legislation.gov.uk URLs
  if (!url.startsWith('https://www.legislation.gov.uk')) {
    return res.status(403).json({ error: 'Only legislation.gov.uk URLs allowed' });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Legal Research Tool (Educational)',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch: ${response.statusText}` 
      });
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      return res.status(200).json(data);
    } else if (contentType?.includes('application/xml') || contentType?.includes('text/xml')) {
      const text = await response.text();
      return res.status(200).setHeader('Content-Type', 'application/xml').send(text);
    } else {
      const text = await response.text();
      return res.status(200).setHeader('Content-Type', 'text/html').send(text);
    }
  } catch (error) {
    console.error('Error fetching legislation:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
