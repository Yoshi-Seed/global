# 🚨 緊急: Cloudflare Workerの再デプロイが必要です

## 問題

「その他」の対象者種別を選択した際に「対象者種別が不正です」というエラーが発生しています。

## 原因

Cloudflare Workerのバリデーションロジックが更新されていません。  
GitHubのコードは修正されていますが、Cloudflare Workerは自動的には更新されません。

## 解決方法

### オプション1: Cloudflare Dashboard から更新（推奨・簡単）

1. **Cloudflare Dashboardにアクセス**
   - URL: https://dash.cloudflare.com/

2. **Workers & Pagesに移動**
   - 左メニューから「Workers & Pages」を選択

3. **Workerを選択**
   - `project-tracker-api` をクリック

4. **コードを編集**
   - 「Edit Code」または「Quick Edit」ボタンをクリック

5. **GitHubから最新コードをコピー**
   - URL: https://raw.githubusercontent.com/Yoshi-Seed/global/main/project-tracker/workers/add-project.js
   - ブラウザで上記URLを開き、全文をコピー

6. **エディタに貼り付け**
   - Cloudflare Workerのエディタに全文を貼り付けて上書き

7. **デプロイ**
   - 「Save and Deploy」ボタンをクリック

8. **確認**
   - 数秒後、register.htmlから「その他」を選択してテスト

---

### オプション2: Wrangler CLI を使用

```bash
# 1. Cloudflare API Tokenを取得
# https://dash.cloudflare.com/profile/api-tokens

# 2. 環境変数を設定
export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"

# 3. workersディレクトリに移動
cd project-tracker/workers

# 4. デプロイ実行
wrangler deploy --env=""

# または staging環境の場合
wrangler deploy --env=staging
```

---

## 変更内容の詳細

### 修正前（lines 191-195）
```javascript
// 対象者種別の列挙チェック
const validTargetTypes = ['医師', '患者', '介護者', '医師・患者', 'KOL', '看護師', '薬剤師'];
if (data.targetType && !validTargetTypes.includes(data.targetType)) {
  errors.targetType = '対象者種別が不正です';
}
```

### 修正後（lines 191-193）
```javascript
// 対象者種別の列挙チェック（定義済みの選択肢以外も許可 - 「その他」入力用）
// 空でなければ任意の値を許可（「その他」で入力された詳細内容を含む）
// バリデーションは空文字チェックのみ
```

この変更により：
- ✅ 「医師」「患者」などの既存の選択肢 → OK
- ✅ 「検眼士」「栄養士」「理学療法士」などの「その他」入力 → OK
- ❌ 空文字 → エラー（必須項目）

---

## 確認方法

1. register.htmlにアクセス
2. 対象者種別で「その他」を選択
3. 詳細入力欄に「検眼士」などを入力
4. フォームを送信
5. ✅ **「対象者種別が不正です」エラーが表示されなくなる**

---

## 関連PR

- PR #234: https://github.com/Yoshi-Seed/global/pull/234 (✅ マージ済み)

---

## サポート

問題が解決しない場合は、以下を確認してください：

1. Cloudflare Worker が正しくデプロイされているか
2. キャッシュをクリアしてページを再読み込み（Ctrl + Shift + R）
3. Cloudflare Worker のログを確認（Dashboard → Workers → Logs）
