# Comprehensive Icon Replacement: Lucide React → React Icons

**Date:** February 5, 2026  
**Task:** Replace all remaining lucide-react imports with react-icons equivalents  
**Libraries Used:** Fi (Feather), Io5 (Ionicons), Md (Material Design), Fa (FontAwesome)

---

## File 1: `src/app/register/page.tsx`

### Current Import

```tsx
import { Eye, EyeOff, LoaderPinwheel, ArrowRight } from "lucide-react";
```

### Replacement Icon Mapping

| Lucide Icon      | React Icons    | Library      | Usage Context                     | Notes                                                    |
| ---------------- | -------------- | ------------ | --------------------------------- | -------------------------------------------------------- |
| `Eye`            | `FiEye`        | Fi (Feather) | Show password toggle              | Standard eye icon, commonly used for password visibility |
| `EyeOff`         | `FiEyeOff`     | Fi (Feather) | Hide password toggle              | Matches Eye icon from Feather set                        |
| `LoaderPinwheel` | `FiLoader`     | Fi (Feather) | Loading spinner (form submission) | Spinning loader for async operations                     |
| `ArrowRight`     | `FiArrowRight` | Fi (Feather) | "Next" button or call-to-action   | Standard right arrow for navigation                      |

### New Import Statement

```tsx
import { FiEye, FiEyeOff, FiLoader, FiArrowRight } from "react-icons/fi";
```

### Implementation Notes

- All four icons have direct Feather equivalents
- `FiLoader` should be wrapped with `animate-spin` class for loading state (already implemented in existing code)
- Feather icons maintain the minimalist design aesthetic of the login form

---

## File 2: `src/app/login/page.tsx`

### Current Import

```tsx
import { Eye, EyeOff, LoaderPinwheel, ArrowRight } from "lucide-react";
```

### Replacement Icon Mapping

| Lucide Icon      | React Icons    | Library      | Usage Context               | Notes                              |
| ---------------- | -------------- | ------------ | --------------------------- | ---------------------------------- |
| `Eye`            | `FiEye`        | Fi (Feather) | Show password toggle        | Same as register page              |
| `EyeOff`         | `FiEyeOff`     | Fi (Feather) | Hide password toggle        | Consistent icon set                |
| `LoaderPinwheel` | `FiLoader`     | Fi (Feather) | Loading spinner during 2FA  | Should animate with `animate-spin` |
| `ArrowRight`     | `FiArrowRight` | Fi (Feather) | Navigation button (if used) | Standard arrow icon                |

### New Import Statement

```tsx
import { FiEye, FiEyeOff, FiLoader, FiArrowRight } from "react-icons/fi";
```

### Implementation Notes

- Identical to register page mapping
- Maintains visual consistency across authentication flows
- Apply `animate-spin` to `FiLoader` for loading state

---

## File 3: `src/app/dashboard/markets/page.tsx`

### Current Import

```tsx
import {
  TrendingUp,
  Users,
  Clock,
  Search,
  ArrowRight,
  Activity,
  Trophy,
  Filter,
} from "lucide-react";
```

### Replacement Icon Mapping

| Lucide Icon  | React Icons    | Library      | Usage Context                | Notes                            |
| ------------ | -------------- | ------------ | ---------------------------- | -------------------------------- |
| `TrendingUp` | `FiTrendingUp` | Fi (Feather) | Market performance indicator | Ascending trend line             |
| `Users`      | `FiUsers`      | Fi (Feather) | Participant count display    | Group/people icon                |
| `Clock`      | `FiClock`      | Fi (Feather) | Time remaining in market     | Countdown/duration indicator     |
| `Search`     | `FiSearch`     | Fi (Feather) | Search filter input          | Magnifying glass icon            |
| `ArrowRight` | `FiArrowRight` | Fi (Feather) | Call-to-action navigation    | "Join market" or similar         |
| `Activity`   | `FiActivity`   | Fi (Feather) | Recent activity indicator    | Pulse/activity line icon         |
| `Trophy`     | `FiAward`      | Fi (Feather) | Top performers or winners    | Achievement/award representation |
| `Filter`     | `FiFilter`     | Fi (Feather) | Filter markets by type       | Funnel icon for filtering        |

### New Import Statement

```tsx
import {
  FiTrendingUp,
  FiUsers,
  FiClock,
  FiSearch,
  FiArrowRight,
  FiActivity,
  FiAward,
  FiFilter,
} from "react-icons/fi";
```

### Implementation Notes

