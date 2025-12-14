# PR Creation Error - Analysis and Fix

## Problem Summary

When submitting a new project through the registration form (`register.html`), the following error occurred:

```
Cannot read properties of undefined (reading 'sha')
```

## Root Cause Analysis

The error was occurring in the Cloudflare Worker (`workers/add-project.js`) at line ~250, where the code attempted to access `fileData.sha` after fetching the CSV file from GitHub:

```javascript
const fileData = await fileResponse.json();
const currentSha = fileData.sha;  // ❌ Error: fileData is undefined
```

The issue was caused by insufficient error handling. When the GitHub API call failed or returned an unexpected response, the code would still try to access properties on an undefined object, resulting in the cryptic error message.

## Possible Underlying Causes

1. **GitHub API Authentication Issue**: The GitHub token may be invalid, expired, or lack proper permissions
2. **CSV File Path Issue**: The file path might be incorrect or the file might not exist at the expected location
3. **GitHub API Rate Limiting**: API calls may be hitting rate limits
4. **Network or API Issues**: Temporary GitHub API outages or network problems

## Solution Implemented

### 1. Enhanced Error Handling (workers/add-project.js)

Added comprehensive error handling at every step of the PR creation process:

#### Step 1: Main Branch Reference Fetch
```javascript
const refResponse = await fetch(`${apiBase}/git/refs/heads/main`, { headers });

if (!refResponse.ok) {
  let errorData;
  try {
    errorData = await refResponse.json();
  } catch (e) {
    errorData = { message: refResponse.statusText };
  }
  throw new Error(`Failed to fetch main branch ref (${refResponse.status}): ${errorData.message || refResponse.statusText}`);
}

const refData = await refResponse.json();

if (!refData || !refData.object || !refData.object.sha) {
  throw new Error(`Invalid main branch ref data: ${JSON.stringify(refData)}`);
}
```

#### Step 2: Branch Creation
```javascript
const createBranchResponse = await fetch(`${apiBase}/git/refs`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    ref: `refs/heads/${branchName}`,
    sha: mainSha,
  }),
});

if (!createBranchResponse.ok) {
  let errorData;
  try {
    errorData = await createBranchResponse.json();
  } catch (e) {
    errorData = { message: createBranchResponse.statusText };
  }
  throw new Error(`Failed to create branch ${branchName} (${createBranchResponse.status}): ${errorData.message || createBranchResponse.statusText}`);
}
```

#### Step 3: CSV File Fetch (Where Original Error Occurred)
```javascript
const fileResponse = await fetch(`${apiBase}/contents/${csvPath}?ref=main`, { headers });

if (!fileResponse.ok) {
  let errorData;
  try {
    errorData = await fileResponse.json();
  } catch (e) {
    errorData = { message: fileResponse.statusText };
  }
  throw new Error(`Failed to fetch CSV file (${fileResponse.status}): ${errorData.message || fileResponse.statusText}. Path: ${csvPath}`);
}

let fileData;
try {
  fileData = await fileResponse.json();
} catch (e) {
  throw new Error(`Failed to parse GitHub API response: ${e.message}`);
}

if (!fileData) {
  throw new Error(`GitHub API returned undefined fileData. Response status: ${fileResponse.status}`);
}

if (!fileData.content) {
  throw new Error(`CSV file content is empty or undefined. FileData keys: ${Object.keys(fileData).join(', ')}`);
}

if (!fileData.sha) {
  throw new Error(`CSV file SHA is missing. FileData keys: ${Object.keys(fileData).join(', ')}`);
}
```

#### Step 4: File Update
```javascript
const updateFileResponse = await fetch(`${apiBase}/contents/${csvPath}`, {
  method: 'PUT',
  headers,
  body: JSON.stringify({
    message: `Add project: ${projectData.diseaseName}`,
    content: base64EncodeUTF8(updatedContent),
    sha: currentSha,
    branch: branchName,
  }),
});

if (!updateFileResponse.ok) {
  let errorData;
  try {
    errorData = await updateFileResponse.json();
  } catch (e) {
    errorData = { message: updateFileResponse.statusText };
  }
  throw new Error(`Failed to update CSV file (${updateFileResponse.status}): ${errorData.message || updateFileResponse.statusText}`);
}
```

#### Step 5: PR Creation
```javascript
const prResponse = await fetch(`${apiBase}/pulls`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    title: `新規案件追加: ${projectData.diseaseName}`,
    head: branchName,
    base: 'main',
    body: generatePRBody(projectData),
  }),
});

if (!prResponse.ok) {
  let errorData;
  try {
    errorData = await prResponse.json();
  } catch (e) {
    errorData = { message: prResponse.statusText };
  }
  throw new Error(`Failed to create PR (${prResponse.status}): ${errorData.message || prResponse.statusText}`);
}
```

