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

The app starts with 12 mock cases, and the changes you make are saved in your browser. To see a failed save
or to reset the data, see [Mock persistence and failures](#mock-persistence-and-failures).

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

## Mock persistence and failures

There is no backend. `src/api/case-api.ts` plays the role of one:

- **Starting data:** `src/api/cases.json` holds 12 mock cases. It is a read-only seed that is never modified.
- **Saving:** the first time you save an assessment or mark a case as reviewed, the app copies the cases into
  your browser's localStorage (key `clinical-case-review.cases`). From then on it reads and writes only there, so
  your changes survive a refresh.
- **Network delay:** every call waits 300 ms, so the loading states are visible.
- **Simulated failure:** saving an assessment whose notes contain `FAIL` always fails, every time. The form keeps
  what you typed and shows the error with a Retry button. Remove `FAIL` and save again to succeed.
- **Reset:** delete the `clinical-case-review.cases` key in DevTools (Application → Local Storage) and reload.

## Accessibility, privacy and error handling

**Accessibility**
- Abnormal results use words and a symbol as well as colour (▲ High, ▼▼ Critical low), so colour is never the only signal.
- Semantic HTML: real tables, headings, description lists, and a timeline built as an ordered list of `<time>` elements.
- Every form field has a label. Validation errors are linked to their field, and only required fields can block a save.
- Success messages are announced politely (`role="status"`) and failures assertively (`role="alert"`).
- Dialogs trap focus and close with Esc. The "Reviewed" button stays on screen, disabled, so keyboard focus is not lost.

**Privacy**
- The UI only ever receives a patient's initials. Full names stay in the data layer and never reach a component.
- URLs contain only filters and the case ID, and search matches case ID or initials only. Nothing is logged.
- localStorage holds the mock data only, no personal data beyond what the exercise provides.

**Error handling**
- Every async screen has loading, error and Retry states: list, detail, review queue, save and mark as reviewed.
- A failed save keeps what you typed, and leaving with unsaved changes asks for confirmation first.

## Trade-offs and next steps

**Trade-offs**
- Filter values in the URL are not validated: `?status=banana` simply shows the empty state.
- localStorage is per browser, with no concurrency control, and the whole list is rewritten on every save.
- The two forms use plain React state and inline validation. A form library would pay off with more forms.

**With more time**
- An audit trail: who changed an assessment, what changed and when.
- Roles (clinician and reviewer) with a mock login, so only reviewers can mark a case as reviewed.
- A real API adapter with server-side filtering and pagination, replacing the mock in one place.
- An end-to-end test of the whole flow (filter, assess, save, review) and automated accessibility checks.
