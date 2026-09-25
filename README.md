# MARK Architects Atelier

A high-performance architectural practice web application and client portal built with Next.js 16, React 19, Tailwind CSS, Supabase, and Safepay.

---

## 🔐 Admin Portal & Fixed Secret URL

For security against automated bot scanners, reconnaissance, and unauthorized login attempts, the **Admin Dashboard** and **Sign-In Portal** live on a dedicated, fixed secret route:

### How to Access the Admin Dashboard

Access the administrative portal directly at the fixed URL:

#### **Local Development:**

```
http://localhost:3000/markarchit/admin
```

_Or directly to the sign-in screen:_

```
http://localhost:3000/markarchit/admin/login
```

#### **Production:**

```
https://yourdomain.com/markarchit/admin
```

---

### How the Secret Route Security Works

1. **Fixed Dedicated Path (`/markarchit/admin`)**:
   - The admin dashboard is mapped to `/markarchit/admin` (and sign-in at `/markarchit/admin/login`).
   - If not signed in, accessing `/markarchit/admin` automatically directs you to `/markarchit/admin/login`.
   - Once authenticated with your admin credentials, you can bookmark and navigate the portal freely.

2. **Legacy `/admin` Cloaking**:
   - Anyone attempting to access standard `http://localhost:3000/admin`, `/admin/login`, or any `/admin/*` subpath is **immediately redirected to the public homepage (`/`)**.
   - To automated vulnerability bots and unauthorized outside visitors probing for `/admin`, the portal appears completely non-existent.

3. **Sign Out**:
   - Click the **"Sign Out"** button in the top-right corner of the admin header to end your active session and return to `/markarchit/admin/login`.

---

## Tech Stack

- **Framework**: Next.js 16.2.9 (App Router, Turbopack, `proxy.ts` middleware)
- **UI & Animation**: React 19, Tailwind CSS v4, Framer Motion, Lucide Icons, GSAP, Lenis Smooth Scroll
- **Database & Auth**: Supabase (PostgreSQL, Row-Level Security, Supabase Auth SSR)
- **Payments**: Safepay Payment Gateway (Checkout SDK & Reporter API)
- **Calendar & Meetings**: Google Cloud OAuth 2.0 (Google Calendar API & Google Meet)
- **Transactional Emails**: Resend API
- **State Management**: Zustand (with persistent local storage for order history and cart items)

---

## Getting Started

### 1. Prerequisites

- Node.js (v20+ recommended)
- npm or yarn

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd "Mark Architecture"
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

Key environment variables:

| Variable                                    | Description                                            |
| :------------------------------------------ | :----------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                  | Supabase project URL                                   |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`      | Supabase client anon key                               |
| `SUPABASE_SERVICE_ROLE_KEY`                 | Supabase service role key (backend workflows/webhooks) |
| `ADMIN_EMAIL`                               | Single-admin authorized email address                  |
| `ADMIN_ACCESS_KEY`                          | Secret URL query key required to unlock `/admin`       |
| `SAFEPAY_API_KEY`                           | Safepay Public Key                                     |
| `SAFEPAY_V1_SECRET`                         | Safepay Secret Key                                     |
| `RESEND_API_KEY`                            | Resend API key for transactional consultation emails   |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth for Google Meet creation            |

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the client-facing atelier.

To access the admin portal:
[http://localhost:3000/markarchit/admin](http://localhost:3000/markarchit/admin)

---

## 🧪 Testing & Quality Assurance

Run the automated test suite covering security, timezone handling, payment callbacks, email templates, and the admin gatekeeper:

```bash
node --test scripts/tests/*.mjs
```

Verify TypeScript types across the entire codebase:

```bash
npx tsc --noEmit
```

---

## 📁 Key Directory Structure

```
├── app/
│   ├── (public)/             # Home, About, Portfolio, Services, Pricing, Collection, FAQs
│   ├── markarchit/admin/     # Admin Portal (Protected Secret URL & Supabase Auth)
│   │   ├── (dashboard)/      # Main Dashboard Tabs (Projects, Orders, Availability, etc.)
│   │   ├── login/            # Admin Sign-In Screen
│   │   └── reset-password/   # Admin Password Reset Screen
│   ├── api/                  # API routes (Admin endpoints, Checkout, Safepay webhooks, Lock)
│   ├── layout.tsx            # Global Root Layout
│   └── sitemap.ts            # Dynamic XML Sitemap Generator
├── components/
│   ├── admin/                # Admin Dashboard Components & AdminHeader
│   ├── home/                 # Hero section, 3D viewports, and showcase components
│   ├── navigation/           # Public Header & Mobile Navigation
│   ├── footer/               # Atelier Footer
│   └── ui/                   # Reusable UI controls, modals, and toasts
├── lib/
│   └── server/
│       ├── adminGatekeeper.ts # URL Secret Key Verification & Token Signatures
│       ├── adminAuth.ts       # Supabase Admin Session Verification
│       ├── safepay.ts         # Safepay Payment Gateway Verification
│       └── consultationWorkflow.ts # Appointment booking and order fulfillment
├── proxy.ts                  # Next.js 16 Proxy / Request Interceptor
└── utils/
    └── supabase/
        ├── middleware.ts     # Gatekeeper URL Key Interception & SSR Cookie Handler
        ├── client.ts         # Browser Supabase Client
        └── server.ts         # Server Component Supabase Client
```

---

## 📄 License & Intellectual Property

© 2026 MARK Architects Pvt. Ltd. All rights reserved. Registered with PCATP (Pakistan Council of Architects and Town Planners).
