# Legal Research Tool - Live Data Setup

## 🎯 What Changed

I've added **Vercel serverless API functions** that act as proxies to fetch real data from:
- **legislation.gov.uk** (UK legislation)
- **BAILII.org** (British and Irish case law)

## 🚀 How to Deploy with Live Data

### 1. Push Updated Code to GitHub

```bash
cd legal-research-tool
git add .
git commit -m "Add API proxies for live data"
git push origin main
```

### 2. Vercel Auto-Deploys

Once you push, Vercel will automatically:
- Detect the `/api` directory
- Deploy the serverless functions
- Make them available at:
  - `https://your-app.vercel.app/api/legislation`
  - `https://your-app.vercel.app/api/bailii`

### 3. Test Live Data

After deployment:

1. **Search for legislation**: Try "Companies Act 2006"
2. **Search for cases**: Try "Donoghue v Stevenson"
3. Click results to load **real documents** from the actual websites

## 🔧 How It Works

```
Browser → /api/legislation?url=... → Vercel Function → legislation.gov.uk
                                                     ↓
Browser ← HTML Content ← Vercel Function ← Response
```

The serverless functions bypass CORS because they run server-side, not in the browser.

## ⚙️ Configuration

In `src/services/legislationAPI.ts` and `src/services/bailiiScraper.ts`:

```typescript
const USE_PROXY = true; // true = live data, false = mock data
```

Set to `false` for local development with mock data (no API calls).

## 📁 New Files Added

```
/api
  ├── legislation.ts    # Proxy for legislation.gov.uk
  └── bailii.ts         # Proxy for BAILII.org
```

## ⚠️ Important Notes

### 1. Rate Limiting
Both sites may rate-limit excessive requests. Consider:
- Caching frequently accessed documents
- Adding delays between searches
- Respecting their terms of service

### 2. HTML Parsing
The search result parsing is **best-effort** because:
- legislation.gov.uk and BAILII don't have official APIs
- Their HTML structure may change
- Some searches may fall back to mock data

### 3. Content Cleaning
Documents are fetched "as-is" with basic cleaning:
- Scripts/styles removed
- Navigation elements stripped
- But formatting may vary

## 🐛 Troubleshooting

### "Failed to fetch document"
- Check Vercel function logs
- The target site may be down
- CORS or rate limiting may be blocking

### Search returns mock data
- Parser may have failed
- Check browser console for errors
- HTML structure may have changed

### API functions not working locally
- Vercel functions only work in deployment
- For local dev, set `USE_PROXY = false`
- Or use `vercel dev` to test locally

## 🎓 Legal/Ethical Considerations

Both legislation.gov.uk and BAILII.org provide free public access to legal information:
- **legislation.gov.uk**: Crown copyright, freely available
- **BAILII.org**: Non-profit, publicly accessible case law

This tool:
- Fetches public data for educational/research purposes
- Doesn't bypass paywalls or authentication
- Attributes sources clearly
- Respects robots.txt (via User-Agent headers)

## 📊 Success Metrics

After deploying, you should see:
- ✅ Real legislation titles in search results
- ✅ Real case names from BAILII
- ✅ Full document content loading
- ✅ Proper formatting and structure

## 🔄 Next Deploy

```bash
# After making changes
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys in ~60 seconds
```

## 🆘 Support

If live data isn't working:
1. Check Vercel deployment logs
2. Test API endpoints directly: `/api/legislation?url=https://www.legislation.gov.uk/ukpga/2006/46/contents`
3. Verify the functions are deployed (Vercel dashboard → Functions tab)
