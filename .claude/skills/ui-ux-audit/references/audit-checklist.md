# UI/UX Audit Checklist — Detailed Patterns

Reference file for the `/ui-ux-audit` command. Consult during Phase 2 (Analyze).

---

## 1. Color Consistency

### Primary Action Color
**Grep**: `bg-blue-[0-9]+` on button elements
**Expected**: `bg-blue-600` (normal), `hover:bg-blue-700` (hover)
**Flag**: Any button using `bg-blue-500`, `bg-blue-800`, or other blue shades for primary actions

### Success / Approve Color
**Grep**: `bg-green-[0-9]+` on button elements
**Expected**: `bg-green-600` / `hover:bg-green-700` for approve buttons; `bg-green-100 text-green-700` for success badges
**Flag**: Mixed green shades on buttons with same semantic purpose

### Danger / Reject Color
**Grep**: `bg-red-[0-9]+`, `text-red-[0-9]+`, `border-red-[0-9]+`
**Expected**: `bg-red-600` / `hover:bg-red-700` for solid danger; `border-red-300 text-red-600 hover:bg-red-50` for outlined danger; `bg-red-100 text-red-700` for danger badges
**Flag**: Inconsistent red shade pairings

### Warning Color
**Grep**: `bg-amber-[0-9]+`, `text-amber-[0-9]+`
**Expected**: `bg-amber-100 text-amber-700` for badges; `bg-amber-500` for indicators

### Neutral / Surface Colors
**Grep**: `bg-slate-[0-9]+`, `text-slate-[0-9]+`
**Expected**: `bg-slate-900` sidebar, `bg-slate-50` page background, `bg-white` cards, `text-slate-900` headings, `text-slate-600` body, `text-slate-500` secondary, `text-slate-400` metadata

### Undefined Custom Colors
**Grep**: Any class with a prefix not matching standard Tailwind colors (e.g., `kynex-`, `brand-`, `primary-`)
**Check**: Cross-reference against `tailwind.config.js` → `theme.extend.colors`
**Severity**: Critical if classes produce no styling

---

## 2. Component Consistency

### Buttons — Primary
**Grep**: `bg-blue-600` on `<button` elements
**Standard**: `inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`
**Check**: padding (px-3 vs px-4), radius (rounded-md vs rounded-lg), font-weight, transition

### Buttons — Secondary / Outline
**Grep**: `border.*text-blue` or `border.*text-slate` on buttons
**Standard**: `inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`

### Buttons — Danger Outline
**Grep**: `border.*text-red` on buttons
**Standard**: `inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-red-300 text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors`

### Buttons — Icon Only
**Grep**: Buttons containing only icon components (no visible text children)
**Standard**: `p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors`
**Required**: Must have `aria-label` attribute

### Card Containers
**Grep**: `bg-white rounded` patterns
**Standard**: `bg-white rounded-lg border border-slate-200 p-4`
**Check**: border (some missing), radius (rounded-md vs rounded-lg), shadow (shadow-sm vs none), padding (p-3 vs p-4 vs p-5 vs p-6)
**Rule**: Use `p-4` for standard cards, `p-5` or `p-6` only for hero/primary cards

### Input Fields
**Grep**: `<input`, `<select`, `<textarea` elements
**Standard**: `w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`
**Check**: border color, radius, focus ring color, padding

---

## 3. Typography Hierarchy

### Page Titles (h1 equivalent)
**Grep**: `text-2xl font-`
**Standard**: `text-2xl font-semibold text-slate-900`
**Flag**: Pages using `text-xl` or `text-3xl` for main heading

### Section Headings
**Grep**: `text-lg font-` or `text-base font-semibold`
**Standard**: `text-lg font-semibold text-slate-900` or `text-base font-semibold text-slate-900`
**Flag**: Inconsistent sizes for same-level headings across pages

### Card Titles
**Grep**: `font-medium text-s` inside card containers
**Standard**: `text-sm font-medium text-slate-900`

### Body Text
**Standard**: `text-sm text-slate-600`

### Metadata / Timestamps
**Standard**: `text-xs text-slate-500`

### Labels
**Standard**: `text-xs font-medium text-slate-500 uppercase tracking-wider` or `text-sm font-medium text-slate-700`

---

## 4. Spacing Patterns

### Card Internal Padding
**Grep**: `p-[0-9]+` on elements with `bg-white` and `rounded`
**Standard**: `p-4` for standard cards
**Flag**: Cards mixing `p-3`, `p-4`, `p-5` for same-purpose containers

### Grid Gaps
**Grep**: `gap-[0-9]+`
**Standard**: `gap-4` for card grids, `gap-6` for major section grids
**Flag**: Same-layout grids using different gap values

