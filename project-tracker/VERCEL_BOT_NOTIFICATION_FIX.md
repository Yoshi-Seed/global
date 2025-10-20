# Vercel Bot メール通知を停止する方法

## 問題
PRが作成されると、vercel[bot]から自動的にコメント通知メールが送信される問題。

## 解決方法

### オプション1: GitHub通知設定でVercel botをミュートする（推奨）

1. **GitHubの通知設定にアクセス**
   - GitHub.comにログイン
   - 右上のプロフィールアイコン → **Settings**
   - 左サイドバーの **Notifications**

2. **カスタムルーティングを設定**
   - **Custom routing** セクションまでスクロール
   - または直接アクセス: https://github.com/settings/notifications/custom_routing

3. **Vercel botをミュート**
   - 「Add rule」をクリック
   - 条件: **Actor** = `vercel[bot]`
   - アクション: **Ignore**
   - 保存

### オプション2: リポジトリのVercel連携設定を変更

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard

2. **プロジェクト設定**
   - 該当プロジェクト（global）を選択
   - **Settings** → **Git**

3. **GitHub連携の設定変更**
   - **Comments on Pull Requests** をオフにする
   - これにより、Vercel botがPRにコメントしなくなる

### オプション3: GitHub Actionsでコメントを自動削除（高度）

`.github/workflows/delete-vercel-comments.yml` を作成:

```yaml
name: Delete Vercel Bot Comments

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  delete-vercel-comments:
    runs-on: ubuntu-latest
    steps:
      - name: Delete Vercel bot comments
        uses: actions/github-script@v6
        with:
          script: |
            const comments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });
            
            for (const comment of comments.data) {
              if (comment.user.login === 'vercel[bot]') {
                await github.rest.issues.deleteComment({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  comment_id: comment.id,
                });
                console.log(`Deleted comment ${comment.id}`);
              }
            }
```

### オプション4: メールフィルター設定

**Gmail の場合:**
1. vercel[bot]からのメールを開く
2. 右上の3点メニュー → **メッセージの自動振り分け設定**
3. From: `notifications@github.com`
4. 件名に: `vercel[bot]` を含む
5. アクション: **ゴミ箱に移動** または **既読にする**

**Outlook の場合:**
1. vercel[bot]からのメールを右クリック
2. **ルール** → **ルールの作成**
3. From: `notifications@github.com` かつ 件名に `vercel[bot]`
4. アクション: **削除** または **既読にする**

## 推奨アプローチ

**最も簡単で効果的**: **オプション1（GitHub通知設定でミュート）**

理由:
- コードやリポジトリ設定を変更する必要がない
- 個人レベルでの制御が可能
- 他のチームメンバーには影響しない
- vercel[bot]からの通知のみをピンポイントで停止できる

## 注意事項

- オプション2を選択すると、Vercelのプレビューデプロイメント情報がPRに表示されなくなります
- オプション3は、コメント自体を削除するため、他のチームメンバーにも影響します
- オプション4は、メール通知のみをフィルターし、GitHub上の通知は残ります

## 確認方法

設定後、新しいPRを作成して、vercel[bot]からのメール通知が届かないことを確認してください。
