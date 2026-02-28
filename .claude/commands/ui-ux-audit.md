# UI/UX Audit

Systematically scan this React + Tailwind CSS codebase for UI/UX inconsistencies, accessibility gaps, and visual quality issues. Present a structured report, then implement fixes after user approval.

## Phase 1 — Scan

Gather a complete picture of the UI layer. Run reads in parallel where possible.

### Step 1A: Read Configuration

Read these files to understand the project's design foundation:
- `tailwind.config.js` (or `.ts`) — custom theme tokens, colors, fonts, spacing, plugins
- Main CSS file (`src/index.css` or `src/globals.css`) — `@layer` directives, CSS variables, custom utilities

### Step 1B: Read All Shared Components

Use Glob to find all files under `src/components/shared/` or `src/components/ui/`. Read each file completely. These define the project's design vocabulary. Record the exact Tailwind classes used for:
- Button variants (primary, secondary, danger, ghost, icon-only)
- Card containers (border, radius, shadow, padding)
- Badges and pills
- Input and form controls
- Typography patterns

### Step 1C: Read Layout Components

Read all layout files (sidebar, topbar, header, footer, main layout). Note the color palette, spacing tokens, and structural patterns.

### Step 1D: Read All Pages

Read every page file. While reading, collect instances of:
- Every unique button class string
- Every unique card/container class string
- Every unique input/select/textarea class string
- Every tab navigation pattern
- Every heading (size + weight + color)
- Every color class (text-*, bg-*, border-*)
- Every rounded-* and shadow-* value
- Every transition/animation class
- Every focus:, hover:, active:, disabled: class
- Every aria-* attribute and semantic HTML element usage

## Phase 2 — Analyze

Consult the reference file at `.claude/skills/ui-ux-audit/references/audit-checklist.md` for detailed grep patterns and expected standards.

Compare collected patterns across these 10 categories. For each, identify specific deviations with file paths and line numbers.

### Categories

1. **Color Consistency** — Custom color classes not defined in tailwind.config.js; mixed color shades for the same purpose (e.g., blue-600 vs blue-500 for primary actions); hardcoded hex/rgb values
2. **Component Consistency** — Button styles varying across pages (different padding, radius, font-weight, hover states); card containers with different border/shadow/radius; input fields with different focus ring styles
3. **Typography Hierarchy** — Page titles using different text-* sizes; inconsistent font-weight; body text size varying; label/metadata styles not uniform
4. **Spacing Patterns** — Inconsistent padding inside cards; inconsistent gap values in grids/flex; inconsistent margins between sections
5. **Accessibility** — Missing aria-label on icon-only buttons; missing aria-expanded on collapsible sections; non-semantic HTML (div where button/nav/section belongs); missing focus-visible styles; missing alt text on images
6. **Interactive States** — Buttons missing hover, focus, active, or disabled states; clickable elements without cursor-pointer; form inputs without focus ring
7. **Loading & Error States** — Pages without skeleton loaders; missing empty state handling; no error fallback UI
8. **Visual Hierarchy** — Dense sections without visual grouping; missing section headers; important actions not visually prominent
9. **Micro-interactions** — Expandable sections without transitions; tabs switching without animation; buttons without active:scale feedback; elements with hover: but missing transition-colors
10. **Responsive Considerations** — Fixed-width layouts; grid columns not adapting; text not truncating; touch targets too small

### Helpful Grep Patterns

Run these to quickly find inconsistencies:
```
rounded-(sm|md|lg|xl|full)    — border-radius variance
shadow-(sm|md|lg|xl)          — shadow variance
bg-blue-[0-9]+               — primary color shade consistency
p-[0-9]+                     — padding values on cards
gap-[0-9]+                   — gap values in grids
border-b-2                   — tab navigation patterns
hover:                        — hover state coverage
focus:                        — focus state coverage
disabled:                     — disabled state coverage
aria-                         — accessibility attribute coverage
transition-                   — animation coverage
```

## Phase 3 — Report

Present findings using this exact structure. Be specific — include file paths, line numbers, current code, and recommended fix for each issue.

### Report Format

```
## UI/UX Audit Report

### Summary
- X critical issues
- Y high-priority issues
- Z medium-priority issues
- W low-priority issues
- N files affected

### Critical Issues
Issues that cause broken or unusable UI (undefined CSS classes, invisible text, inaccessible controls).

#### [Category]: [Brief title]
- **Files**: `path/to/file.jsx:line`
- **Issue**: [Description]
- **Current**: `[current code]`
- **Fix**: `[recommended code]`

### High Priority
Accessibility violations and significant visual inconsistency in shared components.

### Medium Priority
Inconsistent but functional styling differences.

### Low Priority
Missing polish — micro-interactions, optional transitions.

### Fix Plan
Batches ordered for safe implementation:
1. **Tailwind Config** — Add missing theme tokens (N changes)
2. **Shared Components** — Fix base components all pages consume (N files)
3. **Button Consistency** — Standardize button styles (N files)
4. **Card Consistency** — Standardize containers (N files)
5. **Tab Navigation** — Standardize tab patterns (N files)
6. **Typography** — Normalize headings and text styles (N files)
7. **Accessibility** — Add aria-labels, roles, semantic HTML (N files)
8. **Interactive States** — Add missing hover/focus/disabled (N files)
9. **Spacing** — Normalize padding and gaps (N files)
10. **Micro-interactions** — Add transitions and animations (N files)
```

### Severity Rules

- **Critical**: Broken layouts, undefined CSS classes producing no styling, completely inaccessible controls
- **High**: Missing aria-labels on interactive elements, no focus states on buttons, significant inconsistency in shared components
- **Medium**: Different border-radius or padding on similar elements, inconsistent text colors for same purpose
- **Low**: Missing transitions, optional polish items

After the report, ask: **"Which batches would you like me to implement? I can do all of them in order, or you can pick specific ones."**

Do NOT proceed to Phase 4 until the user explicitly approves.

## Phase 4 — Fix

Consult `.claude/skills/ui-ux-audit/references/fix-patterns.md` for standard before/after patterns.

### Fix Rules

1. **Preserve behavior** — Only modify className strings and HTML attributes. Never change component logic, state, props, or data flow.
2. **Prefer shared components** — If a page hand-codes something a shared component already handles, replace with the shared component.
3. **Match existing conventions** — Choose the pattern used by shared components or the most frequent pattern. Do not invent new conventions.
4. **Tailwind only** — No custom CSS unless the project already uses it. Only modify tailwind.config.js to add tokens that are already referenced but undefined.
5. **Atomic edits** — Each file edit should be independently reviewable. Don't combine unrelated fixes.
6. **Build check** — After completing each batch, run the project's build command (`npm run build` or `pnpm build`) to verify nothing broke.

### Batch Execution

For each approved batch:
1. List the files and changes you'll make
2. Implement the changes
3. Run build to verify
4. Report what was changed and confirm success
5. Move to the next batch

After all batches, summarize total changes made and offer to re-run the scan to verify improvements.
