# QueueFlow — Elevator Pitch

## The Problem & The Opportunity

Every government office, health clinic, retail branch, and campus service
counter still runs on paper tickets, shouted names, and guesswork about wait
times. Customers hate lines they can't see the end of; staff waste time on
manual call-ups and status updates; managers have no real-time visibility
into where the bottlenecks are. Incumbent queue-management vendors — QLess,
Waitwhile, Qmatic, and Skiplino — have proven the market wants this solved,
but they're priced and packaged for large enterprise procurement cycles,
leaving small-to-mid-size service organizations underserved by a modern,
affordably-licensable alternative.

QueueFlow is a virtual queue and appointment-management platform that lets
customers book remotely or check in on-site with a QR code, gives staff a
live dashboard to run the floor, and gives managers real-time analytics and
CSAT feedback — the same core value proposition as the established players,
in a codebase a buyer can own outright, self-host, and extend. On the
feature axes that matter most to buyers evaluating this category —
omni-channel booking, virtual queueing, RBAC, CSAT capture, and analytics —
QueueFlow already matches or approaches the incumbents (see the competitive
gap matrix in `docs/PRD-QueueFlow-2.0.md`, section 8); it currently trails
them on two-way SMS control and formal partner APIs, both scoped and
estimated in `docs/gap-analysis.md`.

## Who It's For

- **Government offices** (DMV-style license/permit counters, licensing
  boards) needing fair, transparent queueing and audit-friendly RBAC
- **Health clinics** managing walk-in and scheduled patient flow with
  privacy-conscious document handling
- **Retail branches** and service counters wanting to cut perceived wait
  time and collect CSAT feedback per visit
- **Campuses** (registrar, financial aid, IT help desks) with multiple
  service types and staff pools sharing one lobby

The natural buyer is a small dev shop, systems integrator, or in-house team
that wants a working, real-backend (Supabase) queue-management product to
brand, extend, and deploy — rather than starting from zero.

## Current Status

This is a working, buildable product, not a mockup: real Supabase-backed
auth, RBAC, appointments, virtual queueing, QR check-in, staff dashboards,
predictive/business analytics, and CSAT capture all function today. Internal
assessment puts it at roughly **65–70% of the full QueueFlow 2.0 PRD**
(see `docs/PRD-QueueFlow-2.0.md` and `docs/gap-analysis.md` for the
line-by-line breakdown). The largest remaining gaps before an enterprise-grade
1.0 — two-way SMS commands, a published REST/webhook API, and SSO/SAML — are
well-understood, scoped, and estimated, not open questions.
