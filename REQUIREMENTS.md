# Visitor Management System Requirements

## 🎯 Project Overview

A modern, clean visitor management system for the AI Residency at 500 Social House. This system provides a beautiful frontend interface that integrates with Nuveq's existing infrastructure while bypassing their paid API through web scraping and form submission techniques.

## 🏗️ Technical Architecture

### Core Principles
- **Frontend-First**: No self-hosted backend or database for privacy/safety
- **Nuveq Integration**: All data stored in Nuveq, accessed via web scraping
- **Serverless Functions**: Vercel functions for proxy/scraping logic only
- **Modern UI**: shadcn/ui components for beautiful, responsive design

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Library**: shadcn/ui (pre-installed components)
- **Styling**: Tailwind CSS v4
- **Backend Logic**: Vercel Serverless Functions
- **Data Source**: Nuveq (via web scraping/form submission)
- **Deployment**: Vercel

## 📋 Feature Requirements

### 👤 User Features

#### 1. Visitor Registration
- **Current Status**: ✅ Working (bypasses Nuveq account creation)
- **Fields**:
  - Full Name (required)
  - Email (required)
  - IC/Passport Number (required)
  - Phone Number (required)
  - Visit Date (required)
  - Start Time (required)
  - Vehicle Number (optional)
  - Reason to Visit (pre-filled: "Co-working @ 500 Social House")
  - Company (optional)
  - **NEW**: Room Selection (with photos)
  - **NEW**: Booking Duration

#### 2. Room Booking System
- **Visual Room Selection**: Display room photos for better understanding
- **Availability Checker**: Real-time availability from Nuveq data
- **Booking Duration**: Specify how long the room is needed
- **Room Information**:
  - Room name/number
  - Capacity
  - Amenities
  - Photo gallery
  - Current availability status

#### 3. Visitor Pass
- **Mobile-Optimized**: Responsive design for phones
- **QR Code**: Generate QR for easy scanning
- **Door Controls**: 4 buttons for different doors/gates
- **Pass Information**: Display visitor details and validity

### 👨‍💼 Admin Features (Dashboard)

#### 1. Dashboard Overview (`/dashboard`)
- **Authentication**: Simple password protection (environment variable)
- **Layout**: Modern, clean design using shadcn/ui components
- **Real-time Data**: Fetched from Nuveq via scraping

#### 2. Visitor Management
- **Visitor List View**:
  - Name, Email, Phone
  - **Invited By** field (who vouched for them)
  - Visit date/time
  - Status (Pending/Approved/Checked-in/Expired)
  - Room booked (if any)
- **Approval Workflow**:
  - Pending approvals queue
  - Bulk approve/reject
  - Add notes to visitor records
- **Access Control**:
  - Deactivate visitor access
  - Extend visit duration
  - Emergency lockout capability

#### 3. Analytics Dashboard
- **Daily Metrics**:
  - Total visitors today
  - Pending approvals count
  - Rooms occupied
  - Peak hours graph
- **Weekly/Monthly Views**:
  - Visitor trends
  - Most frequent visitors
  - Room utilization rates
  - Average visit duration

#### 4. Automation Features
- **Weekly Invitations**:
  - Schedule recurring invitations
  - Auto-approve trusted visitors
  - Send reminder emails
- **Capacity Management**:
  - Set maximum visitor limits
  - Auto-close registration when full
  - Waitlist management

#### 5. Room Management
- **Room Dashboard**:
  - Current occupancy status
  - Upcoming bookings
  - Availability calendar
- **Blocking Features**:
  - Block entire days/weeks
  - Block specific rooms
  - Maintenance scheduling
  - Special event reservations

## 🔄 Data Flow

### Registration Flow
```
User fills form → Vercel Function → Nuveq Form Submission → Success/Error
                                  ↓
                            Store in Nuveq
```

### Dashboard Data Flow
```
Dashboard Request → Vercel Function → Scrape Nuveq Portal → Transform Data → Display
                                    ↓
                              Cache temporarily
```

## 🔐 Security & Privacy

### Constraints
- **No Local Database**: All visitor data stays in Nuveq
- **No Personal Data Storage**: Only temporary caching in browser
- **Secure Scraping**: Server-side only, credentials in environment variables

### Authentication
- **Dashboard**: Password protection via environment variable
- **Future**: Consider adding Clerk for multi-user admin access

