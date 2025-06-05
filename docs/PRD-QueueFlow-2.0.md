
# QueueFlow 2.0  
Product Requirements Document (PRD)  
Version: 1.2  Status: Draft for stakeholder review  
Last updated: 4 June 2025  
Author: Syon Garrick  

────────────────────────────────────────────────────────────────────────
## 1 EXECUTIVE SUMMARY
QueueFlow 2.0 is an omni-channel appointment- and queue-management platform for
service-heavy organizations (government offices, health clinics, retail
branches, campuses). It lets customers book remotely or on-site, receive
interactive SMS / e-mail confirmations, and join either a virtual or physical
queue. Front-line staff handle arrivals in real time, while managers, power
users, and administrators gain deep analytics, rule configuration, and open
APIs. Version 2.0 closes key gaps with QLess, Waitwhile, Qmatic, and Skiplino by
adding:

  1. Virtual queue + PWA  
  2. Two-way SMS commands (R, LATE X, CANCEL)  
  3. AI-based wait-time & staffing prediction  
  4. Capacity-throttling engine  
  5. Post-visit CSAT / NPS surveys  
  6. Digital-signage feed (Now-Serving boards)  
  7. Phase 2: IVR booking & voice reminders  

────────────────────────────────────────────────────────────────────────
## 2 GOALS & SUCCESS METRICS

| Goal | KPI | 6-Month Target |
|------|-----|----------------|
| Reduce on-site wait time | Average wait (min) | 30% reduction |
| Improve customer experience | CSAT / NPS | ≥ 4.5 / 5 or NPS ≥ 50 |
| Lower no-show rate | % no-shows | ≤ 5% |
| Optimize staffing | Clerk idle time | 20% reduction |
| Platform adoption | Locations live | ≥ 90% of pilot sites |
| Reliability | Uptime SLA | ≥ 99.9% |

────────────────────────────────────────────────────────────────────────
## 3 PERSONAS

| Persona | Goals | Pain Points | Must-Have Features |
|---------|-------|-------------|-------------------|
| Customer / Visitor | Book easily, wait less, updates | Long lines, confusing check-in | Omni-channel booking, QR code, live wait, two-way SMS |
| Clerk / Receptionist | Serve next guest quickly | Manual calling, lobby crowding | Live queue list, call/complete buttons |
| Manager | Meet SLAs, resolve jams | Poor visibility | Dashboards, overrides, AI staffing hints |
| Power User | Keep data accurate | Tedious updates | CRUD data, capacity rules, template editor |
| Administrator | Secure, integrate, audit | Siloed systems | RBAC, API admin, workflow builder, logs |

────────────────────────────────────────────────────────────────────────
## 4 USER JOURNEYS

### 4.1 Remote Booking & Virtual Queue  
• Customer (web/PWA) selects location → service → slot/ASAP.  
• Capacity engine validates limits; SMS/e-mail sent with ticket ID + QR.  
• Live ETA countdown in PWA; AI predictor refreshes every 2 min.  
• Customer taps "I'm here" or scans QR at kiosk upon arrival.

### 4.2 Walk-In Kiosk Flow  
• Walk-in chooses service on kiosk, receives printed ticket + QR.  
• Ticket appears on lobby monitor; clerk calls when ready.

### 4.3 Manager Intervention  
• Manager sees wait-time spike; AI suggests opening counter; staff re-allocated.

### 4.4 Post-Visit Feedback  
• Status → Completed; CSAT/NPS survey sent; results feed analytics.

────────────────────────────────────────────────────────────────────────
## 5 FUNCTIONAL REQUIREMENTS

### 5.1 Booking & Capacity
| Ref | Requirement | Priority |
|-----|-------------|----------|
| B-01 | Web, PWA, kiosk, IVR, REST-API bookings | P0 |
| B-02 | "ASAP" virtual queue + future time slots | P0 |
| B-03 | Capacity/throttle rules per service×location×date | P0 |
| B-04 | Conflict detection & slot suggestions | P1 |
| B-05 | Payment handling out of scope (client systems handle) | P0 |

