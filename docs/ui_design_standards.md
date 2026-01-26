# UI/UX Design Standards

## Overview

This document defines the design standards and patterns used throughout the ante-social platform to ensure consistency, premium aesthetics, and excellent user experience.

---

## 🎨 Design Principles

### 1. Premium Glassmorphism

All UI elements use a modern glassmorphic design with:

- Semi-transparent backgrounds
- Backdrop blur effects
- Subtle gradients
- Soft shadows

### 2. Consistent Typography

```css
/* Numerical Data */
font-family: 'monospace'
className="font-mono"

/* Interactive Elements */
cursor: pointer
className="cursor-pointer"

/* Headers */
font-weight: 600-700 (semibold-bold)
```

### 3. Color Coded Elements

- **Blue:** Financial amounts, buy-ins
- **Green:** Success, profits, pools
- **Purple:** Users, participants
- **Amber:** Warnings, time limits
- **Red:** Errors, losses, danger

---

## 📐 Component Patterns

### Stats Cards

Premium gradient stats cards with glassmorphic icons:

```tsx
<Card
  className="relative overflow-hidden border-none 
  bg-linear-to-br from-blue-50 via-white to-white 
  shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] 
  hover:shadow-lg transition-all cursor-pointer group"
>
  {/* Blur blob */}
  <div
    className="absolute -right-6 -top-6 h-24 w-24 
    rounded-full bg-blue-100/50 blur-2xl 
    transition-all group-hover:bg-blue-200/50"
  />

  <CardContent className="p-6 relative z-10">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-blue-900/60">Label</p>
        <p className="mt-2 text-3xl font-medium font-mono text-blue-900">
          {value}
        </p>
      </div>

      {/* Glassmorphic icon */}
      <div className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-sm">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </CardContent>
</Card>
```

### Visual Separators

Gradient horizontal rules with centered labels:

```tsx
<div className="flex items-center gap-4 mb-10">
  <div
    className="h-px flex-1 bg-linear-to-r 
    from-transparent via-neutral-200 to-transparent"
  />
  <h2
    className="text-xs font-medium text-neutral-400 
    uppercase tracking-wider"
  >
    Section Title
  </h2>
  <div
    className="h-px flex-1 bg-linear-to-r 
    from-transparent via-neutral-200 to-transparent"
  />
</div>
```

### Interactive Cards

Hover effects and transitions:

```tsx
<div
  className="p-6 rounded-xl border-2 border-neutral-200 
  bg-white hover:border-blue-500 hover:shadow-lg 
  transition-all cursor-pointer group"
>
  <h3 className="group-hover:text-blue-600 transition-colors">Card Title</h3>

  {/* Content */}
</div>
```

---

## 🎭 Animation Standards

### Page Transitions

```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.05 }}
>
  {/* Content */}
</motion.div>;
```

### Hover Effects

```tsx
<motion.button
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className="cursor-pointer"
>
  Click Me
</motion.button>
```

---

## 🔤 Typography Scale

```css
/* Display */
text-4xl font-bold      /* 36px, Hero headers */
text-3xl font-bold      /* 30px, Page titles */
text-2xl font-medium  /* 24px, Section headers */
text-xl font-medium   /* 20px, Card headers */
text-lg font-medium   /* 18px, Subsections */

/* Body */
text-base /* 16px, Default text */
text-sm   /* 14px, Secondary text */
text-xs   /* 12px, Labels, captions */

/* Monospace (Numbers) */
font-mono text-3xl  /* Large amounts */
font-mono text-2xl  /* Stats */
font-mono text-lg   /* Table values */
```

---

## 🎨 Color Palette

### Primary Colors

```css
/* Blue - Trust, Primary Actions */
bg-blue-50, text-blue-600, border-blue-200

/* Green - Success, Profit */
bg-green-50, text-green-600, border-green-200

/* Purple - Community, Social */
bg-purple-50, text-purple-600, border-purple-200

/* Amber - Warning, Time */
bg-amber-50, text-amber-600, border-amber-200

/* Red - Danger, Loss */
bg-red-50, text-red-600, border-red-200
```

### Neutral Scale

```css
bg-neutral-50   /* Backgrounds */
bg-neutral-100  /* Subtle fills */
bg-neutral-200  /* Borders */
text-neutral-400 /* Muted text */
text-neutral-600 /* Secondary text */
text-neutral-900 /* Primary text */
```

---

## 📱 Responsive Design

### Grid Layouts

```tsx
{
  /* Mobile: 1 column, Desktop: 4 columns */
}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">{/* Cards */}</div>;

{
  /* Mobile: 1 column, Desktop: 2 columns */
}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">{/* Cards */}</div>;
```

### Container Widths

```tsx
/* Full width with padding */
<div className="max-w-full mx-auto px-6">

/* Constrained width */
<div className="max-w-7xl mx-auto px-6">
```

---

## ✨ Special Effects

### Glassmorphism

```css
backdrop-blur-xl
bg-white/40
border border-white/50
shadow-2xl
```

### Neumorphism (Subtle)

```css
shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)]
```

### Gradients

```css
bg-linear-to-br from-blue-50 via-white to-white
bg-linear-to-r from-purple-600 via-pink-600 to-blue-600
```

---

## 🎯 Interactive States

### Buttons

```tsx
{
  /* Primary */
}
<button
  className="bg-neutral-900 hover:bg-neutral-800 
  text-white font-medium py-3 px-6 rounded-lg 
  shadow-lg hover:shadow-xl transition-all cursor-pointer"
>
  Action
</button>;

{
  /* Secondary */
}
<button
  className="border-2 border-neutral-200 bg-white 
  hover:bg-neutral-50 font-medium py-3 px-6 rounded-lg 
  transition-colors cursor-pointer"
>
  Cancel
</button>;

{
  /* Disabled */
}
<button
  disabled
  className="bg-neutral-300 text-neutral-500 
  cursor-not-allowed"
>
  Disabled
</button>;
```

### Form Inputs

```tsx
<input
  className="w-full px-4 py-3 rounded-lg 
  border-2 border-neutral-200 
  focus:border-blue-500 focus:outline-none 
  transition-colors font-mono"
/>
```

---

## 📋 Spacing System

```css
/* Padding */
p-2  /* 8px */
p-4  /* 16px */
p-6  /* 24px */
p-8  /* 32px */

/* Margin */
mb-4  /* 16px bottom */
mb-6  /* 24px bottom */
mb-10 /* 40px bottom */

/* Gap */
gap-2  /* 8px */
gap-4  /* 16px */
gap-6  /* 24px */
```

---

## ✅ Compliance Checklist

When creating new UI components, ensure:

- [ ] `font-mono` on all numerical values
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover effects on interactive cards
- [ ] Framer Motion animations for page loads
- [ ] Responsive grid layouts
- [ ] Visual separators between sections
- [ ] Glassmorphic icon containers
- [ ] Color-coded based on context
- [ ] Consistent spacing
- [ ] Accessible form labels

---

**Design consistency is key to premium UX!** 🎨