## 🎨 UI/UX Requirements

### Design Principles
- **Modern & Clean**: Minimalist design with good use of whitespace
- **Mobile-First**: All features work perfectly on mobile
- **Dark Mode**: Support for dark/light themes
- **Accessibility**: WCAG 2.1 AA compliance

### Key Components Needed
- **Dashboard Layout**: Sidebar navigation, header with user info
- **Data Tables**: Sortable, filterable, with pagination
- **Charts**: Line graphs for trends, bar charts for metrics
- **Status Badges**: Visual indicators for approval status
- **Action Buttons**: Clear CTAs for approve/reject/deactivate
- **Room Cards**: Visual cards with photos and availability

## 🚀 Implementation Phases

### Phase 1: Core Setup ✅
- [x] Archive old forms
- [x] Promote working form
- [x] Create requirements document

### Phase 2: User Features (Current)
- [ ] Add room selection to form
- [ ] Implement room photos display
- [ ] Add booking duration selector
- [ ] Improve mobile experience

### Phase 3: Scraping Infrastructure
- [ ] Design Nuveq portal scraping strategy
- [ ] Create login/session management
- [ ] Build data extraction functions
- [ ] Implement caching layer

### Phase 4: Dashboard Implementation
- [ ] Create dashboard route and layout
- [ ] Build visitor management interface
- [ ] Implement approval workflow
- [ ] Add analytics visualizations
- [ ] Create room management section

### Phase 5: Automation & Polish
- [ ] Weekly invitation automation
- [ ] Capacity management
- [ ] Email notifications (if needed)
- [ ] Performance optimization

## 🔧 Technical Implementation Details

### Nuveq Scraping Strategy
```typescript
// Vercel Function: /api/nuveq/scrape/visitors
1. Login to Nuveq portal (store session)
2. Navigate to visitors page
3. Parse HTML table data
4. Transform to JSON
5. Return to frontend

// Caching Strategy
- Cache in browser for 5 minutes
- Refresh on user action
- Show loading states
```

### Room Data Structure
```typescript
interface Room {
  id: string;
  name: string;
  capacity: number;
  photos: string[];
  amenities: string[];
  bookings: Booking[];
}

interface Booking {
  visitorId: string;
  date: string;
  startTime: string;
  duration: number; // in hours
  status: 'confirmed' | 'pending' | 'cancelled';
}
```

### Dashboard State Management
```typescript
// Use React Query or SWR for data fetching
// Local state for filters and UI
// No persistent storage needed
```

## 📝 Environment Variables

```env
# Nuveq Integration
NUVEQ_PORTAL_URL=https://nuveq.cloud
NUVEQ_USERNAME=admin_username
NUVEQ_PASSWORD=admin_password
NUVEQ_KEYTOKEN=fK2FBZ9WWr4lpa3U2dq2

# Dashboard Auth
DASHBOARD_PASSWORD=secure_password_here

# Optional Future
RESEND_API_KEY=for_email_notifications
```

## 🎯 Success Metrics

- **User Experience**:
  - Form completion rate > 90%
  - Mobile usage > 60%
  - Page load time < 2s

- **Admin Efficiency**:
  - Approval time < 1 minute
  - Dashboard load time < 3s
  - Zero manual data entry

- **System Reliability**:
  - 99.9% uptime
  - Graceful fallbacks if Nuveq is down
  - Error handling for all edge cases

## ⚠️ Known Limitations

1. **API Limitations**: Cannot use Nuveq's paid API features
2. **Scraping Fragility**: UI changes in Nuveq could break scraping
3. **Real-time Updates**: Limited to polling intervals
4. **Historical Data**: May be limited by Nuveq's data retention

## 🔮 Future Enhancements

- **AI Assistant**: Help with visitor inquiries
- **Facial Recognition**: For returning visitors (privacy permitting)
- **Integration**: Connect with calendar systems
- **Mobile App**: Native app for frequent visitors
- **Reporting**: Advanced analytics and insights

## 📚 Resources

