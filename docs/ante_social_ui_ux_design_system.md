# Ante Social — Design System & Principles

> A living reference for every page, component, and interaction across the platform.

---

## 1. Philosophy

Ante Social sits at the intersection of **social media and prediction markets**. Every design decision should communicate two things simultaneously:

- **Trust & Clarity** — financial products require legibility, hierarchy, and honest data presentation
- **Energy & Community** — social products require warmth, personality, and moments of delight

The aesthetic direction is **refined glass minimalism** — clean, breathable, light — but with enough personality to feel alive. Never sterile. Never corporate. Never generic.

**The one thing someone should remember:** _"It felt effortless but I could always find what I needed."_

---

## 2. Core Aesthetic Values

### 2.1 Light Over Dark

The primary theme is **light mode only**. No dual-theme complexity. Backgrounds are near-white with subtle warmth. Dark elements (text, buttons, borders) use black with opacity rather than flat colours.

```
bg-white            → pure surfaces
bg-white/40         → glass cards
bg-white/60         → interactive elements
bg-black/5          → subtle fills
bg-black/10         → hover fills
text-black/90       → primary text
text-black/60       → secondary text
text-black/40       → tertiary / labels
text-black/30       → placeholders
border-black/5      → card borders
border-black/10     → input borders
border-black/20     → active input borders
```

### 2.2 Glass Morphism Cards

Every card uses the same glass treatment:

```tsx
className="relative overflow-hidden rounded-3xl bg-white/40 backdrop-blur-xl
           border border-black/5 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]"
```

Top-edge accent line (always):

```tsx
<div
  className="absolute top-0 left-0 right-0 h-px 
                bg-gradient-to-r from-transparent via-black/20 to-transparent"
/>
```

### 2.3 Gradient Separators

Used between every major section instead of hard borders:

```tsx
<div className="flex items-center gap-4">
  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
  <span className="text-xs font-medium text-black/40 uppercase tracking-wider">
    Section Label
  </span>
  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
</div>
```

---

## 3. Typography

### 3.1 Scale

```
text-3xl font-semibold   → Page titles, hero headings
text-2xl font-semibold   → Section titles (settings, modals)
text-xl font-semibold    → Card titles
text-lg font-semibold    → Sub-section headings, sidebar labels
text-base font-semibold  → Card sub-titles, group labels
text-sm font-semibold    → Body, labels, buttons, nav items
text-xs font-semibold    → Tags, badges, table headers, metadata
text-[10px] font-semibold uppercase tracking-widest → Micro-labels
```

### 3.2 Rules

- **No `font-medium` anywhere.** Use `font-semibold` as the heaviest weight.
- `font-mono` for all numbers, IDs, hashes, monetary values, and code.
- `uppercase tracking-wider` for section labels and category tags only.
- Placeholder text: always `placeholder:text-black/30`.
- All input text: `text-black` (never invisible).

---

## 4. Colour System

### 4.1 Semantic Colours

```
Green   → success, deposits, active status, positive delta
Red     → error, withdrawals, danger zone, negative delta
Blue    → info, bets, USDT, unread notifications
Amber   → tier badges, warnings, premium features
Purple  → groups, social features
Orange  → system alerts, moderate warnings
```

### 4.2 Gradient Cards (stat cards)

All stat cards use directional gradients from a tinted start to white:

```tsx
bg-gradient-to-br from-blue-50 via-white to-white    // info / primary
bg-gradient-to-br from-green-50 via-white to-white   // success / deposits
bg-gradient-to-br from-red-50 via-white to-white     // danger / withdrawals
bg-gradient-to-br from-amber-50 via-white to-white   // tier / warnings
bg-gradient-to-br from-purple-50 via-white to-white  // groups / social
```

Blur orb inside each card (gives depth):

```tsx
<div
  className="absolute -right-6 -top-6 h-24 w-24 rounded-full 
                bg-blue-100/50 blur-2xl 
                transition-all group-hover:bg-blue-200/50"
/>
```

### 4.3 Primary Action Colour

Primary buttons and selected states: **bg-black text-white**. Never a colour for primary CTAs — keep authority monochrome.

---

## 5. Spacing & Layout

### 5.1 Page Shell

```tsx
className = "space-y-8 pb-20 pl-0 md:pl-8";
```

### 5.2 Grid System

```
lg:grid-cols-12  → master layout grid
lg:col-span-8    → main content (with sidebar)
lg:col-span-4    → sidebar
lg:col-span-3    → settings sidebar
lg:col-span-9    → settings content
md:col-span-2    → full-width row in 2-col grid
```

