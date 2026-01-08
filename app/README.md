# Patient Feasibility Quick Check (Japan)

スマホで「疾患名 → 推定患者数 → リクルート難易度メッセージ」を即参照できる、超シンプルな静的Webアプリです（GitHub Pages / 任意のサーバーでそのまま動きます）。

## できること
- 入力ボックスで疾患名を入力 → 候補が即表示（日本語/英語/ICD10で検索）
- 疾患を選ぶと詳細画面：
  - 日本の推定患者数（総数）
  - 係数（必要に応じて調整）を反映した「推定リクルート可能数」
  - 推定リクルート可能数のレンジに応じたメッセージ（日本語＋英語）
  - センシティブ領域（HIV / STI等）の注意喚起（日本語＋英語）
  - English文面をワンタップでコピー（PMRCでそのまま伝えられる想定）

## ファイル構成
- `index.html` … 画面
- `assets/styles.css` … デザイン（キャンバス系の淡色 + 濃い茶文字、スマホ前提）
- `assets/app.js` … ロジック（検索、表示、メッセージ、コピー等）
- `data/diseases.json` … 疾患データ（Excelから変換）
- `data/messages.json` … 患者数レンジ別メッセージ（ここを編集すれば文面が変わる）
- `data/social_notes.json` … センシティブ疾患の注意メモ（ICD10コードで指定）
- `scripts/convert_xlsx_to_json.py` … Excel→JSON変換スクリプト

## ローカルで動かす（推奨）
ブラウザで `file://` 直開きだと `fetch()` が動かないことがあるので、簡易サーバーで開いてください。

### 例：Python
```bash
cd patient_feasibility_app
python -m http.server 8000
```
ブラウザで `http://localhost:8000` を開きます。

## GitHub Pagesで公開
1. このフォルダ一式をリポジトリ直下に置く（または `/docs` 配下など）
2. GitHub の Settings → Pages で公開先を指定
3. 公開URLにアクセス

## データ更新（Excel → JSON）
`Japan_All_Patient_Population.xlsx` を更新したら、以下で `data/diseases.json` を再生成します。

```bash
python scripts/convert_xlsx_to_json.py --xlsx Japan_All_Patient_Population.xlsx --out data/diseases.json
```

## 文言の調整
- 患者数レンジ別のメッセージ：`data/messages.json`
- センシティブ注意：`data/social_notes.json`

---

※ 本プロトタイプは「まず動くもの」を最短で作った構成です。React等に載せ替えもできますが、PMRCの“即参照”用途なら静的構成が一番軽くて事故りません。