### List Item Spacing
**Grep**: `space-y-[0-9]+`
**Standard**: `space-y-2` for tight lists, `space-y-3` for standard lists, `space-y-4` for card lists
**Flag**: Same-type lists with different spacing

### Section Margins
**Grep**: `mb-[0-9]+` between major sections
**Standard**: `mb-6` between major sections, `mb-4` between subsections
**Flag**: Same-level sections with different bottom margins

---

## 5. Accessibility

### Icon-Only Buttons
**Check**: Every `<button>` containing only an icon component (no visible text) must have `aria-label`
**Grep**: `<button` then check children — if only `<IconName` with no text sibling, flag as missing aria-label

### Expandable Sections
**Check**: Triggers for expand/collapse should have `aria-expanded={isExpanded}`
**Grep**: `onClick` handlers that toggle boolean state controlling visibility

### Form Inputs
**Check**: Every `<input>`, `<select>`, `<textarea>` should have an associated `<label>` or `aria-label`
**Grep**: `<input` without preceding `<label` or `aria-label` attribute

### Semantic HTML
**Check**: Navigation should use `<nav>`, main content `<main>`, sidebar `<aside>`, content groups `<section>`
**Flag**: `<div>` used where semantic elements belong

### Focus Indicators
**Check**: Every interactive element (button, link, input) should have visible focus styling
**Grep**: Count `focus:` per file vs count of interactive elements
**Flag**: Files with interactive elements but zero focus: classes

---

## 6. Interactive States

### Hover States
**Check**: Every clickable element should have `hover:*`
**Grep**: `onClick` without corresponding `hover:` on same element
**Flag**: Clickable cards/rows without hover background change

### Focus States
**Standard**: `focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
**Flag**: Buttons and links without any focus: classes

### Disabled States
**Standard**: `disabled:opacity-50 disabled:cursor-not-allowed`
**Check**: Buttons with conditional `disabled={condition}` prop
**Flag**: Disabled buttons without visual disabled styling

### Active / Pressed States
**Optional but recommended**: `active:scale-[0.98]` on buttons for tactile feedback

### Cursor
**Check**: Elements with `onClick` should have `cursor-pointer` (unless they're `<button>` or `<a>` which have it by default)
**Flag**: `<div onClick>` or `<tr onClick>` without `cursor-pointer`

---

## 7. Loading & Error States

### Skeleton Loaders
**Check**: Pages that fetch data (even mock data with setTimeout) should show skeletons during loading
**Flag**: Pages with loading state but no skeleton/spinner

### Empty States
**Check**: Lists/tables that could be empty should show EmptyState component
**Flag**: `.map()` on arrays without empty array handling

### Error Boundaries
**Check**: Major page sections should handle error cases gracefully
**Flag**: No error boundary or try/catch around data operations (low priority for mock-data apps)

---

## 8. Visual Hierarchy

### Section Grouping
**Check**: Related information should be visually grouped (cards, borders, backgrounds)
**Flag**: Long pages with no visual breaks between sections

### Action Prominence
**Check**: Primary action should be visually dominant (filled button, larger, positioned right)
**Flag**: Primary and secondary actions with same visual weight

### Information Density
**Check**: Dense tables/lists should have alternating row colors or dividers
**Flag**: Long lists without visual separation between items

---

## 9. Micro-interactions

### Transition Coverage
**Grep**: Elements with `hover:` but missing `transition-`
**Standard**: Add `transition-colors` (for color changes) or `transition-all` (for multiple property changes)
**Duration**: Default Tailwind duration (150ms) is fine

### Expand/Collapse
**Check**: Sections that expand/collapse should animate (opacity, height, or transform)
**Flag**: Content appearing/disappearing instantly on toggle

### Tab Content
**Check**: Tab panels can benefit from a subtle `transition-opacity` on switch
**Flag**: Tab content switching with no visual transition (low priority)

---

## 10. Responsive Considerations

### Fixed Widths
**Grep**: `w-[0-9]+` (pixel-based widths) on content containers
**Flag**: Content areas with fixed width that won't adapt

### Text Truncation
**Check**: Text in table cells, card titles, badges should truncate with `truncate` class
**Flag**: Long text overflowing containers

### Grid Responsiveness
**Check**: `grid-cols-*` should have responsive variants (`md:grid-cols-*`, `lg:grid-cols-*`)
**Flag**: Fixed grid columns without breakpoint variants (low priority for desktop-first demos)

### Touch Targets
**Check**: Interactive elements should be at least 44x44px
**Flag**: Small icon buttons without adequate padding (p-1 or smaller)
