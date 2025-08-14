# 500.korrectai.com - AI Visitor System Plan

## 🎯 Project Overview

Building a modern, beautiful visitor registration and access control system that interfaces with Nuveq's backend infrastructure. This system will replace the outdated Nuveq UI with a sleek, modern interface while maintaining full compatibility with their door control systems.

### What We're Building

- **Custom Visitor Registration Portal** - Beautiful form that collects visitor information
- **API Proxy Layer** - Server-side integration with Nuveq's systems
- **Digital Visitor Pass** - Mobile-friendly interface for door access control
- **Admin Dashboard** - Monitor visitor activity and manage access

### Why We're Building This

1. **Improved UX** - Nuveq's interface is outdated and not mobile-friendly
2. **Branding** - Align visitor experience with Korrect's modern brand
3. **Control** - Add features like analytics, logging, and custom workflows
4. **Speed** - Leverage MF2 stack for rapid development and deployment

## 🏗️ Technical Architecture

### Stack (MF2 - Move F\*cking Fast)

- **Frontend**: Next.js 15 with Turbopack, React 19, Tailwind CSS v4
- **UI Components**: shadcn/ui for beautiful, accessible components
- **Database**: Convex for real-time data and visitor logs
- **Authentication**: Clerk for admin access
- **Email**: Resend for visitor confirmations
- **Analytics**: PostHog for tracking usage
- **Deployment**: Vercel at 500.korrectai.com

### API Integration Strategy

```text
[Visitor] → [Our Form] → [Our API] → [Nuveq Backend]
                ↓            ↓
           [Convex DB]  [Email Service]
```

### Nuveq Endpoints

**Registration Form**
- Original: `https://nuveq.cloud/modules/visitors/regv.php?keytoken=8zyCek2N9hS5u2jcS1aC4E6KzO0`
- Our endpoint: `500.korrectai.com/` (registration form)
- API proxy: `/api/nuveq/register`

**Visitor Pass Page**
- Original: `https://nuveq.cloud/modules/visitors/visitor_pass.php?keyToken=vYxI6j1U2DxY74YvV4hL00pPKF14JUYfzH4D0Cymf`
- Our endpoint: `500.korrectai.com/pass/[keyToken]`
- API proxy: `/api/nuveq/door/[action]`

## 📱 Core Features

### Phase 1: MVP (Week 1)

- [ ] Beautiful registration form matching Korrect design
- [ ] API proxy to Nuveq registration endpoint
- [ ] Visitor pass page with door controls
- [ ] Basic error handling and validation

### Phase 2: Enhancement (Week 2)

- [ ] Admin dashboard with Clerk auth
- [ ] Visitor activity logs in Convex
- [ ] Email confirmations via Resend
- [ ] Mobile-optimized responsive design

### Phase 3: Advanced (Week 3)

- [ ] QR code generation for visitor passes
- [ ] Pre-registration for scheduled visits
- [ ] Analytics dashboard with PostHog
- [ ] Bulk visitor import

## 🔧 Implementation Details

### 1. Visitor Registration Flow

```typescript
// app/page.tsx - Beautiful registration form
// API Route: /api/nuveq/register

// Form submission
POST /api/nuveq/register {
  fullName: string        // Maps to Nuveq field name
  email: string          // Maps to Nuveq email field
  icPassport: string     // Maps to Nuveq IC/Passport field
  phoneNumber: string    // Maps to Nuveq phone field
}

// Proxy to Nuveq
→ POST https://nuveq.cloud/modules/visitors/regv.php?keytoken=8zyCek2N9hS5u2jcS1aC4E6KzO0
→ Store in Convex for audit trail
→ Send confirmation email via Resend
→ Return visitor pass URL with keyToken
```

### 2. Visitor Pass Interface

```typescript
// app/pass/[token]/page.tsx - Door control interface
// Example URL: 500.korrectai.com/pass/vYxI6j1U2DxY74YvV4hL00pPKF14JUYfzH4D0Cymf

// Parse keyToken from URL params
const keyToken = params.token

// Display 4 door control buttons
// Each button proxies to Nuveq's visitor_pass.php
POST /api/nuveq/door/open {
  keyToken: string
  doorId: 1 | 2 | 3 | 4
}

// Proxy to Nuveq
→ POST https://nuveq.cloud/modules/visitors/visitor_pass.php?keyToken=[token]
→ Handle door open/close commands
→ Log action in Convex
→ Return success/failure status
```