- [Nuveq Portal](https://nuveq.cloud) - Source system
- [shadcn/ui Docs](https://ui.shadcn.com) - Component library
- [Next.js 15 Docs](https://nextjs.org/docs) - Framework
- [Vercel Functions](https://vercel.com/docs/functions) - Serverless

---

*Last Updated: 2025*
*System designed for frontend-first operation with Nuveq as the single source of truth*

# Nuveq System Endpoints Reference

## Base URL
- https://nuveq.cloud

## Visitor Management Endpoints
- https://nuveq.cloud/visitor/todays-visitors - Today's visitor list
- https://nuveq.cloud/visitor/future-visitors - Scheduled future visits
- https://nuveq.cloud/visitor/pending-visitors - Visitors awaiting approval
- https://nuveq.cloud/visitor/visitor-database - Complete visitor database
- https://nuveq.cloud/visitor/visitor-blacklist - Blocked visitors
- https://nuveq.cloud/visitor/visitor-report - Visitor reports/analytics
- https://nuveq.cloud/visitor/visitor-doors - Door access configuration
- https://nuveq.cloud/visitor/visitor-lifts - Lift/elevator access
- https://nuveq.cloud/visitor/site-settings - Site configuration

## System Monitoring
- https://nuveq.cloud/monitoring - System monitoring dashboard
- https://nuveq.cloud/door_status - Real-time door status
- https://nuveq.cloud/controller_status - Controller status
- https://nuveq.cloud/input_status - Input device status

## Access Control Configuration
- https://nuveq.cloud/sites - Site management
- https://nuveq.cloud/controller_groups - Controller grouping
- https://nuveq.cloud/controllers - Individual controllers
- https://nuveq.cloud/face_recognition_terminals - Facial recognition devices
- https://nuveq.cloud/interlock_groups - Interlock configurations
- https://nuveq.cloud/sync - Synchronization settings
- https://nuveq.cloud/intervals - Time intervals
- https://nuveq.cloud/schedules - Access schedules
- https://nuveq.cloud/access_groups - Access group management
- https://nuveq.cloud/lift_groups - Lift access groups

## Employee Management
- https://nuveq.cloud/employee/users - Employee user management
- https://nuveq.cloud/mobile_users - Mobile app users
- https://nuveq.cloud/employee/departments - Department structure
- https://nuveq.cloud/employee/positions - Position/role management

## Attendance & Time Tracking
- https://nuveq.cloud/v2/attendance/report - Attendance reports
- https://nuveq.cloud/v2/attendance/doors - Attendance door configuration
- https://nuveq.cloud/v2/attendance/shift - Shift management

## Reports & Logs
- https://nuveq.cloud/reports/events - Event logs
- https://nuveq.cloud/reports/alarms - Alarm history
- https://nuveq.cloud/reports/alarm_events - Alarm event details
- https://nuveq.cloud/reports/system_logs - System logs
- https://nuveq.cloud/reports/silent_cards - Silent card reports
- https://nuveq.cloud/reports/card_doors - Card-door access reports

## System Configuration
- https://nuveq.cloud/holidays - Holiday calendar
- https://nuveq.cloud/event_types - Event type definitions
- https://nuveq.cloud/shifts - Shift configurations
- https://nuveq.cloud/portal_users - Portal user management
- https://nuveq.cloud/roles - Role definitions
- https://nuveq.cloud/notification_groups - Notification settings
- https://nuveq.cloud/modules - Module management
- https://nuveq.cloud/v2/subscriptions - Subscription management

## Key Endpoints for Our Dashboard

### Priority 1 - Essential for MVP
1. `/visitor/todays-visitors` - Current visitors in building
2. `/visitor/pending-visitors` - Approval queue
3. `/visitor/future-visitors` - Upcoming visits
4. `/door_status` - Room availability (if rooms are tied to doors)

### Priority 2 - Enhanced Features
5. `/visitor/visitor-database` - Historical data for analytics
6. `/visitor/visitor-report` - Built-in analytics we can leverage
7. `/visitor/visitor-blacklist` - Security management

### Priority 3 - Advanced Features
8. `/reports/events` - Detailed activity logs
9. `/visitor/site-settings` - Configuration options
10. `/employee/users` - For "invited by" relationships

## Authentication Required
All endpoints require authentication. The login endpoint is likely:
- POST https://nuveq.cloud/login or
- POST https://nuveq.cloud/api/auth/login

## Notes
- All these endpoints are behind authentication
- We'll need to maintain session cookies for scraping
- Consider rate limiting to avoid detection
- Cache data aggressively to minimize requests