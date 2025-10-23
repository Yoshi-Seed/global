/**
 * GitHub API Diagnostic Script
 * Run this to test if GitHub API access is working correctly
 * Usage: node test-github-api.js
 */

// Configuration - Replace with your actual values
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'your-token-here';
const GITHUB_OWNER = 'Yoshi-Seed';
const GITHUB_REPO = 'global';
const CSV_PATH = 'project-tracker/seed_planning_data.csv';

const apiBase = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
const headers = {
  'Authorization': `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'Project-Tracker-Test',
};

async function testGitHubAPI() {
  console.log('🔍 Testing GitHub API Access...\n');
  
  // Test 1: Check authentication
  console.log('Test 1: Checking GitHub authentication...');
  try {
    const userResponse = await fetch('https://api.github.com/user', { headers });
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ Authentication successful');
      console.log(`   User: ${userData.login}`);
      console.log(`   Scopes: ${userResponse.headers.get('x-oauth-scopes') || 'N/A'}\n`);
    } else {
      console.log(`❌ Authentication failed: ${userResponse.status} ${userResponse.statusText}\n`);
      return;
    }
  } catch (error) {
    console.log(`❌ Error checking authentication: ${error.message}\n`);
    return;
  }

  // Test 2: Check repository access
  console.log('Test 2: Checking repository access...');
  try {
    const repoResponse = await fetch(apiBase, { headers });
    if (repoResponse.ok) {
      const repoData = await repoResponse.json();
      console.log('✅ Repository access successful');
      console.log(`   Repo: ${repoData.full_name}`);
      console.log(`   Private: ${repoData.private}`);
      console.log(`   Default branch: ${repoData.default_branch}\n`);
    } else {
      console.log(`❌ Repository access failed: ${repoResponse.status} ${repoResponse.statusText}\n`);
      return;
    }
  } catch (error) {
    console.log(`❌ Error accessing repository: ${error.message}\n`);
    return;
  }

  // Test 3: Check main branch
  console.log('Test 3: Checking main branch reference...');
  try {
    const refResponse = await fetch(`${apiBase}/git/refs/heads/main`, { headers });
    if (refResponse.ok) {
      const refData = await refResponse.json();
      console.log('✅ Main branch reference found');
      console.log(`   SHA: ${refData.object.sha}\n`);
    } else {
      const errorData = await refResponse.json();
      console.log(`❌ Failed to get main branch: ${refResponse.status} ${refResponse.statusText}`);
      console.log(`   Message: ${errorData.message}\n`);
      return;
    }
  } catch (error) {
    console.log(`❌ Error checking main branch: ${error.message}\n`);
    return;
  }

  // Test 4: Check CSV file
  console.log('Test 4: Checking CSV file...');
  try {
    const fileResponse = await fetch(`${apiBase}/contents/${CSV_PATH}?ref=main`, { headers });
    if (fileResponse.ok) {
      const fileData = await fileResponse.json();
      console.log('✅ CSV file found');
      console.log(`   Path: ${fileData.path}`);
      console.log(`   Size: ${fileData.size} bytes`);
      console.log(`   SHA: ${fileData.sha}`);
      
      if (fileData.content) {
        console.log('   Content: Available (base64 encoded)');
        
        // Decode first few lines
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const lines = content.split('\n');
        console.log(`   Lines: ${lines.length}`);
        console.log(`   Header: ${lines[0].substring(0, 80)}...`);
        
        // Check for 問合せのみ column
        if (lines[0].includes('問合せのみ')) {
          console.log('   ✅ 問合せのみ column found in header');
        } else {
          console.log('   ⚠️  問合せのみ column NOT found in header');
        }
      } else {
        console.log('   ⚠️  Content is empty or missing');
      }
      console.log('');
    } else {
      const errorData = await fileResponse.json();
      console.log(`❌ Failed to fetch CSV file: ${fileResponse.status} ${fileResponse.statusText}`);
      console.log(`   Message: ${errorData.message}`);
      console.log(`   Path: ${CSV_PATH}\n`);
      return;
    }
  } catch (error) {
    console.log(`❌ Error checking CSV file: ${error.message}\n`);
    return;
  }

  // Test 5: Check rate limit
  console.log('Test 5: Checking API rate limit...');
  try {
    const rateLimitResponse = await fetch('https://api.github.com/rate_limit', { headers });
    if (rateLimitResponse.ok) {
      const rateLimitData = await rateLimitResponse.json();
      const core = rateLimitData.resources.core;
      console.log('✅ Rate limit info:');
      console.log(`   Remaining: ${core.remaining}/${core.limit}`);
      console.log(`   Resets at: ${new Date(core.reset * 1000).toLocaleString()}\n`);
    }
  } catch (error) {
    console.log(`⚠️  Could not check rate limit: ${error.message}\n`);
  }

  console.log('🎉 All tests passed! GitHub API access is working correctly.');
  console.log('\nYou can now deploy the Cloudflare Worker with confidence.');
}

// Run tests
console.log('═══════════════════════════════════════════════════════');
console.log('  GitHub API Diagnostic Tool');
console.log('═══════════════════════════════════════════════════════\n');

if (GITHUB_TOKEN === 'your-token-here') {
  console.log('❌ Error: GITHUB_TOKEN not set');
  console.log('\nPlease set your GitHub token:');
  console.log('  export GITHUB_TOKEN="your-token-here"');
  console.log('  node test-github-api.js');
  process.exit(1);
}

testGitHubAPI().catch(error => {
  console.error('\n💥 Unexpected error:', error);
  process.exit(1);
});
