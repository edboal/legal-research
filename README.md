# Legal Research Tool

A web-based legal research application for searching and managing legislation from legislation.gov.uk and case law from BAILII.org.

## Features

- 🔍 **Dual-source search**: Search both legislation.gov.uk and BAILII
- 📁 **Folder organization**: Create nested folders to organize your research
- ⭐ **Favorites**: Mark important documents for quick access
- ✏️ **Highlights**: Select and highlight important passages
- 💬 **Comments**: Add annotations and notes to documents
- 💾 **Local storage**: All data persists in your browser (no account needed)

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Editor**: Plate (rich text editor)
- **Styling**: Tailwind CSS
- **Storage**: localStorage
- **Deployment**: Vercel

## Color Palette

- Cotton Rose: `#eeb4b3`
- Petal Pink: `#c179b9`
- Purple X11: `#a42cd6`
- Indigo Velvet: `#502274`
- Shadow Grey: `#2f242c`

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Local Development

```bash
npm run dev
```

Open http://localhost:5173

## Deployment to Vercel

### Option 1: GitHub Integration (Recommended)

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite and deploy

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Known Limitations

### CORS Issues

Both legislation.gov.uk and BAILII.org may block direct browser requests due to CORS policies. 

**Current workaround**: The app uses mock data for development.

**Production solution**: Implement Vercel serverless functions as proxies:

```typescript
// api/fetch-legislation.ts
export default async function handler(req, res) {
  const { url } = req.query;
  const response = await fetch(url);
  const data = await response.text();
  res.status(200).send(data);
}
```

Then update the API services to call `/api/fetch-legislation?url=...`

## Project Structure

```
legal-research-tool/
├── src/
│   ├── components/
│   │   ├── Search.tsx           # Dual-source search interface
│   │   ├── Sidebar.tsx          # Folders and favorites tree
│   │   └── DocumentViewer.tsx   # Document display with annotations
│   ├── services/
│   │   ├── legislationAPI.ts    # legislation.gov.uk integration
│   │   ├── bailiiScraper.ts     # BAILII integration
│   │   └── storage.ts           # localStorage persistence
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── App.tsx                  # Main application
│   └── main.tsx                 # Entry point
├── vercel.json                   # Vercel configuration
└── package.json
```

## Future Enhancements

- [ ] Implement serverless proxy for CORS-free fetching
- [ ] Advanced search filters (date range, jurisdiction, etc.)
- [ ] Export annotations to PDF/Word
- [ ] Cross-reference detection between documents
- [ ] Full-text search across saved documents
- [ ] Dark/light theme toggle
- [ ] Keyboard shortcuts
- [ ] Cloud sync (optional Firebase/Supabase integration)

## License

MIT