- **Trophy → FiAward**: Feather uses "Award" instead of "Trophy" but serves same visual purpose
- All icons are available in Feather set
- Maintains dashboard consistency with minimalist icon style
- Filter icon works well for dropdown/filter functionality

---

## File 4: `src/app/dashboard/markets/my-bets/page.tsx`

### Current Import

```tsx
import {
  Trophy,
  Clock,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Wallet,
  Filter,
  Search,
  Dot,
  LoaderPinwheel,
} from "lucide-react";
```

### Replacement Icon Mapping

| Lucide Icon      | React Icons    | Library      | Usage Context                | Notes                                 |
| ---------------- | -------------- | ------------ | ---------------------------- | ------------------------------------- |
| `Trophy`         | `FiAward`      | Fi (Feather) | Win rate display stat        | Achievement badge for wins            |
| `Clock`          | `FiClock`      | Fi (Feather) | Active bets timer            | Time remaining indicator              |
| `Check`          | `FiCheck`      | Fi (Feather) | Won/successful bet indicator | Checkmark for positive outcomes       |
| `X`              | `FiX`          | Fi (Feather) | Lost/failed bet indicator    | X mark for negative outcomes          |
| `ArrowRight`     | `FiArrowRight` | Fi (Feather) | Navigate to bet details      | Forward navigation                    |
| `TrendingUp`     | `FiTrendingUp` | Fi (Feather) | Net profit stat card         | Upward trend indicator                |
| `DollarSign`     | `FiDollarSign` | Fi (Feather) | Payment/earnings display     | Currency symbol                       |
| `Wallet`         | `FiWallet`     | Fi (Feather) | Total wagered stat           | Wallet/funds icon                     |
| `Filter`         | `FiFilter`     | Fi (Feather) | Filter bets by status        | Filtering functionality               |
| `Search`         | `FiSearch`     | Fi (Feather) | Search bets                  | Magnifying glass                      |
| `Dot`            | `FiCircle`     | Fi (Feather) | Status indicator bullet      | Small circular dot (use smaller size) |
| `LoaderPinwheel` | `FiLoader`     | Fi (Feather) | Active bet spinner           | Animated loading state                |

### New Import Statement

```tsx
import {
  FiAward,
  FiClock,
  FiCheck,
  FiX,
  FiArrowRight,
  FiTrendingUp,
  FiDollarSign,
  FiWallet,
  FiFilter,
  FiSearch,
  FiCircle,
  FiLoader,
} from "react-icons/fi";
```

### Implementation Notes

- **Dot → FiCircle**: Use `w-2 h-2` class to make it appropriately small as status indicator
- **LoaderPinwheel**: Already used in code with `animate-spin` class - maintain this
- All icons have proper Feather equivalents
- This file has the widest variety of icons - Feather set handles all of them well
- Status colors (blue/green/red) are applied via Tailwind classes, not icon colors

---

## File 5: `src/app/dashboard/notifications/page.tsx`

### Current Import

```tsx
import {
  Bell,
  Check,
  CheckCheck,
  Filter,
  TrendingUp,
  AlertCircle,
  DollarSign,
  Settings,
} from "lucide-react";
```

### Replacement Icon Mapping

| Lucide Icon   | React Icons     | Library      | Usage Context                     | Notes                                              |
| ------------- | --------------- | ------------ | --------------------------------- | -------------------------------------------------- |
| `Bell`        | `FiBell`        | Fi (Feather) | Notification bell icon            | Standard notification indicator                    |
| `Check`       | `FiCheck`       | Fi (Feather) | Single check for single item read | Mark as read indicator                             |
| `CheckCheck`  | `FiCheckCircle` | Fi (Feather) | Mark all as read button           | Double-check replacement (use checkmark in circle) |
| `Filter`      | `FiFilter`      | Fi (Feather) | Filter notifications by type      | Funnel icon                                        |
| `TrendingUp`  | `FiTrendingUp`  | Fi (Feather) | Portfolio update icon             | Trend indicator                                    |
| `AlertCircle` | `FiAlertCircle` | Fi (Feather) | Alert/warning notification        | Warning icon in circle                             |
| `DollarSign`  | `FiDollarSign`  | Fi (Feather) | Payment notification icon         | Currency/payment indicator                         |
| `Settings`    | `FiSettings`    | Fi (Feather) | System/settings notification      | Gear icon                                          |

### New Import Statement

```tsx
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiFilter,
  FiTrendingUp,
  FiAlertCircle,
  FiDollarSign,
  FiSettings,
} from "react-icons/fi";
```

### Implementation Notes