### 5.2 Messaging & Notifications
| Ref | Requirement | Priority |
|-----|-------------|----------|
| M-01 | Confirmation (ticket ID + QR) via SMS & e-mail | P0 |
| M-02 | Parse R, LATE X, CANCEL; queue updated ≤ 5 s (P95) | P0 |
| M-03 | Configurable reminders (24 h, 1 h, 10 min) | P1 |
| M-04 | i18n templates & WCAG 2.2 AA | P1 |
| M-05 | WhatsApp, push, voice reminders (Phase 2) | P2 |

### 5.3 Check-In & Queue
| Ref | Requirement | Priority |
|-----|-------------|----------|
| Q-01 | QR scan, ticket entry, or "I'm here" button | P0 |
| Q-02 | WebSocket feed for lobby Now-Serving displays | P0 |
| Q-03 | Clerk dashboard (list, call, status, notes) | P0 |
| Q-04 | Resource scheduling lock (rooms/agents) | P2 |

### 5.4 Roles & Permissions (RBAC)

| Tier | Core Rights | Additional Rights |
|------|-------------|------------------|
| Clerk | View/manage queue | — |
| Manager | Clerk + override capacity, analytics | Dashboards, AI hints |
| Power User | Manager + CRUD services/locations/users | Capacity rules, template editor |
| Admin | All rights | API keys, workflow builder, SSO, audit logs |

### 5.5 Analytics & AI
| Ref | Requirement | Priority |
|-----|-------------|----------|
| A-01 | Real-time widgets (queue, wait, abandon %, util) | P0 |
| A-02 | AI predictor (ETA + staffing) | P1 |
| A-03 | CSAT/NPS dashboards, export, BI webhook | P1 |
| A-04 | Scheduled e-mail reports | P2 |

### 5.6 Integrations & APIs
| Ref | Requirement | Priority |
|-----|-------------|----------|
| I-01 | REST + Webhooks for CRM/POS/signage | P0 |
| I-02 | OpenAPI 3.1 spec published | P1 |
| I-03 | Twilio SMS; IVR (Phase 2); Firebase/Expo push (P2) | P0 |
| I-04 | SAML/OIDC staff SSO | P1 |

### 5.7 Non-Functional Targets
- **Availability:** ≥ 99.9%
- **Performance:** API latency ≤ 300 ms (P95), SMS parse SLA ≤ 5 s (P95)
- **Security:** SOC 2 II, GDPR, HIPAA-ready
- **Scalability:** Scales to 500 concurrent kiosk sessions
- **Localization:** UTF-8 + RTL
- **Accessibility:** WCAG 2.2 AA

────────────────────────────────────────────────────────────────────────
## 6 TECHNICAL ARCHITECTURE (overview)
```
Front-end Clients → API Gateway (GraphQL) → Queue-Service (CQRS)
                      │                        ↘ WS Hub
                     Twilio SMS ↔ Messaging      Wait-Time AI
                      Postgres (RLS)             Synapse DW → Power BI
```

**Stack:** Node.js (TypeScript), React + Next.js, Python (AI)  
**Infra:** AWS EKS, RDS Postgres, Redis, Azure Synapse + Power BI

────────────────────────────────────────────────────────────────────────
## 7 ANALYTICS STACK
CDC (Debezium) → Kafka → Azure Synapse (column store)  
Transforms with dbt (nightly + micro-batches) → Power BI embedding.

────────────────────────────────────────────────────────────────────────
## 8 COMPETITIVE GAP MATRIX (excerpt)

| Capability | QueueFlow | QLess | Waitwhile | Qmatic | Skiplino |
|------------|-----------|-------|-----------|--------|----------|
| Omni-channel booking | Yes | Yes | Yes | Yes | Yes |
| Virtual queue / remote join | Yes | Yes | Yes | Yes | Yes |
| Two-way SMS | Yes | Yes | Yes | Limited | Yes |
| AI wait/staff prediction | Yes | Yes | No | Yes | No |
| Capacity auto-throttle | Yes | Yes | Yes | Yes | Yes |
| Post-visit CSAT/NPS | Yes | No | Yes | Yes | Yes |
| Digital-signage feed | Yes | Yes | Yes | Yes | Yes |
| Payments | External | Opt | Opt | Opt | Native |
| API / Webhooks | Yes | Yes | Yes | Yes | Yes |

