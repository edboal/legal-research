# Troubleshooting Document Loading

## Issue: Documents Not Loading

If search works but clicking a document doesn't display content:

### Step 1: Check Browser Console

**Open Developer Tools:**
- Chrome/Edge: Press F12 or Ctrl+Shift+I (Cmd+Option+I on Mac)
- Firefox: Press F12 or Ctrl+Shift+K
- Safari: Enable Developer menu, then Cmd+Option+I

**Look for these console messages:**
```
Fetching document: https://www.legislation.gov.uk/...
Proxy URL: /api/legislation?url=...
Response status: 200
Received HTML, length: ...
```

### Step 2: Common Issues & Fixes

#### A. **404 on /api/legislation**
**Symptoms:**
```
GET /api/legislation?url=... 404 (Not Found)
```

**Cause:** Serverless function not deployed

**Fix:**
```bash
# Make sure /api/legislation.ts exists
ls api/legislation.ts

# Redeploy to Vercel
git add api/legislation.ts
git commit -m "Add API proxy"
git push origin main
```

**Verify:** Check Vercel dashboard → Functions tab → should see `legislation`

---

#### B. **CORS Error**
**Symptoms:**
```
Access to fetch blocked by CORS policy
```

**Cause:** Direct fetch to legislation.gov.uk (proxy not being used)

**Fix:** Verify in `src/services/legislationAPI.ts`:
```typescript
const USE_PROXY = true; // Must be true
```

---

#### C. **Empty Content**
**Symptoms:**
```
Received HTML, length: 0
or
Extracted content, length: 0
```

**Cause:** Parser can't find content in returned HTML

**Fix:** The URL might be pointing to a redirect or table of contents

**Try:**
1. Copy the legislation URL
2. Open it in a new browser tab
3. If it's a table of contents, click into a specific section
4. Try that section's URL instead

---

#### D. **500 Internal Server Error**
**Symptoms:**
```
Response status: 500
Failed to fetch document: 500
```

**Cause:** Serverless function crashed

**Check Vercel Logs:**
1. Go to Vercel dashboard
2. Click your project
3. Go to "Deployments" → Latest
4. Click "Functions" → Click the failed request
5. Read the error message

**Common serverless errors:**
- Timeout (function took >10 seconds)
- Memory limit exceeded
- Invalid URL

---

### Step 3: Test API Proxy Directly

**Test the proxy endpoint:**
1. Open your browser
2. Go to: `https://your-app.vercel.app/api/legislation?url=https://www.legislation.gov.uk/ukpga/2006/46/contents`

**Expected result:** HTML content from legislation.gov.uk

**If you get an error:** Copy the error message and:
- Check if the URL is correct
- Verify the function is deployed on Vercel
- Check function logs in Vercel dashboard

---

### Step 4: Verify Vercel Function Deployment

**In Vercel Dashboard:**
1. Project → Settings → Functions
2. Should see: `/api/legislation.ts`
3. Check "Logs" tab for any deployment errors

**If function is missing:**
```bash
# Ensure file is in correct location
ls api/legislation.ts

# Should show: api/legislation.ts

# Commit and push
git add api/
git commit -m "Add API proxy function"
git push origin main

# Wait 30-60 seconds for deployment
```

---

### Step 5: Debug with Mock Data

**Temporarily disable proxy to isolate the issue:**

In `src/services/legislationAPI.ts`:
```typescript
const USE_PROXY = false; // Temporarily set to false
```

**Rebuild and test:**
```bash
npm run build
```

**If mock data displays:** Problem is with API proxy, not document rendering

**If mock data also fails:** Problem is with document rendering component

---

## Quick Diagnostic Script

Run this in browser console after clicking a document:

```javascript
// Check if API proxy exists
fetch('/api/legislation?url=https://www.legislation.gov.uk/ukpga/2006/46/contents')
  .then(r => r.text())
  .then(html => console.log('API works! HTML length:', html.length))
  .catch(e => console.error('API failed:', e))
```

**Expected:** `API works! HTML length: 123456`

**If fails:** API proxy issue (see Step 4)

---

## Still Not Working?

### Collect This Information:

1. **Browser console errors** (copy full error messages)
2. **Vercel function logs** (from dashboard)
3. **Test URL** that's failing to load
4. **Screenshot** of the error

### Then:

**Option A:** Open browser console, take a screenshot of all errors

**Option B:** Check Vercel deployment logs:
- Dashboard → Your Project → Deployments → Latest
- Click "Functions" tab
- Look for errors with `/api/legislation`

---

## Working Example

**This should always work:**

1. Search: "Companies Act 2006"
2. Click: "Companies Act 2006" result
3. Console should show:
   ```
   Fetching document: https://www.legislation.gov.uk/ukpga/2006/46/contents
   Proxy URL: /api/legislation?url=https%3A%2F%2F...
   Response status: 200
   Received HTML, length: 45623
   Extracted content, length: 42891
   Document loaded successfully
   ```
4. Document displays in viewer

**If any step fails:** See corresponding fix above

---

## Prevention Checklist

Before deploying:
- [ ] `/api/legislation.ts` exists
- [ ] `USE_PROXY = true` in legislationAPI.ts
- [ ] File committed to git
- [ ] Pushed to GitHub
- [ ] Vercel auto-deployed (check dashboard)
- [ ] Test search works
- [ ] Test document loading works
- [ ] Check browser console for errors

---

## Contact

If still stuck after trying all steps:
1. Copy all browser console output
2. Copy Vercel function logs
3. Note which step failed
4. Share the specific legislation URL that won't load