### 5.3 Consistent Gaps

```
gap-6    → between cards
gap-4    → between form fields
gap-3    → between tags / filter pills
gap-2    → between icon and label
gap-1.5  → between small action buttons
```

### 5.4 Card Padding

```
p-6 md:p-8   → main content cards
p-6          → sidebar cards
p-5          → compact cards / list items
p-4          → list rows (notification, table rows)
p-3          → small cards, quick link items
```

### 5.5 Border Radius

```
rounded-3xl   → main cards
rounded-2xl   → inner cards, modals, stat highlights
rounded-xl    → inputs, dropdowns, buttons, table containers
rounded-lg    → small buttons, badges
rounded-full  → tags, pills, toggles, avatar
```

---

## 6. Component Patterns

### 6.1 Input Fields

Always visible, always editable:

```tsx
className="w-full pl-10 pr-3 py-2.5 rounded-xl
           bg-white/60 backdrop-blur-sm
           border border-black/10
           text-sm font-semibold text-black
           placeholder:text-black/30
           focus:border-black/30 focus:bg-white/80
           outline-none transition-all cursor-pointer"
```

Always prepend an icon at `left-3` with `pointer-events-none`.

### 6.2 Buttons

**Primary:**

```tsx
className="px-4 py-2 rounded-xl bg-black text-white font-semibold
           hover:bg-black/90 transition-all cursor-pointer
           disabled:opacity-50 flex items-center gap-2"
```

**Secondary:**

```tsx
className="px-4 py-2 rounded-xl bg-white border border-black/10
           text-black/70 font-semibold hover:bg-black/5
           transition-all cursor-pointer"
```

**Danger:**

```tsx
className="px-4 py-2 rounded-xl bg-red-600 text-white font-semibold
           hover:bg-red-700 transition-all cursor-pointer"
```

**Ghost/Link-style:**

```tsx
className="text-sm font-semibold text-blue-600 hover:text-blue-700
           hover:underline transition-colors cursor-pointer"
```

All buttons have `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.98 }}`.

### 6.3 Toggle Switches

Spring-animated, always:

```tsx
<motion.button
  onClick={handleToggle}
  className={cn(
    "relative w-12 h-6 rounded-full transition-all cursor-pointer",
    enabled ? "bg-green-500" : "bg-black/20",
  )}
>
  <motion.div
    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md"
    animate={{ left: enabled ? "26px" : "2px" }}
    transition={{ type: "spring", stiffness: 500, damping: 30 }}
  />
</motion.button>
```

### 6.4 Dropdown Menus

- Triggered by a styled button with `IconChevronDown` that rotates 180° when open
- `data-*-menu` attribute for click-outside detection
- Escape key closes all dropdowns
- Active option: `bg-black/5 text-black/90`
- Inactive option: `text-black/60 hover:bg-black/5`

```tsx
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  className="absolute top-full mt-2 bg-white border border-black/10 
             rounded-xl shadow-xl overflow-hidden z-50"
/>
```

### 6.5 Loading Spinners (inline)

```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
>
  <IconLoader2 className="w-4 h-4" />
</motion.div>
```

Always disable the parent button during loading with `disabled:opacity-50`.

### 6.6 Section Headers (always outside cards)

```tsx
<div className="flex items-center gap-2">
  <IconName className="h-5 w-5 text-black/40" />
  <h2 className="text-lg font-semibold text-black/90">Section Title</h2>
</div>
```

Then the card follows as a sibling element.

### 6.7 Floating Save / Discard Panel

For any page with editable fields:

```tsx
<AnimatePresence>
  {hasChanges && (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
    >
      <div
        className="flex items-center gap-3 px-6 py-4 rounded-2xl 
                      bg-black text-white shadow-2xl border border-white/10"
      >
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-sm font-semibold">Unsaved Changes</span>
        <div className="h-6 w-px bg-white/20" />
        {/* Discard + Save buttons */}
      </div>
    </motion.div>
  )}
</AnimatePresence>
```

### 6.8 Empty States

Every list or table that can be empty needs one:

```tsx
<div className="flex flex-col items-center justify-center py-20 text-center">
  <div className="w-16 h-16 rounded-full bg-black/5 flex items-center justify-center mb-4">
    <IconName className="w-8 h-8 text-black/20" />
  </div>
  <h3 className="text-lg font-semibold text-black/60 mb-2">Nothing here yet</h3>
  <p className="text-sm text-black/40">Helpful contextual message</p>
</div>
```

---

## 7. Motion & Animation

### 7.1 Page Entry