### 2. Diagnostic Tools Created

#### GitHub API Test Script (workers/test-github-api.js)
A comprehensive diagnostic script that tests:
- GitHub authentication
- Repository access
- Main branch reference
- CSV file access
- API rate limits

Usage:
```bash
export GITHUB_TOKEN="your-token-here"
node workers/test-github-api.js
```

#### Deployment Guide (workers/DEPLOYMENT_GUIDE.md)
Complete guide for deploying the updated worker with:
- Step-by-step deployment instructions
- Troubleshooting steps
- Common error patterns and solutions
- Environment variable configuration

## How to Fix the Issue

### Step 1: Run Diagnostic Test

Before deploying, run the diagnostic script to identify the actual problem:

```bash
cd project-tracker/workers
export GITHUB_TOKEN="your-github-personal-access-token"
node test-github-api.js
```

This will show you exactly what's failing:
- ✅ Authentication working
- ✅ Repository accessible
- ✅ Main branch found
- ✅ CSV file accessible
- ❌ Problem identified with detailed error

### Step 2: Fix Underlying Issue

Based on diagnostic results:

**If authentication fails (401):**
- Create new GitHub Personal Access Token
- Ensure it has `repo` scope
- Update CLOUDFLARE_API_TOKEN secret

**If CSV file not found (404):**
- Verify file exists at: `project-tracker/seed_planning_data.csv`
- Check file path in worker configuration
- Ensure file is committed to main branch

**If permission denied (403):**
- Check token has sufficient permissions
- Verify token has access to the repository
- Check if organization requires SSO authorization

**If rate limited (403):**
- Wait for rate limit to reset
- Use authenticated requests (already implemented)
- Consider caching strategy

### Step 3: Deploy Updated Worker

Follow the deployment guide:

```bash
cd project-tracker/workers
export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
wrangler deploy --env=""
```

Or deploy through Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select "project-tracker-api"
3. Quick Edit → Copy/paste updated code
4. Save and Deploy

### Step 4: Update Secrets (if needed)

```bash
wrangler secret put GITHUB_TOKEN
wrangler secret put GITHUB_OWNER
wrangler secret put GITHUB_REPO
wrangler secret put CSV_PATH
```

### Step 5: Test Registration

1. Go to `register.html`
2. Fill in a test project
3. Submit the form
4. Check the detailed error message
5. Fix any remaining issues based on the specific error

## Expected Behavior After Fix

### Before (Cryptic Error)
```
❌ Cannot read properties of undefined (reading 'sha')
```

### After (Detailed Error Messages)
```
✅ Failed to fetch CSV file (404): Not Found. Path: project-tracker/seed_planning_data.csv
✅ Failed to fetch main branch ref (401): Bad credentials
✅ CSV file SHA is missing. FileData keys: name, path, content
✅ Failed to create branch (409): Reference already exists
✅ Failed to update CSV file (422): Invalid request
```

## Verification Checklist

- [x] Error handling added to all GitHub API calls
- [x] HTTP status codes included in error messages
- [x] JSON parsing errors handled gracefully
- [x] Response data validation at each step
- [x] File path included in error messages
- [x] Diagnostic script created
- [x] Deployment guide created
- [x] Code committed and pushed to GitHub

## Files Modified

1. **workers/add-project.js** - Added comprehensive error handling
2. **workers/test-github-api.js** - NEW - Diagnostic script
3. **workers/DEPLOYMENT_GUIDE.md** - NEW - Deployment instructions

## Commits

1. `f9287c9` - fix: add comprehensive error handling to PR creation worker
2. `bda1141` - docs: add deployment guide and GitHub API diagnostic tool

## Next Steps

1. Run diagnostic script to identify the actual issue
2. Fix the underlying problem (likely authentication or file path)
3. Deploy the updated worker to Cloudflare
4. Test the registration form
5. Verify detailed error messages are shown
6. Resolve any remaining issues based on specific error messages

## Additional Resources

- GitHub API Documentation: https://docs.github.com/en/rest
- Cloudflare Workers Documentation: https://developers.cloudflare.com/workers/
- Wrangler CLI Documentation: https://developers.cloudflare.com/workers/wrangler/
- GitHub Personal Access Tokens: https://github.com/settings/tokens

## Support

If issues persist after following these steps:
1. Share the new detailed error message
2. Share output from diagnostic script
3. Verify all environment variables are set correctly
4. Check Cloudflare Worker logs: `wrangler tail`
