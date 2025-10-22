#!/bin/bash

# Cloudflare Worker デプロイスクリプト

echo "🚀 Cloudflare Worker Deployment Script"
echo "========================================"
echo ""

# CLOUDFLARE_API_TOKEN のチェック
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ Error: CLOUDFLARE_API_TOKEN is not set"
  echo ""
  echo "Please set the environment variable first:"
  echo "  export CLOUDFLARE_API_TOKEN=\"your-token-here\""
  echo ""
  echo "Or run this script with the token:"
  echo "  CLOUDFLARE_API_TOKEN=\"your-token\" ./deploy-worker.sh"
  echo ""
  echo "To get your token, visit:"
  echo "  https://dash.cloudflare.com/profile/api-tokens"
  echo ""
  echo "📖 See CLOUDFLARE_DEPLOY_GUIDE.md for detailed instructions"
  exit 1
fi

echo "✅ CLOUDFLARE_API_TOKEN is set"
echo ""

# プロジェクトディレクトリに移動
cd /home/user/webapp/project-tracker/workers

echo "📁 Working directory: $(pwd)"
echo ""

# wrangler のバージョン確認
echo "🔧 Wrangler version:"
npx wrangler --version
echo ""

# デプロイ実行
echo "🚢 Deploying Worker..."
echo ""

npx wrangler deploy

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Deployment successful!"
  echo ""
  echo "🔗 Worker URL: https://project-tracker-api.y-honda.workers.dev"
  echo ""
  echo "📝 Next steps:"
  echo "  1. Set GitHub Token secret:"
  echo "     npx wrangler secret put GITHUB_TOKEN"
  echo ""
  echo "  2. Test the endpoints:"
  echo "     curl https://project-tracker-api.y-honda.workers.dev/data"
  echo ""
  echo "  3. Check the logs:"
  echo "     npx wrangler tail"
else
  echo ""
  echo "❌ Deployment failed"
  echo ""
  echo "Please check the error message above."
  echo "Common issues:"
  echo "  - Invalid API token"
  echo "  - Missing account_id in wrangler.toml"
  echo "  - Network connection issues"
  echo ""
  echo "📖 See CLOUDFLARE_DEPLOY_GUIDE.md for troubleshooting"
  exit 1
fi
