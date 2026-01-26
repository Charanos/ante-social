# Ante Social - UI/UX Design System

**PROPRIETARY INFORMATION – DO NOT SHARE**

---

## Typography System

### Font Family

**Primary Font: Mona Sans**
- Used for all text, headings, body copy, and UI elements
- Variable font with multiple weights (200-900)
- Supports all Latin characters and special symbols

**Numerals & Monospace: JetBrains Mono**
- Used exclusively for:
  - Currency amounts (balances, stakes, payouts)
  - Transaction IDs
  - Countdown timers
  - Bet pools
  - Date/time stamps
  - Any numeric data display

### Font Implementation

```css
/* Import fonts */
@import url('https://fonts.googleapis.com/css2?family=Mona+Sans:wght@200;300;400;500;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

/* Base font family */
body {
  font-family: 'Mona Sans', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

/* Numeric/monospace elements */
.numeric,
.currency,
.amount,
.timer,
.transaction-id,
.pool-value {
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
}
```

### Font Scale

```
Display: 48px / 3rem (Mona Sans Bold)
Heading 1: 36px / 2.25rem (Mona Sans Bold)
Heading 2: 28px / 1.75rem (Mona Sans SemiBold)
Heading 3: 24px / 1.5rem (Mona Sans SemiBold)
Heading 4: 20px / 1.25rem (Mona Sans Medium)
Body Large: 18px / 1.125rem (Mona Sans Regular)
Body: 16px / 1rem (Mona Sans Regular)
Body Small: 14px / 0.875rem (Mona Sans Regular)
Caption: 12px / 0.75rem (Mona Sans Medium)
Micro: 10px / 0.625rem (Mona Sans Medium)

Numerals Large: 32px / 2rem (JetBrains Mono Bold)
Numerals Medium: 24px / 1.5rem (JetBrains Mono SemiBold)
Numerals: 16px / 1rem (JetBrains Mono Regular)
Numerals Small: 14px / 0.875rem (JetBrains Mono Regular)
```

---

## Color System

### Light Theme

**Primary Colors:**
```
Primary: #FF6B35 (Vibrant Orange)
Primary Hover: #E85A2A
Primary Active: #D14D1F

Secondary: #004E89 (Deep Blue)
Secondary Hover: #003D6D
Secondary Active: #002C51

Accent: #00D9FF (Cyan)
Accent Hover: #00C4E6
Accent Active: #00AFCC
```

**Neutral Colors:**
```
Text Primary: #1A1A1A
Text Secondary: #4A4A4A
Text Tertiary: #6B6B6B
Text Disabled: #9B9B9B

Background Primary: #FFFFFF
Background Secondary: #F8F9FA
Background Tertiary: #F0F1F3
Background Hover: #E8E9EB

Border: #D1D5DB
Border Light: #E5E7EB
Border Dark: #9CA3AF
```

**Semantic Colors:**
```
Success: #10B981
Success Background: #D1FAE5

Error: #EF4444
Error Background: #FEE2E2

Warning: #F59E0B
Warning Background: #FEF3C7

Info: #3B82F6
Info Background: #DBEAFE
```

### Dark Theme

**Primary Colors:**
```
Primary: #FF7B51 (Brighter Orange for dark bg)
Primary Hover: #FF8B65
Primary Active: #FF9B79

Secondary: #0066B8 (Brighter Blue)
Secondary Hover: #1A7ACC
Secondary Active: #338EE0

Accent: #00E5FF (Brighter Cyan)
Accent Hover: #1AEBFF
Accent Active: #33F0FF
```

**Neutral Colors:**
```
Text Primary: #F8F9FA
Text Secondary: #D1D5DB
Text Tertiary: #9CA3AF
Text Disabled: #6B7280

Background Primary: #0F0F0F
Background Secondary: #1A1A1A
Background Tertiary: #242424
Background Hover: #2E2E2E

Border: #2E2E2E
Border Light: #242424
Border Dark: #3A3A3A
```

**Semantic Colors:**
```
Success: #34D399
Success Background: #064E3B

Error: #F87171
Error Background: #7F1D1D

Warning: #FBBF24
Warning Background: #78350F

Info: #60A5FA
Info Background: #1E3A8A
```

### Theme Switcher Implementation

```jsx
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

const ThemeSwitcher = ({ theme, setTheme }) => {
  return (
    <motion.button
      className="theme-toggle"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 180 : 0,
          scale: theme === 'dark' ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="icon-wrapper"
      >
        {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
      </motion.div>
    </motion.button>
  );
};
```

---

## Animation & Transitions

### Framer Motion Configuration

**Page Transitions:**
```jsx
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.61, 1, 0.88, 1], // Custom easing
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.61, 1, 0.88, 1],
    },
  },
};
```

**Smooth Scroll:**
```jsx
import { motion, useScroll, useSpring } from 'framer-motion';

// Smooth scroll progress indicator
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
};

// Smooth scroll container
<motion.div
  style={{
    overflowY: 'scroll',
    scrollBehavior: 'smooth',
  }}
>
  {children}
</motion.div>
```

