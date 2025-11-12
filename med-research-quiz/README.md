# Med Research Quiz — by ウェインツ君

医療マーケットリサーチに携わる方向けの、**定量/定性の両輪**を鍛える学習クイズです。ブラウザだけで動く、純粋な HTML/CSS/JS アプリ。

## こんなことができます
- スタート時に **定量 / 定性** を選択（途中切替もOK）
- 正答・難易度・連続正解・回答スピードに応じて **スコア加点**（難しいほど高配点）
- 問題タイプ：単一選択、複数選択、**推定（レンジ採点）**、**並べ替え（D&D）**、**マッチング**、ケーススタディ風
- 各問のあとに **学び（Takeaway）** と **参考リンク**（主に Medinew）
- 終了後は **復習カード** と **結果JSON** ダウンロード
- **ダークモード**、キーボードショートカット（1-9, Enter, H）

## ファイル構成
- `index.html` — 画面の骨組み
- `styles.css` — UI スタイル（軽いグラス感、アニメーションあり）
- `questions.js` — 問題データ（JSON風）
- `app.js` — ロジック（アダプティブ難易度、採点、レビュー、エフェクト）
- `README.md` — このファイル

## 使い方
1. すべてのファイルを同じフォルダに置き、`index.html` をブラウザで開くだけ。
2. GitHub Pages に配置すれば、チームでも共有できます。

## カスタマイズ（重要）
- `questions.js` に問題を追加できます。スキーマは次の通りです：

```js
{
  id: "unique-id",
  track: "quant" | "qual",
  difficulty: 1..5,
  type: "mcq" | "ms" | "estimate" | "order" | "match",
  tags: ["任意","タグ"],
  prompt: "質問文",
  choices: [{label:"選択肢", value:"a"}],          // mcq/ms
  answer: "a",                                     // mcq/estimate（数値）
  answers: ["a","b"],                              // ms
  unit: "%", tolerance: 10, step: 0.1,             // estimate
  items: ["順序1","順序2",...],                    // order（正解=提示順）
  pairs: [{left:"A", right:"B", rightKey:"A"}],    // match（rightKey=対応キー）
  hint: "任意のヒント",
  explanation: "解説・学び",
  reading: [{label:"参考記事", url:"https://..."}]
}
```

- 並べ替え問題は `items` の提示順が正解になります。
- マッチング問題は `pairs` の `rightKey` を各 left と一致させてください（例：`rightKey: "STP"`）。

## 参考
- 問題の一部は **Medinew（メディニュー）** の記事を参考に作成しています。各問題の「参考」をご覧ください。
- クイズは教育用の一般的な内容で、**各社規程・法令**の確認を優先してください。

作った人（気持ち）：Yoshi の心の相棒 **ウェインツ君**。今日も肩の力を抜いて、でもプロとしてかっこよく。