────────────────────────────────────────────────────────────────────────
## 9 ROLE-PERMISSION ACL (detailed)

| Action | Clerk | Manager | Power User | Admin |
|--------|-------|---------|------------|-------|
| View queue & call customers | ✓ | ✓ | ✓ | ✓ |
| Edit appointment status / notes | ✓ | ✓ | ✓ | ✓ |
| Override capacity rules | — | ✓ | ✓ | ✓ |
| View analytics dashboards | — | ✓ | ✓ | ✓ |
| AI staffing recommendations | — | ✓ | ✓ | ✓ |
| Bulk edit services / locations | — | — | ✓ | ✓ |
| Manage user accounts & roles | — | — | ✓ | ✓ |
| Create / rotate API keys | — | — | — | ✓ |
| Configure workflows & webhooks | — | — | — | ✓ |
| Access audit logs | — | — | — | ✓ |

────────────────────────────────────────────────────────────────────────
## 10 API ENDPOINTS (v0.1 excerpt)

- `POST /v1/appointments` – Create booking
- `GET /v1/appointments/{id}` – Get booking + QR
- `POST /v1/appointments/{id}/check-in` – Check-in
- `POST /v1/sms/inbound` – Twilio webhook
- `GET /v1/queue/{locationId}` – Live queue feed (WS)
- `PATCH /v1/queue/{ticketId}` – Update status
- `GET /v1/analytics/summary` – KPI snapshot
- `POST /v1/admin/services` – Add/edit service
- `POST /v1/admin/capacity-rules` – Create rule
- `POST /v1/admin/api-keys` – Generate/revoke key

────────────────────────────────────────────────────────────────────────
## 11 MILESTONES / ROADMAP

- **15 Jul 2025** MVP Alpha – Core booking, clerk dashboard, SMS/e-mail
- **30 Aug 2025** Beta – Virtual queue, two-way SMS, manager analytics
- **15 Oct 2025** Release Candidate – Capacity rules, CSAT, signage
- **01 Dec 2025** GA Launch – 20 pilot sites live
- **Q1 2026** Phase 2 – IVR, push, WhatsApp, resource scheduling

────────────────────────────────────────────────────────────────────────
## 12 RISKS & MITIGATIONS

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| SMS cost spikes | High | Medium | Multi-provider, alerts |
| AI predictor inaccuracy | Med | Med | Simple model → iterate |
| Data-privacy compliance | High | Low | DPIA, encryption, DPAs |
| Kiosk hardware diversity | Med | Med | Responsive UI, device list |
| Two-way SMS latency breach | Med | Low | 5 s SLA, monitoring, failover |
| Change-mgmt at pilot sites | Med | High | Training, feedback loops |

────────────────────────────────────────────────────────────────────────
## 13 RESOLVED QUESTIONS

• Payments collected during booking? No – handled externally.  
• Mandatory comms channels? SMS + e-mail (WhatsApp/push later).  
• Analytics stack? Azure Synapse + Power BI.  
• SMS command parse SLA? ≤ 5 s (P95).

────────────────────────────────────────────────────────────────────────
## 14 APPENDICES

### 14.1 Next Sprint (2-week)  
- Virtual queue MVP (5 d)
- Two-way messaging (3 d)
- Wait-time predictor v1 (3 d)
- Capacity rules engine (4 d)
- CSAT module (2 d)
- Digital signage (2 d)
- QA buffer (3 d)

### 14.2 Lovable One-Shot Prompts (seven prompt texts)  
(Available on request.)

### 14.3 Glossary  
- **ASAP Queue** – virtual line
- **Ticket ID** – confirmation code
- etc.

────────────────────────────────────────────────────────────────────────
## 15 APPROVAL TABLE

| Name | Role | Decision | Date |
|------|------|----------|------|
| [ TBD ] | Product Owner | | |
| [ TBD ] | Engineering Lead | | |
| [ TBD ] | UX Lead | | |
| [ TBD ] | Compliance | | |

────────────────────────────────────────────────────────────────────────
**NEXT STEP:** circulate for sign-off at 10 June 2025 product-council meeting.
