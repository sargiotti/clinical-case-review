# Clinical Case Review

A small React app for reviewing mock patient cases: browse and filter cases, inspect results,
record an assessment, and work through a review queue. It runs entirely in the browser,
with no backend.

Built for the Idneo React technical exercise. The assignment is in [`docs/EXERCISE.md`](docs/EXERCISE.md).

## Setup and run

You need Node.js 20.19+ or 22.12+ (developed on Node 24) and npm.

```bash
npm install     # install dependencies
npm run dev     # start the app at http://localhost:5173
```

## Other commands

| Command | What it does |
|---|---|
| `npm test` | Runs all tests once (Vitest + React Testing Library) |
| `npm run test:watch` | Runs the tests again on every change |
| `npm run lint` | Lints the code (oxlint) |
| `npm run build` | Type-checks (strict TypeScript) and builds for production |
| `npm run preview` | Serves the production build locally |

## Trying it out

- The app starts with 12 mock cases. Changes you make (assessments, marking as reviewed) are saved
  in your browser's localStorage, so they survive a refresh.
- To reset to the original data, delete the `clinical-case-review.cases` key in DevTools
  (Application → Local Storage) and reload.
- To see a failed save, type `FAIL` in the assessment notes and save. Remove it and retry to succeed.

## How it's built

### Technologies

| Area | Technology |
|---|---|
| UI | React 19, TypeScript 7 (strict) |
| Build and dev server | Vite 8 |
| Routing | React Router 8 |
| Server data | TanStack Query 5 |
| UI components | MUI 9 |
| Forms | Plain React state |
| Tests | Vitest 5, React Testing Library |
| Linting | oxlint |

### Architecture

The app has four layers, and each one only talks to the next:

1. **Pages** (`src/modules/`): one folder per feature (case list, case detail, review queue). They render
   data and handle user input, and contain no clinical rules.
2. **State**: TanStack Query holds data that comes from the API. Search and filters live in the URL, so
   they survive a refresh and can be shared. Form fields use local React state.
3. **Clinical rules** (`src/shared/rules/`): plain functions with no React, such as "is this lab result
   abnormal?" and "does this case need review?". They are easy to test and easy to change.
4. **Data access** (`src/api/`): the UI only knows the `CaseApi` interface. A mock implementation reads
   a JSON file and saves to localStorage, so a real backend can replace it by changing one line.

Saving works the same way everywhere: a page calls a hook, the hook calls `CaseApi`, and then TanStack Query
refreshes the data, so the list, the case detail and the review queue all update together.

For a visual overview, open the interactive diagram: [`docs/architecture.html`](docs/architecture.html).
It is a single standalone file: after cloning the repo, open it in a browser. (GitHub shows HTML files
as source code, so viewing it there will not render the diagram.)

### Domain and data

**Domain model** (`src/domain/`): the types the whole app shares, one file per concept.

- `PatientCase` is the main entity. It has a patient, a status (`open`, `assessed`, `reviewed`), a priority,
  symptoms, lab results, imaging reports, a timeline and, once saved, an assessment.
- Lists of allowed values, like statuses and next actions, are defined once as constants. The types, the
  dropdown options and the labels all come from them, so they cannot drift apart.

**Data access** (`src/api/`): the UI never reads the JSON directly.

```
cases.json / localStorage  →  DTO  →  mapper  →  domain type  →  UI
```

- The DTOs (`*.dto.ts`) and mappers (`*.mapper.ts`) are used by the mock API to turn stored data into domain
  types. The mapper keeps only the patient's initials, so the full name never reaches the UI.
- `CaseApi` is the interface the UI uses: `getCases`, `getCase`, `saveAssessment` and `markReviewed`.
  The app picks its implementation in one line, `export const caseApi: CaseApi = mockCaseApi`, so a real
  backend only needs a new implementation and that line changed.

## Clinical rules

Both rules are plain functions in `src/shared/rules/`, with unit tests for the boundary cases.

### Abnormal results

Each lab result is compared with a reference range. The ranges are configuration: change a number in
`src/shared/config/reference-ranges.ts` and the highlighting follows.

| Test | Normal range | Critical below | Critical above |
|---|---|---|---|
| Potassium (K), mmol/L | 3.5 – 5.0 | 2.5 | 6.5 |
| Sodium (NA), mmol/L | 135 – 145 | 120 | 160 |
| Glucose (GLU), mg/dL | 70 – 140 | 50 | 400 |
| White blood cells (WBC), ×10⁹/L | 4.0 – 11.0 | 2.0 | 30 |
| C-reactive protein (CRP), mg/L | 0 – 10 | none | 100 |
| Haemoglobin (HB), g/dL | 12.0 – 17.5 | 7.0 | 20 |

- Outside the normal range a result is **Low** (▼) or **High** (▲). Beyond a critical limit it is
  **Critical low** (▼▼) or **Critical high** (▲▲). Each flag has words and a symbol, not just colour.
- A value exactly on a limit counts as inside it: potassium 5.0 is normal, and 6.5 is high but not critical.
- A test with no configured range shows "No reference range", never "Normal".

### Review queue priority

A case is in the review queue when it is not yet reviewed and has at least one of these reasons:

| Priority | Reason | When |
|---|---|---|
| 1 | Critical result | Any lab result is critical |
| 2 | Overdue follow-up | The assessment's follow-up date is before today |
| 3 | Low confidence | The assessment's confidence is low |

Cases are ordered by their most urgent reason, then by oldest update first. Marking a case as reviewed
removes it from the queue.
