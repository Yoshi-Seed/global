# Cloudflare Worker Deployment Guide

## Overview
This guide explains how to deploy the updated `add-project.js` worker to Cloudflare to fix the PR creation error.

## What Was Fixed
Added comprehensive error handling to the worker to provide detailed error messages when GitHub API calls fail. This will help identify the exact cause of the "Cannot read properties of undefined (reading 'sha')" error.

## Prerequisites
1. Cloudflare account with Workers enabled
2. GitHub Personal Access Token with `repo` scope
3. Wrangler CLI installed (already available)

## Deployment Steps

### Option 1: Using Wrangler CLI (Recommended)

1. **Set Cloudflare API Token**
   ```bash
   export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
   ```
   
   Get your API token from: https://dash.cloudflare.com/profile/api-tokens

2. **Navigate to workers directory**
   ```bash
   cd project-tracker/workers
   ```

3. **Deploy to production**
   ```bash
   wrangler deploy --env=""
   ```
   
   Or to staging:
   ```bash
   wrangler deploy --env=staging
   ```

4. **Set GitHub secrets (if not already set)**
   ```bash
   wrangler secret put GITHUB_TOKEN
   # Enter your GitHub token when prompted
   
   wrangler secret put GITHUB_OWNER
   # Enter: Yoshi-Seed
   
   wrangler secret put GITHUB_REPO
   # Enter: global
   
   wrangler secret put CSV_PATH
   # Enter: project-tracker/seed_planning_data.csv
   ```

### Option 2: Using Cloudflare Dashboard

1. Go to https://dash.cloudflare.com/
2. Navigate to Workers & Pages
3. Find "project-tracker-api" worker
4. Click "Quick Edit"
5. Copy the entire contents of `add-project.js`
6. Paste into the editor
7. Click "Save and Deploy"

## Verifying the Deployment

After deployment, test the worker by submitting a new project through the registration form at:
- `register.html`

The improved error messages will now show:
- HTTP status codes
- Detailed error messages from GitHub API
- File paths being accessed
- Response data structure information

## Troubleshooting

### If you still get errors after deployment:

1. **Check GitHub Token Permissions**
   - Token must have `repo` scope
   - Token must have access to the repository
   - Check at: https://github.com/settings/tokens

2. **Verify CSV File Path**
   - Ensure file exists at: `project-tracker/seed_planning_data.csv`
   - Check on GitHub: https://github.com/Yoshi-Seed/global/blob/main/project-tracker/seed_planning_data.csv

3. **Check Worker Logs**
   ```bash
   wrangler tail
   ```
   
   Or view in dashboard: Workers & Pages → project-tracker-api → Logs

4. **Test GitHub API Directly**
   ```bash
   curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
        https://api.github.com/repos/Yoshi-Seed/global/contents/project-tracker/seed_planning_data.csv
   ```

## Expected Behavior After Fix

With the improved error handling, you'll now get detailed error messages like:

- ✅ "Failed to fetch CSV file (404): Not Found. Path: project-tracker/seed_planning_data.csv"
- ✅ "Failed to fetch main branch ref (401): Bad credentials"
- ✅ "CSV file SHA is missing. FileData keys: name, path, content"

Instead of the generic:
- ❌ "Cannot read properties of undefined (reading 'sha')"

## Next Steps After Deployment

1. Test the registration form
2. Check the detailed error message
3. Fix the underlying issue based on the error message
4. Common issues and solutions:
   - **404 Error**: CSV file path is wrong or file doesn't exist
   - **401 Error**: GitHub token is invalid or expired
   - **403 Error**: Token doesn't have sufficient permissions
   - **409 Error**: Branch already exists (usually harmless, retry)

## Environment Variables Required

Make sure these are set in Cloudflare Worker:
- `GITHUB_TOKEN`: Your GitHub Personal Access Token
- `GITHUB_OWNER`: Yoshi-Seed
- `GITHUB_REPO`: global
- `CSV_PATH`: project-tracker/seed_planning_data.csv

## Support

If you continue to experience issues after deployment:
1. Share the new detailed error message
2. Verify GitHub token has correct permissions
3. Confirm CSV file exists at the specified path
4. Check Cloudflare Worker logs for additional details