### 3. API Proxy Layer

```typescript
// app/api/nuveq/[...path]/route.ts
// Handle CORS and session management
// Forward requests to Nuveq endpoints
// Log all actions in Convex
```

### 4. Data Models (Convex Schema)

```typescript
visitors: {
  id: string
  fullName: string
  email: string
  icPassport: string
  phoneNumber: string
  registeredAt: timestamp
  keyToken?: string
  status: 'pending' | 'approved' | 'expired'
}

accessLogs: {
  visitorId: string
  action: 'register' | 'door_open' | 'door_close'
  doorId?: string
  timestamp: timestamp
  success: boolean
}
```

## 🚀 Deployment Strategy

1. **Development**: Local with `npm run dev` + `npx convex dev`
2. **Staging**: Deploy to staging.500.korrectai.com for testing
3. **Production**: Deploy to 500.korrectai.com
4. **DNS**: Configure CNAME record for subdomain

## 📊 Success Metrics

- Registration completion rate > 90%
- Mobile usage > 60%
- Door access success rate > 95%
- Page load time < 2 seconds
- Zero downtime deployments

## ⚠️ Risk Mitigation

### Technical Risks

- **Nuveq API Changes**: Abstract all Nuveq calls through proxy layer
- **Session Management**: Handle cookies/auth server-side
- **Rate Limiting**: Implement proper throttling
- **CORS Issues**: All requests through server-side proxy

### Legal/Compliance

- Ensure permission from Nuveq/building management
- Data privacy compliance (visitor information)
- Security audit for door access controls

## 📅 Timeline

**Week 1**: Core functionality (registration + door controls)
**Week 2**: Polish + admin features
**Week 3**: Advanced features + production deployment

## 🎨 Design Guidelines

- Match Korrect brand identity
- Mobile-first responsive design
- Dark mode support
- Accessibility (WCAG 2.1 AA)
- Loading states for all async operations

## 🔑 Environment Variables Required

```env
# Convex
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk (Admin Auth)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Resend (Email)
RESEND_API_KEY=

# Nuveq Integration
NUVEQ_BASE_URL=https://nuveq.cloud
NUVEQ_REGISTRATION_TOKEN=8zyCek2N9hS5u2jcS1aC4E6KzO0
NUVEQ_REGISTRATION_URL=https://nuveq.cloud/modules/visitors/regv.php
NUVEQ_VISITOR_PASS_URL=https://nuveq.cloud/modules/visitors/visitor_pass.php

# PostHog (Analytics)
NEXT_PUBLIC_POSTHOG_KEY=
```

## 📝 Notes

- This system acts as a modern frontend to Nuveq's existing infrastructure
- All door control commands are proxied, not replicated
- Visitor data is stored in both systems for redundancy
- Admin features are Korrect-only, not synced to Nuveq

## 🔍 Nuveq API Analysis

### Registration Form Fields
Based on the original form at `regv.php?keytoken=8zyCek2N9hS5u2jcS1aC4E6KzO0`:
- **Visitor Full Name** (Required)
- **Visitor Email Address** (Required)
- **Visitor I/C or Passport No.** (Required)
- **Visitor Phone Number** (Required)

### Visitor Pass Actions
The visitor pass page shows 4 door control buttons that trigger:
1. **Button 1**: Main entrance door
2. **Button 2**: Secondary door
3. **Button 3**: Emergency exit
4. **Button 4**: Parking gate

Each button sends a request to open/close the corresponding door using the visitor's keyToken.

## 🚦 Next Steps

1. **Reverse Engineering Phase**
   - Use browser DevTools to inspect Nuveq form submissions
   - Capture exact field names and request format
   - Test with Postman/Insomnia to verify API behavior
   - Document any session/cookie requirements

2. **Implementation Phase**
   - Set up environment variables
   - Build registration form UI with shadcn/ui
   - Implement API proxy with proper error handling
   - Create visitor pass interface with door controls
   
3. **Testing & Deployment**
   - Test end-to-end flow locally
   - Deploy to staging.500.korrectai.com
   - User acceptance testing
   - Production deployment to 500.korrectai.com

---

*Built with MF2 - Move F*cking Fast\*
