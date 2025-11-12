/* Question dataset for Med Research Quiz */
const QUESTIONS = [
  // -------- Quantitative (定量) --------
  {
    id: "q-quant-01",
    track: "quant",
    difficulty: 1,
    type: "mcq",
    tags: ["サンプリング","基礎"],
    prompt: "無作為抽出（ランダムサンプリング）の主目的として最も適切なのはどれ？",
    choices: [
      {label:"回答率を最大化する", value:"a"},
      {label:"母集団の代表性を確保し、推定の偏りを減らす", value:"b"},
      {label:"調査コストを最小化する", value:"c"},
      {label:"自由回答の質を高める", value:"d"}
    ],
    answer: "b",
    explanation: "ランダムサンプリングの狙いは、母集団に対する推定の偏り（selection bias）を抑え、推定の信頼性を担保することです。"
  },
  {
    id: "q-quant-02",
    track: "quant",
    difficulty: 2,
    type: "ms",
    tags: ["アンケート設計"],
    prompt: "設問設計で“二重質問（double-barreled）”になりやすいものをすべて選んでください。",
    choices: [
      {label:"「効果と安全性に満足していますか？」", value:"a"},
      {label:"「最近3か月で来院した回数をお知らせください」", value:"b"},
      {label:"「本剤の有効性についてどの程度同意しますか？」", value:"c"},
      {label:"「使用経験と今後の使用意向を教えてください」", value:"d"}
    ],
    answers: ["a","d"],
    explanation: "一つの設問に複数の観点が含まれると、回答の解釈が困難になります。「効果」と「安全性」や、「経験」と「意向」は分けて聞くのが原則です。"
  },
  {
    id: "q-quant-03",
    track: "quant",
    difficulty: 2,
    type: "estimate",
    unit: "%",
    tolerance: 10,
    step: 0.1,
    placeholder: "50",
    tags: ["サンプルサイズ","概念"],
    prompt: "信頼水準95%・許容誤差±5%・母比率50%の単純ランダム抽出で、必要サンプルサイズは概ね何％の誤差許容だと最大になりますか？（割合推定の最悪ケースの母比率を推測）",
    answer: 50,
    explanation: "割合推定の必要サンプルは、母比率が50%で最大になります（分散が最大）。そのため保守的にp=0.5で設計することが多いです。"
  },
  {
    id: "q-quant-04",
    track: "quant",
    difficulty: 3,
    type: "mcq",
    tags: ["重み付け","集計設計"],
    prompt: "標本が若年医師に偏ったため、年齢層別の母集団分布で補正する場合に使うべき手法は？",
    choices: [
      {label:"ポストストラティフィケーション（事後層別）ウェイト", value:"a"},
      {label:"主成分分析", value:"b"},
      {label:"ブートストラップ", value:"c"},
      {label:"ノンパラメトリック検定", value:"d"}
    ],
    answer: "a",
    explanation: "集計後に母集団分布へ合わせる代表的手法が事後層別（raking等を含む）です。設計段階の層別割付が難しい場合に有効です。"
  },
  {
    id: "q-quant-05",
    track: "quant",
    difficulty: 3,
    type: "order",
    tags: ["ローンチ","プロジェクト"],
    prompt: "新薬ローンチの大まかな準備フェーズを、早い順に並べてください。",
    items: ["市場調査・戦略立案（-24〜-18か月）", "承認申請準備（-18〜-12か月）", "申請提出・審査対応／資材・MC計画（-12〜-3か月）", "販売開始と初期フィードバック（0か月〜）"],
    explanation: "一般的な流れは、市場調査→申請準備→申請・審査対応と資材計画→販売開始・FB収集の順です。詳細は製品特性や組織により調整されます。",
    reading: [{label:"Medinew｜上市準備ガイド", url:"https://www.medinew.jp/articles/marketing/marketing-strategy/launch-guide"}]
  },
  {
    id: "q-quant-06",
    track: "quant",
    difficulty: 4,
    type: "mcq",
    tags: ["KPI","eディテーリング"],
    prompt: "eディテーリング施策の効果を“現場行動”に最短で結びつけて捉える指標として最も近いものはどれ？",
    choices: [
      {label:"ページ平均滞在時間", value:"a"},
      {label:"資材閲覧後の医師の行動（例：処方の相談・症例検索・講演会申込）へのコンバージョン", value:"b"},
      {label:"サイトUU数", value:"c"},
      {label:"メール開封率", value:"d"}
    ],
    answer: "b",
    explanation: "露出指標（UU、開封、滞在）だけでなく、医師の具体的行動変容に結びつくKPIを設計すると意思決定がしやすくなります。",
    reading: [{label:"Medinew｜医師の情報収集とeDTL活用", url:"https://www.medinew.jp/articles/marketing/trend/drsurvey-edtl"}]
  },
  {
    id: "q-quant-07",
    track: "quant",
    difficulty: 4,
    type: "ms",
    tags: ["KOL","スコアリング"],
    prompt: "KOL選定のスコアリング指標例として適切なものをすべて選択してください。",
    choices: [
      {label:"学会での座長経験数", value:"a"},
      {label:"論文の第一著者／責任著者登場回数", value:"b"},
      {label:"SNSのフォロワー数のみ", value:"c"},
      {label:"企業セミナーの登壇実績", value:"d"}
    ],
    answers: ["a","b","d"],
    explanation: "KOL選定では客観データに基づく重み付けが重要です。学会役割や論文実績、講演歴などが典型的な指標になります。SNS単独は領域・目的依存で補助的に扱います。",
    reading: [{label:"Medinew｜KOLの判断基準", url:"https://www.medinew.jp/articles/marketing/data-marketing/key-opinion-leader"}]
  },
  {
    id: "q-quant-08",
    track: "quant",
    difficulty: 5,
    type: "estimate",
    unit: "名",
    tolerance: 8,
    step: 1,
    tags: ["KOL","運用"],
    prompt: "一般論として、1製品でマーケチームが継続フォローするKOLの人数レンジ（多く見られる例）は何名規模？（数値で入力）",
    answer: 30,
    explanation: "領域・薬剤で変動しますが、20〜30名、多くて40名程度をカバーするケースが一般的との見立てが紹介されています。",
    reading: [{label:"Medinew｜KOL選定の考え方", url:"https://www.medinew.jp/articles/marketing/data-marketing/key-opinion-leader"}]
  },
  {
    id: "q-quant-09",
    track: "quant",
    difficulty: 3,
    type: "mcq",
    tags: ["バイアス","品質管理"],
    prompt: "スクリーニングで“直近に同様テーマの調査参加経験がある回答者”を除外する主目的は？",
    choices: [
      {label:"社会的望ましさバイアスを完全に消すため", value:"a"},
      {label:"学習・馴化（conditioning）による回答の歪みを抑えるため", value:"b"},
      {label:"回答時間を短縮するため", value:"c"},
      {label:"謝礼コストを下げるため", value:"d"}
    ],
    answer: "b",
    explanation: "近接参加は回答の学習による歪み（conditioning）やプロ化を招く可能性があり、品質観点から除外基準を設けます。"
  },
  {
    id: "q-quant-10",
    track: "quant",
    difficulty: 4,
    type: "match",
    tags: ["フレームワーク"],
    prompt: "製薬マーケのフレームワークと説明を対応づけてください。",
    pairs: [
      {left:"STP", right:"セグメンテーション→ターゲティング→ポジショニング", rightKey:"STP"},
      {left:"AIDMA/AISAS", right:"認知から購買/行動までの行動モデル", rightKey:"AIDMA/AISAS"},
      {left:"Patient Journey", right:"患者の経験軸で診断・治療までのタッチポイントを可視化", rightKey:"Patient Journey"},
      {left:"4P/4C", right:"製品・価格・流通・プロモーション/顧客視点の対応", rightKey:"4P/4C"}
    ],
    explanation: "戦略〜実行までの接続にフレームワークの共通言語が役立ちます。",
    reading: [{label:"Medinew｜フレームワーク完全ガイド", url:"https://www.medinew.jp/articles/marketing/marketing-strategy/framework-guide"}]
  },
  {
    id: "q-quant-11",
    track: "quant",
    difficulty: 2,
    type: "mcq",
    tags: ["指標","質問票"],
    prompt: "5件法（強く同意〜強く不同意）の同意度尺度で、平均値の比較前提として望ましい仮定はどれ？",
    choices: [
      {label:"カテゴリ間隔が等間隔に近い", value:"a"},
      {label:"回答が正規分布に厳密に一致", value:"b"},
      {label:"中央値のみを使う", value:"c"},
      {label:"標本サイズを問わない", value:"d"}
    ],
    answer: "a",
    explanation: "順序尺度を間隔尺度近似として扱うケースが多く、等間隔性の仮定やサンプルサイズ確保によるロバスト性を意識します。"
  },
  {
    id: "q-quant-12",
    track: "quant",
    difficulty: 5,
    type: "order",
    tags: ["因果推論","設計思考"],
    prompt: "観察データで因果推論の信頼性を高めるための一般的な設計の流れを並べ替えてください。",
    items: ["交絡の仮説出し（DAG等）", "測定可能な交絡の統制（層別/回帰/マッチング）", "感度分析（未測定交絡の影響評価）", "異質性の検討と外的妥当性の吟味"],
    explanation: "設計段階の仮説→統制→感度分析→妥当性の検討と、段階的に検証を積み上げる姿勢が重要です。"
  },

  // -------- Qualitative (定性) --------
  {
    id: "q-qual-01",
    track: "qual",
    difficulty: 1,
    type: "mcq",
    tags: ["モデレーション","基礎"],
    prompt: "半構造化インタビューの利点として最も適切なのはどれ？",
    choices: [
      {label:"全員同一の質問で量的比較が容易", value:"a"},
      {label:"重要な深掘りに柔軟に寄り道できる", value:"b"},
      {label:"統計的推定に直接使える", value:"c"},
      {label:"質問しなくても回答が集まる", value:"d"}
    ],
    answer: "b",
    explanation: "半構造化はガイドに沿いつつも、参加者の語りに合わせて深掘りが可能。洞察獲得に向いたバランス型です。"
  },
  {
    id: "q-qual-02",
    track: "qual",
    difficulty: 2,
    type: "ms",
    tags: ["バイアス","面接"],
    prompt: "医師インタビューでモデレーターが避けたい誘導（leading）表現をすべて選んでください。",
    choices: [
      {label:"「多くの先生は本剤を有効だと評価していますが、先生はどうですか？」", value:"a"},
      {label:"「診療で印象に残った症例があれば教えてください」", value:"b"},
      {label:"「なぜ／どのように その判断に至ったのか、経緯をうかがえますか？」", value:"c"},
      {label:"「副作用は“ほとんどない”ですよね？」", value:"d"}
    ],
    answers: ["a","d"],
    explanation: "多数派を示唆したり、望ましい回答を前提化する表現は誘導のリスク。事実→解釈→背景の順に中立的に問いかけます。"
  },
  {
    id: "q-qual-03",
    track: "qual",
    difficulty: 3,
    type: "order",
    tags: ["ペルソナ","設計"],
    prompt: "患者ペルソナの基本作成プロセスを合理的な順で並べてください。",
    items: ["既存データと仮説の棚卸し", "探索インタビューで行動・文脈を把握", "コアニーズと阻害要因の構造化", "施策設計に必要な属性・文脈へ落とし込み"],
    explanation: "既存知→探索→構造化→施策に落とし込むのが基本線です。",
    reading: [{label:"Medinew｜ペルソナ設計 入門", url:"https://www.medinew.jp/articles/marketing/marketing-strategy/persona-basics"}]
  },
  {
    id: "q-qual-04",
    track: "qual",
    difficulty: 3,
    type: "mcq",
    tags: ["患者ジャーニー","評価"],
    prompt: "患者ジャーニーの“質”を高めるためのアクションとして最も適切なのはどれ？",
    choices: [
      {label:"作成後は固定し、毎年の見直しは行わない", value:"a"},
      {label:"患者・医療者からのフィードバックを取り入れ、環境変化を反映する", value:"b"},
      {label:"製品特性のみを主語にして構成する", value:"c"},
      {label:"ステップは少ないほどよいので最大3つに制限する", value:"d"}
    ],
    answer: "b",
    explanation: "患者・医療者の実態と文脈を反映し、継続的に更新することが精度を高めます。",
    reading: [{label:"Medinew｜ペイシェントジャーニー", url:"https://www.medinew.jp/articles/marketing/marketing-strategy/column-patientjourney-introduction-3"}]
  },
  {
    id: "q-qual-05",
    track: "qual",
    difficulty: 4,
    type: "match",
    tags: ["eディテーリング","インサイト"],
    prompt: "医師の情報収集の変化に合わせたeディテーリング活用の考え方を対応づけてください。",
    pairs: [
      {left:"チャネル最適化", right:"専門・年代で好みが異なる前提でタッチポイントを設計", rightKey:"チャネル最適化"},
      {left:"価値提供の定義", right:"単なる情報提示ではなく臨床意思決定の支援に結ぶ", rightKey:"価値提供の定義"},
      {left:"KPIの階層化", right:"露出→関与→行動の順にモニタリング", rightKey:"KPIの階層化"},
      {left:"現場連携", right:"MR/メディカルとデジタルの相乗効果を設計", rightKey:"現場連携"}
    ],
    explanation: "露出指標だけでなく“行動”を測るKPIと、専門性・年代差を踏まえたチャネル設計、現場との連携が鍵です。",
    reading: [{label:"Medinew｜医師の情報収集とeDTL活用", url:"https://www.medinew.jp/articles/marketing/trend/drsurvey-edtl"}]
  },
  {
    id: "q-qual-06",
    track: "qual",
    difficulty: 4,
    type: "ms",
    tags: ["KOL","探索調査"],
    prompt: "KOLスコアリング後にインタビューを行う目的として適切なものをすべて選んでください。",
    choices: [
      {label:"診療方針や影響関係など“定量化しづらい要素”を把握する", value:"a"},
      {label:"ランキング上位だけを正解として固定するため", value:"b"},
      {label:"関係性構造やネットワークの質的情報を補う", value:"c"},
      {label:"メッセージや資材の反応仮説を検証する", value:"d"}
    ],
    answers: ["a","c","d"],
    explanation: "スコアは出発点。思考の流儀や影響関係、メッセージ反応など定性で深掘りして解像度を上げます。",
    reading: [{label:"Medinew｜KOLの選定フロー", url:"https://www.medinew.jp/articles/marketing/data-marketing/key-opinion-leader"}]
  },
  {
    id: "q-qual-07",
    track: "qual",
    difficulty: 2,
    type: "mcq",
    tags: ["ガイド作成"],
    prompt: "定性調査のディスカッションガイドで“質問順”を設計する際の基本原則に最も近いものはどれ？",
    choices: [
      {label:"敏感質問→一般質問→行動質問の順", value:"a"},
      {label:"一般質問→行動・経験→態度・理由→敏感質問の順", value:"b"},
      {label:"ランダム順で毎回変更する", value:"c"},
      {label:"製品訴求から先に見せる", value:"d"}
    ],
    answer: "b",
    explanation: "ウォームアップ→事実→解釈→センシティブの順が基本。安心感と再現性を担保します。"
  },
  {
    id: "q-qual-08",
    track: "qual",
    difficulty: 5,
    type: "estimate",
    unit: "名",
    tolerance: 10,
    step: 1,
    tags: ["リクルート","品質"],
    prompt: "バーチャルFGI（1グループ6名想定）を3グループ運営する場合、リクルート歩留まりを考慮した仮押さえ人数（募集枠）として現実的なラインは？（合計人数を数値で）",
    answer: 30,
    explanation: "欠席・ドタキャン・接続不良に備え、必要人数（18名）に対し1.5〜2倍程度の募集枠を確保するのが実務上のセーフティラインです。（領域・条件に依存）"
  },
  {
    id: "q-qual-09",
    track: "qual",
    difficulty: 3,
    type: "ms",
    tags: ["倫理","現場運用"],
    prompt: "医療系の定性調査で同意取得・守秘の観点から配慮が必要な項目をすべて選んでください。",
    choices: [
      {label:"録音・録画の目的と保存期間の明示", value:"a"},
      {label:"匿名化の方法（氏名・所属の取り扱い）", value:"b"},
      {label:"謝礼の税務処理方法の提示", value:"c"},
      {label:"調査協力可否による診療への不利益がない旨の明示", value:"d"}
    ],
    answers: ["a","b","d"],
    explanation: "記録・匿名化・不利益の回避は基本。謝礼の税務は企業側の運用でカバーされることが多いですが、事前周知は望ましいです。"
  },
  {
    id: "q-qual-10",
    track: "qual",
    difficulty: 4,
    type: "order",
    tags: ["学会観察","フィールドワーク"],
    prompt: "学会現地での“観察調査”を設計する際の流れとして適切な順に並べてください。",
    items: ["目的・仮説の明確化", "観察項目と記録フォーマットの定義", "観察の単位（場所・時間帯・動線）の設計", "パイロット観察と修正"],
    explanation: "目的→観察軸→現場の単位設計→パイロットでの調整、と段階的に設計します。"
  },
  {
    id: "q-qual-11",
    track: "qual",
    difficulty: 2,
    type: "mcq",
    tags: ["問いの技術"],
    prompt: "患者インタビューで“解釈先行”を避け、経験を具体化するための問いとして最も適切なのはどれ？",
    choices: [
      {label:"「つまり不安が強かったということですよね？」", value:"a"},
      {label:"「診断当日の流れを、できる範囲で順番に教えてください」", value:"b"},
      {label:"「この薬はとても良いと思いますが、どうですか？」", value:"c"},
      {label:"「先生からの説明で印象的だった言葉は？」", value:"d"}
    ],
    answer: "b",
    explanation: "時系列の具体化（エピソード再生）は、事実→感情→意味づけの順に自然な深掘りを促します。"
  },
  {
    id: "q-qual-12",
    track: "qual",
    difficulty: 5,
    type: "match",
    tags: ["合意形成","メッセージング"],
    prompt: "上市前のメッセージ検証を定性で行う際の“問い方”と“得られる示唆”を対応づけてください。",
    pairs: [
      {left:"競合比較の認知地図", right:"想起される比較軸とポジショニングの空白が見える", rightKey:"競合比較の認知地図"},
      {left:"カバーストーリー法（症例文脈）", right:"臨床意思決定の岐路と刺さる言い回しが見える", rightKey:"カバーストーリー法（症例文脈）"},
      {left:"資材シークエンスのA/B差し替え", right:"理解・納得の躓きポイントが段差として可視化", rightKey:"資材シークエンスのA/B差し替え"},
      {left:"反事実の問い（もし〇〇でなかったら？）", right:"必要条件／十分条件の切り分けが進む", rightKey:"反事実の問い（もし〇〇でなかったら？）"}
    ],
    explanation: "“どのように聞くか”で得られる構造が変わります。意思決定の文脈に寄せた問いが有効です。"
  }
];
