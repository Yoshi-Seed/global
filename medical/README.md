# EPHMRA Ethics Quiz App

Static HTML / CSS / JavaScript quiz app based on the uploaded **EPHMRA 2025 Code of Conduct (Japanese translation)**.

## Folder structure

```text
EPHMRA-Quiz-App/
  index.html
  assets/
    css/
      styles.css
    js/
      questions.js
      app.js
```

## What is included

- **中級 / 上級** 2レベル
- 毎回 **8問をランダム出題**
- **正解時にショート解説** を表示
- **不正解が出た時点で終了** し、正解と解説を表示
- **全問正解でCertificate画面** を表示
- **ローカル統計**（attempts / perfect clears / best run）をブラウザ保存
- **Certificate PNG download**

## Question bank size

- Intermediate: 20 questions
- Advanced: 30 questions
- Total: 50 questions

## GitHub upload

1. ZIPを展開
2. 中身をGitHubリポジトリのルートにアップロード
3. GitHub Pagesを有効化（Branch deploy）
4. `index.html` がトップページとしてそのまま動きます

## Easy future edits

### Question edits
Edit:

- `assets/js/questions.js`

Each question contains:

- `level`
- `topic`
- `scenario` (optional)
- `prompt`
- `options`
- `explanation`
- `reference`

### Design edits
Edit:

- `assets/css/styles.css`

Main visual controls:

- color palette: `:root`
- card spacing/radius
- level card styles
- certificate styles

### App behavior edits
Edit:

- `assets/js/app.js`

Useful constants near the top:

- `QUESTION_COUNT` (currently 8)
- `LEVEL_META`
- local storage key

## Notes

- This is a **training tool**, not legal advice.
- The quiz content is grounded in the uploaded EPHMRA PDF, but country-specific rules and legal review should still be checked where relevant.
- No external libraries are required.
