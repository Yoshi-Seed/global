# Medical website v2 page build

This site now generates all public pages from shared templates.

## What is shared
- Header (`templates/partials/header.html`)
- Footer (`templates/partials/footer.html`)
- Overall HTML layout (`templates/layout.html`)
- Navigation labels, URLs, and active-page rules (`build/navigation.json`)

## Page-specific content
- Each page body is stored in `templates/content/*.html`.
- Per-page metadata and asset lists are in `build/pages.json`.

## Build command
From repository root:

```bash
npm run build:medical-v2
```

The command regenerates these pages:
- `index.html`
- `how-we-work.html`
- `rare-disease.html`
- `insights.html`
- `fact-sheet.html`
- `about-us.html`
- `request-report.html`

If you need to change menu text / links / active behavior, edit only `build/navigation.json` and rebuild.
