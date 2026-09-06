# QueueFlow

QueueFlow is a virtual queue and appointment-management platform for
service-heavy organizations — government offices, health clinics, retail
branches, and campuses. Customers book remotely or check in on-site with a
QR code, staff run the floor from a live dashboard, and managers get
real-time analytics and CSAT feedback, all in one app.

This repository is the consolidated, most complete build of QueueFlow,
merged from several earlier prototypes into a single product codebase.

## Key Features

Everything below is implemented and working in this codebase (see
[`docs/gap-analysis.md`](docs/gap-analysis.md) for the full, itemized status
against the product requirements):

- **Virtual queue & remote booking** — customers join a queue or book a time
  slot from the web, with live position and wait-time updates
  (`src/components/queue/VirtualQueueJoin.tsx`)
- **QR check-in** — scan-to-check-in and ticket lookup at the door
  (`src/components/queue/QRCodeScanner.tsx`)
- **Role-based access control** — distinct Customer, Clerk/Staff, Manager,
  Power User, and Admin experiences enforced end-to-end
  (`src/context/AuthContext.tsx`, route guards in `src/components/ProtectedRoute.tsx`)
- **Staff dashboard** — live queue list, call/complete/no-show actions,
  appointment table, notifications, and keyboard shortcuts
  (`src/pages/StaffPage.tsx`)
- **Analytics & AI-assisted scheduling** — predictive demand/staffing
  dashboards plus a lightweight wait-time estimator and business-insights
  charts built on real appointment data
  (`src/components/admin/AdvancedAnalyticsTab.tsx`, `src/hooks/use-business-insights.ts`)
- **Post-visit CSAT surveys** — in-app customer satisfaction capture after
  each visit (`src/components/customer/CustomerSurveyModal.tsx`)
- **Document attachments** — staff can attach ID scans, forms, and other
  paperwork to an appointment via private, signed-URL storage
  (`src/components/documents/`)
- **Digital signage & kiosk modes** — lobby "Now Serving" display and a
  walk-in kiosk interface (`src/pages/DigitalSignagePage.tsx`, `src/pages/KioskPage.tsx`)
- **Internationalization** — English and Spanish out of the box, via
  i18next (`src/i18n/`)
- **Progressive Web App** — installable, offline-capable client
  (`vite-plugin-pwa`, `public/manifest.json`)

## Status

This build is approximately **65–70% of the way** to the full QueueFlow 2.0
product vision described in [`docs/PRD-QueueFlow-2.0.md`](docs/PRD-QueueFlow-2.0.md).
The core booking, check-in, staff, and analytics experience is real and
functional against a live Supabase backend. The most significant gaps —
two-way SMS commands, a formal public REST/webhook API, and enterprise SSO —
are documented with priority and effort estimates in
[`docs/gap-analysis.md`](docs/gap-analysis.md). See also
[`PITCH.md`](PITCH.md) for the product/market summary.

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix primitives)
- **State & data**: React Context, TanStack Query, SWR
- **Backend**: Supabase (Postgres, Auth, Row-Level Security, Storage, Edge Functions)
- **Charts**: Recharts
- **i18n**: i18next / react-i18next
- **Testing**: Vitest, React Testing Library
- **PWA**: vite-plugin-pwa

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm 9 or higher
- A Supabase project (for auth, database, and storage — see `supabase/` for
  schema migrations and edge functions)

### Installation

```sh
# Clone the repository
git clone <repository-url>
cd queueflow

# Install dependencies
npm install

# Configure environment: set your Supabase project URL and anon key in .env
# (see src/integrations/supabase/client.ts for the variables it expects)

# Start the development server
npm run dev
```

### Building & Linting

```sh
npm run build   # production build (dist/)
npm run lint     # ESLint
npm run preview  # preview the production build locally
```

### Testing

```sh
npm test              # run all tests
npm run test:watch    # watch mode
npm run test:ui       # Vitest UI
npm run test:coverage # coverage report
```

## Project Structure

```
src/
  components/   UI building blocks (landing, staff, admin, customer, documents, ui/*)
  context/      Auth and Queue React contexts
  hooks/        Data-fetching and business-logic hooks
  i18n/         Localization resources
  pages/        Route-level page components
  services/     API/service-layer helpers
supabase/
  migrations/   Database schema & RLS policy history
  functions/    Edge functions (metrics, reminders, SMS webhook, etc.)
docs/
  PRD-QueueFlow-2.0.md   Full product requirements document
  gap-analysis.md        Detailed status vs. the PRD, by feature
```

## Deployment

The app builds to static assets (`npm run build`) and is deployable to any
static host or CDN in front of the Supabase backend (Vercel, Netlify,
Cloudflare Pages, etc.).

## License

Proprietary. All rights reserved. This codebase and associated documentation
are prepared for sale/transfer; no license is granted for use, copying, or
distribution except as agreed in writing with the owner.
