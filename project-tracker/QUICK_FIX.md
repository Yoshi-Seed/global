# Quick Fix Guide - PR Creation Error

## 🚀 Fast Track Solution

### 1️⃣ Test GitHub Access (2 minutes)

```bash
cd project-tracker/workers
export GITHUB_TOKEN="your_github_token_here"
node test-github-api.js
```

**Expected Output:**
```
✅ Authentication successful
✅ Repository access successful
✅ Main branch reference found
✅ CSV file found
🎉 All tests passed!
```

**If tests fail:** Fix the specific issue identified (see error message)

### 2️⃣ Deploy Updated Worker (1 minute)

**Option A: Wrangler CLI**
```bash
cd project-tracker/workers
export CLOUDFLARE_API_TOKEN="your_cloudflare_token"
wrangler deploy --env=""
```

**Option B: Cloudflare Dashboard**
1. Open: https://dash.cloudflare.com/
2. Go to: Workers & Pages → project-tracker-api
3. Click: "Quick Edit"
4. Copy & paste: `workers/add-project.js` content
5. Click: "Save and Deploy"

### 3️⃣ Test Registration (1 minute)

1. Open `register.html` in browser
2. Fill in a test project
3. Click "登録する"
4. Check for detailed error message (not generic error)

---

## 🔍 Common Issues & Solutions

### Issue: Test script shows 401 (Authentication failed)

**Solution:**
```bash
# Create new GitHub token with 'repo' scope
# Go to: https://github.com/settings/tokens
# Then update in Cloudflare:
wrangler secret put GITHUB_TOKEN
```

### Issue: Test script shows 404 (CSV file not found)

**Solution:**
```bash
# Verify file exists
ls -la project-tracker/seed_planning_data.csv

# Check on GitHub
# https://github.com/Yoshi-Seed/global/blob/main/project-tracker/seed_planning_data.csv

# If missing, commit and push:
git add seed_planning_data.csv
git commit -m "Add CSV file"
git push origin main
```

### Issue: Deployment failed (No API token)

**Solution:**
```bash
# Get token from: https://dash.cloudflare.com/profile/api-tokens
export CLOUDFLARE_API_TOKEN="your_token_here"
wrangler deploy --env=""
```

---

## 📝 What Changed

**Before:** Generic error
```
❌ Cannot read properties of undefined (reading 'sha')
```

**After:** Specific error with details
```
✅ Failed to fetch CSV file (404): Not Found
   Path: project-tracker/seed_planning_data.csv
   
✅ Failed to authenticate (401): Bad credentials
   Check your GITHUB_TOKEN
```

---

## ✅ Verification

After deployment, you should see:
- ✅ Detailed error messages (not generic)
- ✅ HTTP status codes in errors
- ✅ File paths in error messages
- ✅ Specific GitHub API error details

---

## 📚 Full Documentation

For detailed information, see:
- `PR_CREATION_ERROR_FIX.md` - Complete analysis and solution
- `workers/DEPLOYMENT_GUIDE.md` - Detailed deployment instructions
- `workers/test-github-api.js` - Diagnostic test script

---

## 🆘 Still Having Issues?

1. **Run diagnostic:** `node workers/test-github-api.js`
2. **Check logs:** `wrangler tail` or Cloudflare Dashboard
3. **Verify secrets:** All 4 environment variables set
4. **Share error:** Copy the new detailed error message

---

**Total Time: ~5 minutes** ⏱️
