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