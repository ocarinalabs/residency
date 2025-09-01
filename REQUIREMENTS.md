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