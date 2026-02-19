# Ante Social - Social Betting Platform

Comprehensive social betting platform for the Kenyan market, supporting real-money transactions via M-Pesa and Crypto.

## 🚀 Features

- **Authentication**: Secure Login/Register with built-in 2FA support and Kenyan phone verification.
- **Multi-Currency System**: Support for USD and KSH with automatic daily limit tracking.
- **6 Unique Market Types**:
  - **Public**: Poll-Style, Betrayal Game, Reflex Reaction, Majority Prediction Ladder.
  - **Private Groups**: Winner Takes All, Odd One Out.
- **RBAC**: Robust Role-Based Access Control for Users and Admins.
- **Modern UI**: High-fidelity dashboard built with Tailwind CSS, Framer Motion, and JetBrains Mono for fintech-grade typography.

## 🛠️ Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database**: MongoDB via Prisma
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Currency**: USD / KSH integration

## 🏁 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Frontend Backend URL**:
   Set `BACKEND_API_URL=http://localhost:3001` in your root `.env` so NextAuth and `/api/*` proxy routes target the Nest API gateway.

## 📄 Documentation

Check the `docs` folder for detailed specifications:
- [API Specification](./docs/ante_social_api_specs.md)
- [Database Schema](./docs/ante_social_db_schema.md)
- [User Journey Flows](./docs/ante_social_user_flows_and_journey_flows.md)
