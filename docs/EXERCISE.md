# Idneo React Technical Exercise

## Objective

Build a small **Clinical Case Review** application in React. It helps a clinician review mock patient cases, inspect test results, record a clinical assessment, and decide the next action.

- Front-end only. Use mock data only. No real medical decisions.
- Assessed on: maintainable design for a complex workflow — data loading, state management, validation, UX, accessibility, testing, clear technical decisions.
- Time box: **6–8 hours**. Deliver a complete, reliable core flow first. Document decisions and trade-offs.

---

## Requirements

### Application

React + **TypeScript (strict mode)**. Vite, Next.js or another current setup. Any package manager and UI/charting library. Must run locally **without a backend**.

#### 1. Case list
- a. List of **at least 10** mock patient cases.
- b. Each case: **case ID, initials, age, status, priority, last update date**.
- c. **Text search** + filters for **status** and **priority**.
- d. Filters kept **in the URL** (shareable / survives refresh).
- e. Handle **loading, empty and error** states.

#### 2. Case detail
- a. Open a case from the list **via routing**.
- b. Show patient details, symptoms, medical history and mock test results. **At least two result types** (e.g. laboratory results + imaging report).
- c. Highlight **abnormal results** using **configurable reference ranges**.
- d. **Colour must not be the only** way to communicate an abnormal result.
- e. **Chronological case timeline** (test ordered, result received, assessment saved, …).

#### 3. Clinical assessment workflow
- a. User can record an assessment for a case.
- b. Form fields: **working assessment, confidence level, recommended next action, notes, follow-up date (when relevant)**.
- c. Useful validation rules with clear validation messages.
- d. **Warn before leaving** the page with unsaved changes.
- e. Saving **updates the case view** and **adds a timeline event**. **Page refresh preserves** saved mock data (e.g. localStorage).
- f. Clear success and failure feedback. **Simulate a save failure deterministically.**

#### 4. Review queue
- a. View showing cases **requiring review**.
- b. Define and document a simple **priority rule** based on mock data (e.g. critical results, overdue follow-up, low assessment confidence).
- c. User can **mark a case as reviewed** — reflected in the **list, case detail and review queue**.

---

### Architecture and quality

- Separate **UI components, application state, data access and clinical rules**. No business rules all in one component.
- **Strong domain types.** No `any` for application or patient data.
- **Routing solution** (React Router or framework router) for list, detail and review queue.
- State management that fits the task (React state/context, a state library, a data-fetching library, or a mix). **Explain the choice in the README.**
- Mock data access behind a **repository / API-client interface** so it can be swapped for a real API later.
- Filters and search state in **URL query parameters**.
- Any form approach. **Validation and errors must be accessible.**
- **Responsive** and **keyboard accessible**. Semantic HTML; form fields, status messages and errors have **accessible names**.
- **Don't expose sensitive data** in URLs, logs or browser storage beyond the mock data required.
- Reasonable handling of **async operations and errors**.
- Avoid unnecessary re-renders where they matter — **don't optimize prematurely**.

---

### Testing

- **At least 8 tests** across unit and component/integration levels. Full coverage not expected.
- **Vitest or Jest** + **React Testing Library** (or equivalent). Test user-visible behaviour, not implementation details.
- Use **deterministic mock data** in tests.

Tests **must cover**:
- [ ] Priority rule and abnormal-result **boundary cases**
- [ ] Form validation and **conditional follow-up date** behaviour
- [ ] Saving an assessment and **updating the timeline**
- [ ] **Save failure** feedback and **retry** behaviour
- [ ] **Unsaved-changes** protection
- [ ] Search or filter state **restored from the URL**

---

## Deliverables

A Git repository containing:
- Source code and **lockfile**.
- **README** with setup, run and test commands.
- Short **design document** (README or `docs/`) explaining:
  - Application architecture and state-management choice
  - Domain model and data-access design
  - Priority and abnormal-result rules
  - How mock persistence and simulated failures work
  - Accessibility, privacy and error-handling decisions
  - Assumptions, trade-offs, and what you'd improve with more time

---

## Bonus (optional — pick any)

- Role-based UI permissions (clinician vs reviewer) with a mock auth service.
- Audit trail: who changed an assessment, what changed, when.
- Reusable design-system component (form fields, status badges or data tables) with built-in a11y.
- E2E test for the full flow: filter a case → create assessment → save → mark as reviewed.
- i18n for English + one other language.
- Replace the mock repository with a small local API adapter **without changing feature components**.

> They value thoughtful design, good trade-offs and a reliable core over feature quantity.
