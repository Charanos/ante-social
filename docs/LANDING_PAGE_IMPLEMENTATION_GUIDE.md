# ante-social - Landing Page Implementation Guide

## Executive Overview

The ante-social landing page is the premium, "all-in-one" gateway to our social betting platform. It combines the "Atmosphere of bet and prestige" with a sleek, modern SaaS aesthetic. The goal is to convert visitors by showcasing the power of the dashboard—poll-style betting, virtual currency, and community leaderboards—wrapped in a high-end, monochromatic design.

**Key Characteristics:**

- **Aesthetic:** Premium Monochromatic (Black, Dark Grey, White). "All-in-one platform" vibe.
- **Typography:** **STRICTLY NO BOLD FONTS.** Use `font-medium` for emphasis and `font-medium` for body/subtitles.
- **Interactivity:** `cursor-pointer` MUST be on ALL clickable elements. Smooth `framer-motion` animations.
- **SEO Strategy:** Content derived directly from dashboard utility (Social Betting, Virtual Currency, Community).

---

## Table of Contents

1.  [Technology Stack](#-technology-stack)
2.  [Design System & Theme](#-design-system--theme)
3.  [Content & SEO Strategy](#-content--seo-strategy)
4.  [Page Structure & Components](#-page-structure--components)
5.  [Animations & Interactions](#-animations--interactions)
6.  [Routing & Navigation](#-routing--navigation)
7.  [Implementation Steps](#-implementation-steps)

---

## 💻 Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** TailwindCSS (v4)
- **Animations:** Framer Motion (v12)
- **Icons:** Lucide React
- **Fonts:** Inter / Outfit (Premium Sans-Serif)

---

## 🎨 Design System & Theme

### Color Palette

- **Backgrounds:** `#000000` (Pure Black), `#0A0A0A` (Deep Matte Black), `#111111` (Off-Black).
- **Text:** `#FFFFFF` (Pure White), `#E5E5E5` (Off-White), `#A3A3A3` (Muted Grey).
- **Accents:** Subtle glow effects (e.g., `shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]`).

### Typography (Strict Rules)

- **Headings:** `font-medium` (NOT Bold). Tracking tight (`-tracking-wider` or `-tracking-tighter`).
- **Body:** `font-medium`. High readability.
- **Forbidden:** `font-medium`, `font-extrabold`.

### UI Elements

- **Buttons:**
  - Primary: White bg, Black text, `font-medium`, `cursor-pointer`.
  - Secondary: Black bg, White border, `font-medium`, `cursor-pointer`.
- **Cards:** Dark glassmorphism (`bg-white/5 backdrop-blur-md border border-white/10`).
- **Cursor:** Ensure `cursor-pointer` class is added to every interactive element (buttons, links, cards).

---

## 📝 Content & SEO Strategy

Leveraging dashboard functionality for high-value keywords:

| Dashboard Feature        | SEO Keyword Focus                                | Headline Inspiration                       |
| :----------------------- | :----------------------------------------------- | :----------------------------------------- |
| **Poll-Style Betting**   | "Social Prediction Markets", "Community Betting" | "The Future of Social Prediction."         |
| **ante-social Points (MP)** | "Risk-Free Betting", "Virtual Currency Casino"   | "All the Thrill. None of the Risk."        |
| **Leaderboards**         | "Competitive Gaming", "Top Bettors"              | "Join the Hall of the Unreasonably Lucky." |
| **Market Creation**      | "Custom Bet Markets", "Create Your Own Wager"    | "You Set the Odds. You Run the Market."    |

---

## 🏗️ Page Structure & Components

### 1. Navigation (Navbar)

- **Style:** Fixed, Glassmorphism.
- **Items:** Features, Leaderboard, Community.
- **CTA:** "Launch Dashboard" (if logged in) or "Start Betting".

### 2. Hero Section ("The All-in-One Platform")

- **Headline:** "The only social betting platform you need." (Semibold).
- **Subheadline:** "Free easy-to-use tools built for players who want full control. Track your wins, climb the leaderboard, and master the market." (Medium).
- **Visual:** Large, tilted 3D-style screenshot of the Dashboard (Glass effect) floating in void.
- **CTA:** "Get Started for Free" (White pill button).

### 3. Feature Showcase (Bento Grid)

- **Card 1 (The Arena):** "Public Betting Markets". Image of active polls.
- **Card 2 (The Vault):** "Virtual Wallet Management". Image of MP balance.
- **Card 3 (The Fame):** "Daily Leaderboards". Image of top user ranks.
- **Animation:** Cards stagger in from bottom.

### 4. Social Proof / Testimonials

- **Title:** "What Players Are Saying".
- **Content:** Mock tweets/reviews about "Finally a fun way to bet without losing money".

### 5. Footer

- **Links:** Terms, Privacy, Twitter/X, Discord.
- **Copyright:** ante-social © 2025.

---

## ✨ Animations & Interactions

### Framer Motion

- **Hero Reveal:** Text fades up (`y: 20 -> 0`). Dashboard image floats slowly (`animate={{ y: [0, -20, 0] }}`).
- **Scroll:** Sections use `whileInView={{ opacity: 1, y: 0 }}` with `viewport={{ once: true }}`.

### Custom Scrollbar

- Thin, dark, unobtrusive.

---

## 🛣️ Routing & Navigation

- **Landing Page:** `/`
- **Dashboard:** `/dashboard`
- **Auth:** Redirects to `/dashboard` upon login.

---

## 📝 Implementation Steps

1.  **Refactor Routing:** Move `app/page.tsx` to `app/dashboard/page.tsx`.
2.  **Create Landing Page:** New `app/page.tsx`.
3.  **Implement Hero:** High-impact text + Dashboard Mockup.
4.  **Implement Features:** Bento grid using dashboard screenshots/abstractions.
5.  **Apply Polish:** Check for `font-medium` (remove) and `cursor-pointer` (add).