- **CheckCheck → FiCheckCircle**: Feather doesn't have "double check" but `FiCheckCircle` serves as a strong visual alternative for "all read" action
- Alternative for CheckCheck: `MdDoneAll` from Material Design (Md library) - use if circle variant doesn't fit UI
- All other icons map perfectly to Feather set
- Icons are used both inline and in notification cards - sizes vary from 3.5x3.5 to larger cards
- Color coding via Tailwind (emerald, amber, gray, slate) is applied separately

---

## File 6: `src/app/(marketing)/[...slug]/page.tsx`

### Current Import

```tsx
import { ArrowLeft } from "lucide-react";
```

### Replacement Icon Mapping

| Lucide Icon | React Icons   | Library      | Usage Context               | Notes                 |
| ----------- | ------------- | ------------ | --------------------------- | --------------------- |
| `ArrowLeft` | `FiArrowLeft` | Fi (Feather) | "Back Home" navigation link | Back button in header |

### New Import Statement

```tsx
import { FiArrowLeft } from "react-icons/fi";
```

### Implementation Notes

- Single icon replacement - simplest file
- Used in a text link with `w-4 h-4 mr-2` classes
- Maintains minimalist aesthetic of marketing page header

---

## File 7: `src/app/dashboard/admin/layout.tsx`

### Current Import

```tsx
import { LoaderPinwheel, ShieldAlert } from "lucide-react";
```

### Replacement Icon Mapping

| Lucide Icon      | React Icons       | Library      | Usage Context               | Notes                                       |
| ---------------- | ----------------- | ------------ | --------------------------- | ------------------------------------------- |
| `LoaderPinwheel` | `FiLoader`        | Fi (Feather) | Admin loading state         | Spinning loader during session check        |
| `ShieldAlert`    | `FiAlertTriangle` | Fi (Feather) | Security/permission warning | Shield with alert (alternative: `FiShield`) |

### New Import Statement

```tsx
import { FiLoader, FiAlertTriangle } from "react-icons/fi";
```

### Implementation Notes

- **ShieldAlert → FiAlertTriangle**: Feather doesn't have "shield alert" combo. `FiAlertTriangle` is stronger visual for warnings
- Alternative for ShieldAlert: `MdSecurityAlert` from Material Design library if shield appearance is critical
- `FiLoader` has `animate-spin` applied and `text-neutral-500` styling
- Used during authentication status checking - error state not currently rendered but `FiAlertTriangle` would be appropriate

---

## Summary Statistics

| Metric                                | Count        |
| ------------------------------------- | ------------ |
| **Total Files**                       | 7            |
| **Total Icons to Replace**            | 39           |
| **Feather (Fi) Icons**                | 37           |
| **Material Design (Md) Alternatives** | 2 (optional) |
| **Files with 100% Feather Coverage**  | 7 ✓          |

---

## Alternative Recommendations

### If Feather doesn't meet your aesthetic needs:

**For CheckCheck (File 5):**

```tsx
import { MdDoneAll } from "react-icons/md"; // Double checkmark icon
```

**For ShieldAlert (File 7):**

```tsx
import { MdSecurityAlert } from "react-icons/md"; // Shield with alert
// OR
import { IoShieldAlert } from "react-icons/io5"; // Ionicons alternative
```

---

## Implementation Checklist

- [ ] Replace File 1: `src/app/register/page.tsx`
- [ ] Replace File 2: `src/app/login/page.tsx`
- [ ] Replace File 3: `src/app/dashboard/markets/page.tsx`
- [ ] Replace File 4: `src/app/dashboard/markets/my-bets/page.tsx`
- [ ] Replace File 5: `src/app/dashboard/notifications/page.tsx`
- [ ] Replace File 6: `src/app/(marketing)/[...slug]/page.tsx`
- [ ] Replace File 7: `src/app/dashboard/admin/layout.tsx`
- [ ] Test all icon rendering across all pages
- [ ] Verify icon sizing and animations (especially spinners)
- [ ] Verify color application via Tailwind classes
- [ ] Run build test: `npm run build`

---

## Notes

- **Consistency**: All icons use the Feather (Fi) library for maximum visual consistency
- **Animation**: LoaderPinwheel → FiLoader with `animate-spin` Tailwind class
- **Sizing**: Feather icons scale predictably - maintain existing w-x h-x classes
- **Colors**: All colors applied via Tailwind classes, not icon prop - no changes needed to existing styling
- **Dependencies**: Ensure `react-icons` package is installed (`npm install react-icons`)
