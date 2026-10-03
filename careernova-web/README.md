# CareerNova web app

The student-facing app for CareerNova AI. Students enter their tools, rate 10 core skills and pick fields they like. The app matches them against 1,016 O\*NET occupations, explains every score in four parts, and builds a short skill-gap plan.

Built from the Figma design ("CareerNova" file, Astryx library) in React, TypeScript, Vite, Tailwind CSS v4, Radix UI, cmdk and lucide-react.

Everything runs in the browser:

- **No accounts and no server.** The profile is saved in `localStorage`.
- **CV files are read locally and never uploaded.** PDF uses pdf.js; DOCX uses mammoth.
- **Matching runs on the student's device.**

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # matching-engine tests (vitest)
npm run build      # production build in dist/
npm run preview    # serve the production build
```

`dist/` is a static site. It can be hosted on GitHub Pages, Netlify, Vercel or any static file host. The host must serve `index.html` for unknown paths (the app uses client-side routes such as `/career/15-1252.00`).

## Data

`public/data/*.json` is generated from `../Career_Nova_Final_Clean_Optimized_Dataset.csv`:

```bash
npm run data       # = python scripts/build_data.py  (needs pandas, scikit-learn)
```

| File | Contents |
| --- | --- |
| `occupations.json` | One record per occupation: code, title, field, Job Zone, predicted Job Zone, 10 skills (importance, level), tool ids |
| `tools.json` | The 331 in-demand and hot tools, with short display names ("SQL", not "Structured query language SQL"), usage counts and CV aliases |
| `software.json` | Full software lists, loaded only when a student opens one |
| `model.json` | Random Forest test confusion matrix, feature importances, accuracy |

The script also:

- **Recounts the skill lists.** The CSV's `*_count` columns are wrong (they only hold 0 or 1).
- **Trains the Random Forest** that predicts each occupation's Job Zone. Rated occupations get out-of-fold (5-fold CV) predictions. The 93 unrated ones are predicted by a model trained on all rated occupations.

## Matching (`src/lib/match.ts`)

| Part | Points | Rule |
| --- | --- | --- |
| Tools | 40 | In-demand tools count 1, hot technologies 0.5. Full marks at about 40% of the career's list (minimum 5 tools, maximum 15) |
| Core skills | 30 | Needed level = O\*NET level 1–7 mapped to 1–5. Weighted by importance. A skill at or above the needed level counts fully; each level below loses half of that skill's share |
| Interest | 15 | The career is in a field the student picked |
| Preparation | 15 | Education → zone (Class 12 → 2, Diploma → 3, Bachelor's → 4, Master's → 5). Full marks at or one zone below the student's level (12 when the student is on track for a bachelor's). 6 one zone above. 0 two or more zones above. 8 two or more zones below |

Parts with no O\*NET data score half marks. Unrated careers use the predicted zone, and the app says so. The 4 parts with their weights and the confusion matrix are on the How it works page.

## Where things are

```
src/
  lib/          types, constants, data loading, matching engine, profile store, CV parsing
  components/   layout, score parts, career bits, skills chart, tool search, CV upload, ui/
  pages/        Landing, Profile (5 steps), Results, Career, Explore, HowItWorks, About, Privacy, NotFound
scripts/        build_data.py
public/data/    generated JSON
```

## Decisions on the design's open questions

| # | Question | Decision |
| --- | --- | --- |
| 1 | Score weights | 40 / 30 / 15 / 15, as designed |
| 2 | Skill scale conversion | `round((level − 1) / 6 × 4 + 1)` |
| 3 | When does a skill "meet" the level? | Your rating ≥ the converted needed level |
| 4 | Placeholder numbers | All counts are computed from the data. The landing page sample stays, labelled "Example data" |
| 5 | Confusion matrix | Real counts from the **Random Forest** test set. Career pages use the Random Forest, so the matrix matches the model you see |
| 6 | Education → zone | As designed. Overqualification (2+ zones below) scores 8 of 15, so low-preparation jobs don't flood a graduate's results |
| 7 | Compare careers | Left out of v1, as designed |
| 8 | Course links | Coursera, freeCodeCamp and YouTube search URLs |
| 9 | Logo | Blue dot plus "CareerNova" wordmark |