**Card Animations:**
```jsx
const cardVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
  },
};

<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  whileHover="hover"
  whileTap="tap"
>
  {/* Card content */}
</motion.div>
```

**Stagger Children:**
```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={itemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

**Button Interactions:**
```jsx
const buttonVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.95,
  },
};

<motion.button
  variants={buttonVariants}
  whileHover="hover"
  whileTap="tap"
>
  Place Bet
</motion.button>
```

**Number Counter Animation:**
```jsx
import { motion, useSpring, useTransform } from 'framer-motion';

const AnimatedNumber = ({ value }) => {
  const spring = useSpring(value, { 
    stiffness: 100, 
    damping: 30 
  });
  
  const display = useTransform(spring, current =>
    Math.round(current).toLocaleString()
  );

  return (
    <motion.span className="numeric">
      {display}
    </motion.span>
  );
};
```

---

## Loading States

### Custom Loading Spinner

```jsx
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 40, color = 'currentColor' }) => {
  return (
    <motion.div
      className="spinner-container"
      style={{ width: size, height: size }}
    >
      <motion.div
        className="spinner"
        style={{
          width: size,
          height: size,
          border: `3px solid transparent`,
          borderTopColor: color,
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
};
```

### Skeleton Loaders

**Card Skeleton:**
```jsx
import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <motion.div
      className="skeleton-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header skeleton */}
      <motion.div
        className="skeleton-element skeleton-title"
        animate={{
          backgroundColor: ['#E5E7EB', '#F3F4F6', '#E5E7EB'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ width: '60%', height: '24px', borderRadius: '4px' }}
      />
      
      {/* Body skeleton */}
      <div className="skeleton-body">
        <motion.div
          className="skeleton-element skeleton-line"
          animate={{
            backgroundColor: ['#E5E7EB', '#F3F4F6', '#E5E7EB'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1,
          }}
          style={{ width: '100%', height: '16px', borderRadius: '4px' }}
        />
        <motion.div
          className="skeleton-element skeleton-line"
          animate={{
            backgroundColor: ['#E5E7EB', '#F3F4F6', '#E5E7EB'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          style={{ width: '80%', height: '16px', borderRadius: '4px' }}
        />
      </div>
    </motion.div>
  );
};
```

**List Skeleton:**
```jsx
const SkeletonList = ({ count = 5 }) => {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className="skeleton-list-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.05,
          }}
        >
          <motion.div
            className="skeleton-avatar"
            animate={{
              backgroundColor: ['#E5E7EB', '#F3F4F6', '#E5E7EB'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.1,
            }}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
            }}
          />
          <div className="skeleton-content">
            <motion.div
              className="skeleton-text"
              animate={{
                backgroundColor: ['#E5E7EB', '#F3F4F6', '#E5E7EB'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1,
              }}
              style={{ width: '60%', height: '16px', borderRadius: '4px' }}
            />
            <motion.div
              className="skeleton-text"
              animate={{
                backgroundColor: ['#E5E7EB', '#F3F4F6', '#E5E7EB'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.1 + 0.1,
              }}
              style={{ width: '40%', height: '12px', borderRadius: '4px' }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
```

**Amount Loading:**
```jsx
const SkeletonAmount = ({ width = '120px' }) => {
  return (
    <motion.div
      className="skeleton-amount numeric"
      animate={{
        backgroundColor: ['#E5E7EB', '#F3F4F6', '#E5E7EB'],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        width,
        height: '32px',
        borderRadius: '6px',
        display: 'inline-block',
      }}
    />
  );
};
```

---

## 2FA Login Flow

### Login with 2FA

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TwoFactorLogin = () => {
  const [step, setStep] = useState('credentials'); // credentials, totp, backup
  const [code, setCode] = useState(['', '', '', '', '', '']);

  return (
    <AnimatePresence mode="wait">
      {step === 'credentials' && (
        <motion.div
          key="credentials"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Login to Ante Social</h2>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setStep('totp')}
          >
            Continue
          </motion.button>
        </motion.div>
      )}

      {step === 'totp' && (
        <motion.div
          key="totp"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Enter 6-Digit Code</h2>
          <p>From your authenticator app</p>
          
          <div className="totp-input-group">
            {code.map((digit, index) => (
              <motion.input
                key={index}
                type="text"
                maxLength="1"
                className="totp-input numeric"
                value={digit}
                onChange={(e) => {
                  const newCode = [...code];
                  newCode[index] = e.target.value;
                  setCode(newCode);
                  
                  // Auto-focus next input
                  if (e.target.value && index < 5) {
                    document.getElementById(`totp-${index + 1}`).focus();
                  }
                }}
                id={`totp-${index}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              />
            ))}
          </div>

          <motion.button
            className="link-button"
            onClick={() => setStep('backup')}
            whileHover={{ scale: 1.02 }}
          >
            Use backup code instead
          </motion.button>
        </motion.div>
      )}

      {step === 'backup' && (
        <motion.div
          key="backup"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          <h2>Enter Backup Code</h2>
          <p>Use one of your recovery codes</p>
          
          <input
            type="text"
            className="backup-code-input numeric"
            placeholder="ABC-123-DEF"
            maxLength="11"
          />

          <motion.button
            onClick={() => setStep('totp')}
            whileHover={{ scale: 1.02 }}
          >
            Back to authenticator
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

---

## Currency Display

### Multi-Currency Component

```jsx
const CurrencyAmount = ({ amount, currency, showConversion = false }) => {
  const formatAmount = (value, curr) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="currency-display">
      <motion.span
        className="amount numeric"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {formatAmount(amount, currency)}
      </motion.span>
      
      {showConversion && currency === 'KSH' && (
        <motion.span
          className="conversion-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          ≈ {formatAmount(amount / 132.45, 'USD')}
        </motion.span>
      )}
    </div>
  );
};
```

### Currency Switcher

```jsx
import { motion } from 'framer-motion';

const CurrencySwitcher = ({ currency, setCurrency }) => {
  return (
    <div className="currency-switcher">
      <motion.button
        className={currency === 'USD' ? 'active' : ''}
        onClick={() => setCurrency('USD')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="numeric">USD</span>
      </motion.button>
      
      <motion.div
        className="switcher-divider"
        initial={false}
        animate={{
          x: currency === 'KSH' ? 40 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      
      <motion.button
        className={currency === 'KSH' ? 'active' : ''}
        onClick={() => setCurrency('KSH')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="numeric">KSH</span>
      </motion.button>
    </div>
  );
};
```

---

## Payment Method Components

### M-Pesa Payment UI

```jsx
import { motion } from 'framer-motion';
import { Copy, CheckCircle } from 'lucide-react';

const MpesaPayment = ({ amount, currency, accountNumber }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="mpesa-payment"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3>M-Pesa Payment Instructions</h3>
      
      <div className="payment-steps">
        <motion.div
          className="step"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="step-number numeric">1</span>
          <span>Go to M-Pesa menu</span>
        </motion.div>
        
        <motion.div
          className="step"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="step-number numeric">2</span>
          <span>Select Lipa Na M-Pesa → Pay Bill</span>
        </motion.div>
        
        <motion.div
          className="step highlight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="step-content">
            <span className="step-number numeric">3</span>
            <div className="step-details">
              <span>Business Number</span>
              <div className="copyable-field">
                <span className="numeric">123456</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard('123456')}
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="step highlight"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="step-content">
            <span className="step-number numeric">4</span>
            <div className="step-details">
              <span>Account Number</span>
              <div className="copyable-field">
                <span className="numeric">{accountNumber}</span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(accountNumber)}
                >
                  <Copy size={16} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          className="step"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="step-number numeric">5</span>
          <span>Amount: <span className="numeric">{amount} {currency}</span></span>
        </motion.div>
      </div>
      
      <motion.div
        className="payment-timer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span>Complete within</span>
        <CountdownTimer duration={900} /> {/* 15 minutes */}
      </motion.div>
    </motion.div>
  );
};
```

### Crypto Payment UI

```jsx
const CryptoPayment = ({ amount, network, address }) => {
  const [qrCode, setQrCode] = useState(null);

  return (
    <motion.div
      className="crypto-payment"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3>Send {amount} {network}</h3>
      
      <div className="network-badge">
        <span className="numeric">{network}</span>
      </div>
      
      <motion.div
        className="qr-code"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* QR Code component */}
        <QRCodeCanvas value={address} size={200} />
      </motion.div>
      
      <div className="address-display">
        <label>Wallet Address</label>
        <div className="copyable-field">
          <span className="numeric address-text">{address}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Copy size={16} />
          </motion.button>
        </div>
      </div>
      
      <motion.div
        className="crypto-warning"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        ⚠️ Only send {network}. Other assets will be lost.
      </motion.div>
    </motion.div>
  );
};
```

---

## Responsive Breakpoints

```css
/* Mobile First */
$breakpoint-sm: 640px;   /* Small devices */
$breakpoint-md: 768px;   /* Tablets */
$breakpoint-lg: 1024px;  /* Laptops */
$breakpoint-xl: 1280px;  /* Desktops */
$breakpoint-2xl: 1536px; /* Large desktops */
```

---

## Component Examples

### Animated Balance Card

```jsx
const BalanceCard = ({ balance, currency }) => {
  return (
    <motion.div
      className="balance-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="balance-header">
        <span className="label">Available Balance</span>
        <CurrencySwitcher />
      </div>
      
      <motion.div
        className="balance-amount"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <AnimatedNumber value={balance} />
        <span className="currency numeric">{currency}</span>
      </motion.div>
      
      <div className="balance-actions">
        <motion.button
          className="primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Deposit
        </motion.button>
        <motion.button
          className="secondary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Withdraw
        </motion.button>
      </div>
    </motion.div>
  );
};
```

---

**CONFIDENTIAL PROPERTY OF ANTE SOCIAL**  
*UI/UX Design System Version 1.0 | January 2026*