#!/bin/bash
# Cloudflare Worker シークレット設定スクリプト

echo "=========================================="
echo "Cloudflare Worker シークレット設定"
echo "=========================================="
echo ""

# Cloudflare API Token 確認
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ CLOUDFLARE_API_TOKEN が設定されていません"
  echo ""
  echo "以下のコマンドで設定してください："
  echo "export CLOUDFLARE_API_TOKEN=\"your-cloudflare-token\""
  echo ""
  exit 1
fi

echo "✅ CLOUDFLARE_API_TOKEN: 設定済み"
echo ""

# GitHub Token の入力を促す
echo "GitHub Personal Access Token を入力してください："
echo "(https://github.com/settings/tokens で作成)"
echo ""
read -sp "GITHUB_TOKEN: " GITHUB_TOKEN
echo ""
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ GITHUB_TOKEN が入力されませんでした"
  exit 1
fi

echo "シークレットを設定中..."
echo ""

# GitHub Token を設定
echo "$GITHUB_TOKEN" | wrangler secret put GITHUB_TOKEN
if [ $? -eq 0 ]; then
  echo "✅ GITHUB_TOKEN: 設定完了"
else
  echo "❌ GITHUB_TOKEN: 設定失敗"
  exit 1
fi

# GitHub Owner を設定
echo "Yoshi-Seed" | wrangler secret put GITHUB_OWNER
if [ $? -eq 0 ]; then
  echo "✅ GITHUB_OWNER: 設定完了"
else
  echo "❌ GITHUB_OWNER: 設定失敗"
  exit 1
fi

# GitHub Repo を設定
echo "global" | wrangler secret put GITHUB_REPO
if [ $? -eq 0 ]; then
  echo "✅ GITHUB_REPO: 設定完了"
else
  echo "❌ GITHUB_REPO: 設定失敗"
  exit 1
fi

# CSV Path を設定
echo "project-tracker/seed_planning_data.csv" | wrangler secret put CSV_PATH
if [ $? -eq 0 ]; then
  echo "✅ CSV_PATH: 設定完了"
else
  echo "❌ CSV_PATH: 設定失敗"
  exit 1
fi

echo ""
echo "=========================================="
echo "✅ すべてのシークレットが設定されました！"
echo "=========================================="
echo ""

# シークレット一覧を表示
echo "設定されたシークレット一覧:"
wrangler secret list

echo ""
echo "次のステップ:"
echo "1. register.html で新規プロジェクトを登録"
echo "2. PRが正常に作成されることを確認"
echo ""
