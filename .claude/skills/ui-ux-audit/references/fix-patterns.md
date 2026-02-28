# Common Fix Patterns

Reference file for the `/ui-ux-audit` command. Consult during Phase 4 (Fix).

---

## Buttons

### Standardize Primary Button

Before (inconsistent):
```
px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors
px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700
px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors
```

After (standardized):
```
inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
```

### Standardize Secondary Button

After (standardized):
```
inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
```

### Standardize Success/Approve Button

After (standardized):
```
inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors
```

### Standardize Danger Outline Button

After (standardized):
```
inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-red-300 text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors
```

### Standardize Icon-Only Button

After (standardized):
```jsx
<button
  onClick={handler}
  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
  aria-label="Descriptive label"
>
  <IconName size={18} />
</button>
```

---

## Cards

### Standardize Card Container

Before (inconsistent):
```
bg-white rounded-lg border border-slate-200 p-4
bg-white rounded-lg border border-slate-200 p-5 mb-4
bg-white border border-slate-200 rounded-md p-3
bg-white rounded-lg shadow-sm p-4
```

After (standardized):
```
bg-white rounded-lg border border-slate-200 p-4
```

Notes:
- Use `p-5` or `p-6` only for hero/primary cards that need more breathing room
- Use `shadow-sm` only on elevated/floating elements (dropdowns, modals, popovers) — not on inline cards
- Always use `rounded-lg` (not `rounded-md`) for cards

---

## Tabs

### Standardize Tab Navigation

Before (inconsistent):
```jsx
// File A
<button className={`px-3 py-2 text-sm font-medium border-b-2 ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>

// File B
<button className={`px-4 py-2.5 text-sm font-medium border-b-2 ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>

// File C
<button className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${active ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
```

After (standardized):
```jsx
<button
  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
    active
      ? 'border-blue-600 text-blue-600'
      : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
  }`}
>
```

Notes:
- Always `px-4 py-2` padding
- Always include `transition-colors`
- Always include `whitespace-nowrap`
- Inactive hover: `hover:text-slate-800 hover:border-slate-300`

---

## Focus States

### Add Focus to Button

Before:
```
className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
```

After:
```
className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
```

### Add Focus to Input

Before:
```
className="w-full px-3 py-2 border border-slate-300 rounded-lg"
```

After:
```
className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
```

---

## Accessibility

### Add aria-label to Icon-Only Button

Before:
```jsx
<button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
  <X size={18} />
</button>
```

After:
```jsx
<button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors" aria-label="Close">
  <X size={18} />
</button>
```

### Add aria-expanded to Expandable Section

Before:
```jsx
<button onClick={() => setExpanded(!expanded)} className="...">
  <ChevronDown size={16} />
</button>
```

After:
```jsx
<button onClick={() => setExpanded(!expanded)} className="..." aria-expanded={expanded} aria-label="Toggle details">
  <ChevronDown size={16} />
</button>
```

### Add Semantic HTML

Before:
```jsx
<div className="flex flex-col w-64 bg-slate-900">
  {/* sidebar nav items */}
</div>
```

After:
```jsx
<nav className="flex flex-col w-64 bg-slate-900" aria-label="Main navigation">
  {/* sidebar nav items */}
</nav>
```

---

## Disabled States

### Add Disabled Styling

Before:
```jsx
<button
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
  disabled={!isValid}
>
```

After:
```jsx
<button
  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={!isValid}
>
```

---

## Interactive States

### Add Cursor to Clickable Div

Before:
```jsx
<div onClick={handleClick} className="p-4 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
```

After:
```jsx
<div onClick={handleClick} className="p-4 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
```

### Add Hover to Table Row

Before:
```jsx
<tr onClick={() => navigate(`/crm/${contact.id}`)} className="border-b border-slate-100">
```

After:
```jsx
<tr onClick={() => navigate(`/crm/${contact.id}`)} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
```

---

## Transitions

### Add Transition to Hoverable Element

Before:
```
className="text-slate-400 hover:text-slate-600"
```

After:
```
className="text-slate-400 hover:text-slate-600 transition-colors"
```

### Add Transition to Expandable Section

Before:
```jsx
{expanded && (
  <div className="mt-2 p-4 bg-slate-50 rounded-lg">
    {/* content */}
  </div>
)}
```

After (simple approach — opacity):
```jsx
<div className={`mt-2 p-4 bg-slate-50 rounded-lg transition-all duration-200 ${
  expanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden p-0 mt-0'
}`}>
  {/* content */}
</div>
```

---

## Undefined Color Tokens

### Add Missing Custom Colors to tailwind.config.js

If the codebase references custom color prefixes (e.g., `kynex-*`, `brand-*`) that aren't defined:

Before:
```javascript
theme: {
  extend: {},
},
```

After (map to closest standard Tailwind equivalent):
```javascript
theme: {
  extend: {
    colors: {
      kynex: {
        primary: '#2563eb',    // blue-600
        surface: '#ffffff',    // white
        bg: '#f8fafc',         // slate-50
        text: '#0f172a',       // slate-900
      }
    }
  },
},
```

Alternative: Replace all `kynex-*` references with their standard Tailwind equivalents throughout the codebase (often cleaner).

---

## Duplicated Utilities

### Extract Shared Helper

If the same helper function (e.g., `getScoreColor`) appears in multiple page files:

1. Move the function to `src/utils/` (e.g., `src/utils/formatters.js`)
2. Export it: `export function getScoreColor(score) { ... }`
3. Import in each page: `import { getScoreColor } from '../utils/formatters'`
4. Delete the inline definitions from each page file
