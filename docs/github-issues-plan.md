
# QueueFlow 2.0 GitHub Issues Plan

**Generated:** 2025-06-05  
**Milestone:** QueueFlow 2.0  
**Total Estimated Story Points:** 89 points

## Issue Creation Summary

### Phase 1 Issues (Priority P0/P1) - 34 points

#### 1. Kiosk Interface Implementation
- **Title:** [P0] Create walk-in kiosk interface for customer self-service
- **Labels:** `prd-v2`, `enhancement`, `size/L`
- **Estimate:** 8 points
- **References:** B-01, Q-01
- **Description:** Implement kiosk UI for walk-in customers to select services and receive tickets

#### 2. Digital Signage WebSocket Feed  
- **Title:** [P0] Implement WebSocket feed for lobby Now-Serving displays
- **Labels:** `prd-v2`, `enhancement`, `size/L`
- **Estimate:** 8 points
- **References:** Q-02
- **Description:** Real-time queue updates for digital signage boards

#### 3. REST API Endpoints
- **Title:** [P0] Build formal REST API endpoints matching PRD specification
- **Labels:** `prd-v2`, `enhancement`, `size/L`
- **Estimate:** 8 points
- **References:** I-01
- **Description:** Implement all v1 API endpoints for external integrations

#### 4. OpenAPI 3.1 Specification
- **Title:** [P1] Generate and publish OpenAPI 3.1 specification
- **Labels:** `prd-v2`, `documentation`, `size/M`
- **Estimate:** 5 points
- **References:** I-02
- **Description:** Auto-generated API documentation

#### 5. Enhanced AI Predictions
- **Title:** [P1] Enhance AI wait-time and staffing predictions
- **Labels:** `prd-v2`, `enhancement`, `size/M`
- **Estimate:** 5 points
- **References:** A-02
- **Description:** Real-time ETA updates every 2 minutes

### Phase 2 Issues (Priority P0/P1) - 32 points

#### 6. Two-way SMS Commands
- **Title:** [P0] Implement two-way SMS command parsing (R, LATE X, CANCEL)
- **Labels:** `prd-v2`, `enhancement`, `size/L`
- **Estimate:** 8 points
- **References:** M-02
- **Description:** Parse customer SMS responses and update queue ≤5s

#### 7. SAML/OIDC SSO Integration
- **Title:** [P1] Add SAML/OIDC staff single sign-on
- **Labels:** `prd-v2`, `enhancement`, `size/L`
- **Estimate:** 8 points
- **References:** I-04
- **Description:** Enterprise authentication for staff users

#### 8. Webhook System
- **Title:** [P0] Build webhook system for CRM/POS/signage integration
- **Labels:** `prd-v2`, `enhancement`, `size/L`
- **Estimate:** 8 points
- **References:** I-01
- **Description:** Outbound webhook delivery system

#### 9. Appointment Conflict Detection
- **Title:** [P1] Add conflict detection and slot suggestions
- **Labels:** `prd-v2`, `enhancement`, `size/M`
- **Estimate:** 5 points
- **References:** B-04
- **Description:** Prevent double-booking and suggest alternatives

#### 10. Analytics Dashboard Enhancement
- **Title:** [P0] Complete real-time analytics dashboard suite
- **Labels:** `prd-v2`, `enhancement`, `size/M`
- **Estimate:** 3 points
- **References:** A-01
- **Description:** Missing real-time widgets and metrics

### Phase 3 Issues (Priority P2) - 23 points

#### 11. WhatsApp Integration
- **Title:** [P2] Add WhatsApp messaging channel
- **Labels:** `prd-v2`, `enhancement`, `size/M`
- **Estimate:** 5 points
- **References:** M-05
- **Description:** WhatsApp Business API integration

#### 12. IVR Booking System
- **Title:** [P2] Implement IVR phone booking system
- **Labels:** `prd-v2`, `enhancement`, `size/L`
- **Estimate:** 8 points
- **References:** B-01, I-03
- **Description:** Phone-based appointment scheduling

#### 13. Voice Reminders
- **Title:** [P2] Add automated voice reminder system
- **Labels:** `prd-v2`, `enhancement`, `size/M`
- **Estimate:** 5 points
- **References:** M-05
- **Description:** Voice call reminders for appointments

#### 14. Scheduled Email Reports
- **Title:** [P2] Build automated email reporting system
- **Labels:** `prd-v2`, `enhancement`, `size/M`
- **Estimate:** 5 points
- **References:** A-04
- **Description:** Scheduled management reports

## Labels to Create
- `prd-v2` (QueueFlow 2.0 PRD implementation)
- `size/S` (1-3 points)
- `size/M` (4-6 points) 
- `size/L` (7-10 points)
- `enhancement`
- `documentation`

## Milestone Configuration
- **Name:** QueueFlow 2.0
- **Description:** Implementation of QueueFlow 2.0 PRD requirements
- **Due Date:** December 1, 2025
- **Total Issues:** 14
- **Total Story Points:** 89

## Sprint Breakdown Recommendation

### Sprint 1 (2 weeks) - 17 points
- Kiosk Interface (8 pts)
- Digital Signage Feed (8 pts) 
- OpenAPI Spec (1 pt setup)

### Sprint 2 (2 weeks) - 17 points
- REST API Endpoints (8 pts)
- Enhanced AI Predictions (5 pts)
- OpenAPI Spec completion (4 pts)

### Sprint 3 (2 weeks) - 16 points
- Two-way SMS Commands (8 pts)
- Webhook System (8 pts)

### Sprint 4 (2 weeks) - 16 points
- SAML/OIDC SSO (8 pts)
- Conflict Detection (5 pts)
- Analytics Enhancement (3 pts)

### Sprint 5-6 (4 weeks) - 23 points
- Phase 3 features (WhatsApp, IVR, Voice, Reports)

## Dependencies & Risks

### Technical Dependencies
1. Twilio account setup (SMS, Voice)
2. WhatsApp Business API approval
3. SAML/OIDC provider configuration
4. WebSocket infrastructure scaling

### Critical Path
1. REST API foundation → Webhooks → External integrations
2. SMS infrastructure → Two-way commands → Voice features
3. AI predictions → Analytics enhancement → Reporting

### Risk Mitigation
- Start with Twilio SMS setup in Sprint 1
- Parallel development of API and WebSocket systems
- Early user testing for kiosk interface
- Fallback plans for third-party service delays

## Success Criteria
- [ ] All 14 issues completed
- [ ] 95%+ PRD compliance achieved
- [ ] Performance targets met (TTI ≤2s, API ≤300ms)
- [ ] WCAG 2.2 AA compliance maintained
- [ ] Full test coverage for new features

---

**Next Step:** Create these issues in GitHub with proper labels, milestone assignment, and cross-references to gap analysis.
