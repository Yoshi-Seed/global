# Cloudflare Worker デプロイガイド

## 前提条件

Cloudflare Workers のデプロイには、**Cloudflare API Token** が必要です。

## ステップ 1: Cloudflare API Token の取得

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) にログイン
2. 右上のアカウントアイコン → **My Profile** をクリック
3. 左サイドバーから **API Tokens** を選択
4. **Create Token** ボタンをクリック
5. **Edit Cloudflare Workers** テンプレートを選択（または Create Custom Token）
6. 必要な権限を設定：
   - **Zone Resources**: Include → Specific zone → `y-honda.workers.dev` (または該当するドメイン)
   - **Account Resources**: Include → Specific account → あなたのアカウント
   - **Permissions**:
     - Account: Workers Scripts (Edit)
     - Account: Workers KV Storage (Edit) - オプション
7. **Continue to summary** → **Create Token** をクリック
8. 表示されたトークンをコピー（⚠️ 一度しか表示されません！）

## ステップ 2: 環境変数の設定

### オプション A: 一時的な設定（推奨）

```bash
export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token-here"
```

### オプション B: .env ファイルに保存

```bash
echo "CLOUDFLARE_API_TOKEN=your-cloudflare-api-token-here" > .env
```

⚠️ **注意**: `.env` ファイルは `.gitignore` に含まれていることを確認してください！

## ステップ 3: Worker のデプロイ

```bash
cd /home/user/webapp/project-tracker
npx wrangler deploy workers/add-project.js
```

または、wrangler.toml の場所を指定：

```bash
cd /home/user/webapp/project-tracker/workers
npx wrangler deploy
```

## ステップ 4: シークレットの設定

GitHub Token などのシークレットを設定する必要があります：

```bash
# GitHub Personal Access Token の設定
npx wrangler secret put GITHUB_TOKEN

# プロンプトが表示されたら、GitHub トークンを入力
```

GitHub Personal Access Token は以下の権限が必要です：
- `repo` (Full control of private repositories)

## ステップ 5: デプロイの確認

```bash
# デプロイされた Worker の URL を確認
npx wrangler deployments list

# Worker のログを確認（リアルタイム）
npx wrangler tail
```

## トラブルシューティング

### エラー: "Authentication error"

→ CLOUDFLARE_API_TOKEN が正しく設定されていません。ステップ1と2を再確認してください。

### エラー: "Account ID is required"

→ `wrangler.toml` に `account_id` が設定されているか確認してください。

```toml
account_id = "c6fb268cb2e7d61c7e441d425401e88e"
```

### エラー: "GitHub API failed"

→ GITHUB_TOKEN シークレットが設定されていません。ステップ4を実行してください。

## デプロイ後の確認事項

1. **Worker URL の確認**:
   ```
   https://project-tracker-api.y-honda.workers.dev
   ```

2. **エンドポイントのテスト**:
   ```bash
   # データ取得（GET）
   curl https://project-tracker-api.y-honda.workers.dev/data
   
   # PR作成（POST）- テストデータ
   curl -X POST https://project-tracker-api.y-honda.workers.dev \
     -H "Content-Type: application/json" \
     -d '{
       "diseaseName": "Test Disease",
       "diseaseAbbr": "TD",
       "method": "IDI",
       "surveyType": "定性",
       "targetType": "医師",
       "specialty": "内科",
       "recruitCount": 10,
       "targetConditions": "テスト条件",
       "drug": "テスト薬剤",
       "recruitCompany": "テスト会社",
       "client": "Test Client"
     }'
   ```

3. **フロントエンドの設定確認**:
   - `project-tracker/js/config.js` の `API_CONFIG.BASE_URL` が正しいか確認
   - 現在の設定: `https://project-tracker-api.y-honda.workers.dev`

## 参考リンク

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Personal Access Tokens](https://github.com/settings/tokens)