Every section animates in on mount. Use staggered delays:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
/>
// 0.1, 0.15, 0.2, 0.25... per section
// 0.03 to 0.05 per list item
```

### 7.2 Hover Lifts (stat cards)

```tsx
<motion.div
  whileHover={{ y: -4 }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
/>
```

### 7.3 List Item Slide

For quick links, nav items, and action buttons:

```tsx
whileHover={{ scale: 1.02, x: 4 }}
```

### 7.4 Section Transitions (AnimatePresence)

All tab/section content uses:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={activeSection}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
  />
</AnimatePresence>
```

### 7.5 Modal Entry

```tsx
initial={{ opacity: 0, scale: 0.9, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
exit={{ opacity: 0, scale: 0.9, y: 20 }}
transition={{ type: "spring", stiffness: 300, damping: 30 }}
```

### 7.6 Rules

- Every hover state has a visual response (scale, lift, background shift, or colour change)
- Spring physics for anything toggle-like
- Linear for spinners
- Never animate layout-breaking properties (width, height changes should be instant)

---

## 8. Public / Marketing Pages

These pages have a **different but consistent** design language. They share the same colour system and typography but use bolder composition.

### 8.1 Hero Section

- Full-viewport height (`min-h-screen`)
- Gradient mesh background or grain overlay — not flat white
- Oversized heading (`text-5xl` to `text-7xl`, `font-semibold`)
- Short punchy subheading (`text-xl text-black/60`)
- Two CTAs: primary (black) + secondary (outlined/ghost)
- Floating glass card(s) showing live data / product preview
- Animated blur orbs in background at large scale

```tsx
// Background treatment example
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  <div
    className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full 
                  bg-blue-100/40 blur-[120px]"
  />
  <div
    className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full 
                  bg-purple-100/30 blur-[120px]"
  />
</div>
```

### 8.2 Features Section

- Three or four columns, each a glass card
- Icon at top in a tinted rounded square
- Bold short title
- 2–3 line description in `text-black/60`
- Subtle hover lift
- Gradient separator above section with label

### 8.3 Game Modes / Product Cards

- Full-width showcase cards with image/illustration on right
- Alternating layout (image left, image right)
- Category tag (`text-[10px] uppercase tracking-widest`)
- Large title, description, feature list with `IconCheck`
- CTA button

### 8.4 Pricing

- Centered 3-column layout
- Middle/featured plan: `bg-black text-white` or `bg-gradient-to-br from-amber-50...`
- Feature list with check/cross icons
- Clear price in `font-mono`
- Most popular badge
- Tier upgrade language consistent with dashboard

### 8.5 Roadmap

- Vertical timeline on desktop, linear list on mobile
- Each item: category dot, title, description, status badge
- Status colours: green (done), blue (in progress), black/20 (planned)
- Glass card per milestone

### 8.6 Navigation (public)

```tsx
// Sticky, glass
className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl
           border-b border-black/5"
```

- Logo left, links centre, CTAs right
- Links: `text-sm font-semibold text-black/70 hover:text-black/90`
- Dropdown menus matching the system dropdowns above
- Mobile: full-screen overlay, same glass treatment

### 8.7 Footer

Four-column grid matching the sitemap structure:

```
Product          Resources        Company          Legal
──────────       ─────────        ───────          ─────
Features         Documentation    About Us         Terms of Service
Game Modes       API Reference    Careers          Privacy Policy
Pricing          Help Center      Contact          Cookie Policy
Roadmap          Blog             Site Map         Responsible Gaming
```

- `text-xs font-semibold text-black/40 uppercase tracking-wider` — column headers
- `text-sm font-semibold text-black/60 hover:text-black/90` — links
- Gradient separator above footer
- Logo + tagline + social icons in top row
- Copyright + legal line at very bottom in `text-xs text-black/40`

---

## 9. UX Behaviour Rules

### 9.1 Loading

- Every page must show `<LoadingLogo fullScreen size="lg" />` while data loads
- Individual actions use inline spinners, never full-page reloads
- Buttons disable (`disabled:opacity-50`) during async operations
- Loading text replaces normal button text (e.g. "Saving..." not just a spinner)

### 9.2 Feedback (Toasts)

Every user action that changes state must fire a toast:

```
success → green — confirmations, saves, completions
error   → red   — validation fails, server errors
warning → amber — reversible actions, caution states
info    → blue  — neutral feedback, toggles, info
```

Never show a toast for read-only actions (opening modals, viewing pages).

### 9.3 Forms & Validation

- Show validation inline, not just on submit
- Error state: `border-red-400 bg-red-50/50`
- Success state: `border-green-400`
- Neutral focused: `border-black/30 bg-white/80`
- Floating save panel appears as soon as `hasChanges` becomes true
- Discard resets all fields to `initialData`

### 9.4 Interactivity Contract

Everything that does something must feel interactive:

- All buttons: `cursor-pointer` + `whileHover` + `whileTap`
- All inputs: `cursor-pointer`
- All links: `cursor-pointer`
- All toggles: `cursor-pointer` + spring animation
- Hover states must be visible within 100ms

### 9.5 Click-Outside & Keyboard

- All dropdowns/menus: close on outside click using `data-*-menu` + `mousedown` listener
- All dropdowns/menus: close on `Escape`
- All modals: close on backdrop click + `Escape`
- Cleanup all event listeners in `useEffect` return

### 9.6 Accessibility Minimums

- All icon-only buttons: `title="Action Name"`
- All inputs: `<label>` element above (not placeholder-only)
- Labels: `text-xs font-semibold text-black/40 uppercase tracking-wider`
- Disabled states visually communicate unavailability (`opacity-50`)

---

## 10. Performance Patterns

```tsx
// Memoize all computed values
const filteredItems = useMemo(() => { ... }, [items, filter])
const stats = useMemo(() => { ... }, [data])

// Memoize all handlers
const handleSave = useCallback(() => { ... }, [deps])
const handleDelete = useCallback(() => { ... }, [deps])

// Change tracking
const hasChanges = useMemo(() =>
  field1 !== initial.field1 || field2 !== initial.field2,
  [field1, field2]
)
```

---

## 11. Iconography

**Library:** `@tabler/icons-react` exclusively.  
**Sizes:**

```
w-3 h-3   → micro-labels, decorative
w-4 h-4   → default inline (buttons, inputs, list items)
w-5 h-5   → section headers, nav items
w-6 h-6   → stat card icons
w-8 h-8   → empty states, large headers
```

**Colours:**

```
text-black/40   → decorative, label prefix
text-black/60   → interactive icons
text-black/90   → primary / active icons
text-{colour}   → semantic (green for success, red for danger etc.)
```

Never use `IconLoader3` — use `IconLoader2`.  
Never render icon names as text (e.g. "IconUser" in a button label).

---

## 12. Anti-Patterns (Never Do)

| ❌ Never                     | ✅ Always                                     |
| ---------------------------- | --------------------------------------------- |
| `font-medium`                | `font-semibold`                               |
| `bg-gradient-*` (old)        | `bg-gradient-to-br`                           |
| `bg-linear-to-*`             | `bg-gradient-to-*`                            |
| Flat `bg-gray-*` cards       | Glass morphism `bg-white/40 backdrop-blur-xl` |
| Hard-coded pixel values      | Tailwind spacing scale                        |
| Invisible placeholder text   | `placeholder:text-black/30`                   |
| Non-editable input fields    | All inputs editable with `text-black`         |
| Theme switch / dark mode     | Light only                                    |
| Icon names as strings in UI  | Actual rendered icons                         |
| Inline `style={}`            | Tailwind classes                              |
| `cursor-default` on buttons  | `cursor-pointer` always                       |
| Section headers inside cards | Section headers outside, sibling to card      |
| Select dropdowns (native)    | Custom animated dropdowns                     |
| Missing empty states         | Every list needs an empty state               |
| Missing loading state        | Every async action needs loading UI           |
| Missing toast feedback       | Every mutation needs a toast                  |
| `IconLoader3`                | `IconLoader2`                                 |

---

## 13. Quick Reference Checklist

For every new page, verify:

- [ ] `LoadingLogo` on page mount
- [ ] `DashboardHeader` (or equivalent public header) at top
- [ ] Gradient separators between all major sections
- [ ] Section headings outside cards with icon prefix
- [ ] All cards use glass morphism + top accent line
- [ ] All inputs: `text-black`, `placeholder:text-black/30`, `bg-white/60`
- [ ] All buttons: `cursor-pointer`, `whileHover`, `whileTap`, `disabled:opacity-50`
- [ ] Staggered entry animations on sections
- [ ] Toast notifications for all mutations
- [ ] Loading states for all async operations
- [ ] Empty state for every filterable list
- [ ] Click-outside + Escape for all dropdowns
- [ ] Floating save panel if page has editable fields
- [ ] `useCallback` for all handlers
- [ ] `useMemo` for all computed/filtered data
- [ ] No `font-medium`, no `neutral-*` colours, no `bg-linear-to-*`
