# LyFind Admin Module Specification

## 📋 Overview
The Admin Module is a comprehensive dashboard for LSB administrators to manage the LyFind platform, monitor activity, moderate content, and maintain system integrity.

---

## 🎯 Admin Roles & Permissions

### Super Admin
- Full system access
- Manage other admins
- System configuration
- View all analytics
- Delete any content

### Moderator
- Review reported items
- Moderate user content
- Ban/suspend users
- View reports and analytics

### Support Staff
- View user issues
- Respond to support tickets
- View basic analytics
- Cannot delete content

---

## 🔐 Admin Authentication

### Access Requirements
- Must have `@lsb.edu.ph` email
- Role must be set to `admin`, `moderator`, or `support` in Firestore
- Two-factor authentication (optional but recommended)
- Separate admin login page: `/admin/login`

### Admin User Structure
```typescript
interface AdminUser extends UserProfile {
  role: 'admin' | 'moderator' | 'support';
  adminLevel: 'super' | 'standard';
  permissions: string[];
  lastAdminLogin: Timestamp;
  adminActions: number; // Track admin activity
}
```

---

## 📊 Dashboard Overview (`/admin/dashboard`)

### Key Metrics (Top Cards)
1. **Total Users**
   - Active users (logged in last 30 days)
   - New registrations (this week/month)
   - Growth rate

2. **Items Statistics**
   - Total items posted
   - Active items (lost/found breakdown)
   - Resolved items
   - Resolution rate

3. **Activity Metrics**
   - Messages sent today
   - Photo matches processed
   - Reports pending review

4. **System Health**
   - Firebase usage (storage, reads, writes)
   - API quota remaining
   - Error rate

### Charts & Graphs
- User registration trend (line chart)
- Items posted per day (bar chart)
- Lost vs Found ratio (pie chart)
- Peak usage hours (heatmap)
- Resolution time average (line chart)

---

## 👥 User Management (`/admin/users`)

### User List View
**Features:**
- Search by name, email, student ID
- Filter by:
  - Role (student, faculty, admin)
  - Status (active, suspended, banned)
  - Registration date
  - Activity level
- Sort by: name, join date, items posted, last active

**User Card Display:**
```
┌─────────────────────────────────────┐
│ 👤 Juan Dela Cruz                  │
│ juan.delacruz@lsb.edu.ph           │
│ Student ID: 2024-12345             │
│ ────────────────────────────────── │
│ Joined: Feb 15, 2024               │
│ Items Posted: 5 (3 lost, 2 found) │
│ Items Resolved: 2                  │
│ Messages: 24                       │
│ Last Active: 2 hours ago           │
│ ────────────────────────────────── │
│ [View Profile] [Suspend] [Ban]    │
└─────────────────────────────────────┘
```

### User Detail View
**Tabs:**
1. **Profile Info**
   - Personal details
   - Contact information
   - Account status
   - Edit profile button

2. **Activity Log**
   - Items posted (with links)
   - Messages sent
   - Reports made
   - Login history

3. **Posted Items**
   - All items with status
   - Quick actions (delete, mark resolved)

4. **Reports**
   - Reports made by user
   - Reports against user
   - Resolution status

5. **Actions**
   - Send warning email
   - Suspend account (temporary)
   - Ban account (permanent)
   - Delete account
   - Reset password

---

## 📦 Item Management (`/admin/items`)

### Item List View
**Features:**
- Search by title, description, location
- Filter by:
  - Type (lost/found)
  - Category
  - Status (active, resolved, archived)
  - Date posted
  - Has reports
- Bulk actions:
  - Mark as resolved
  - Archive multiple
  - Delete multiple

**Item Card Display:**
```
┌─────────────────────────────────────┐
│ 🎒 Blue Backpack          [LOST]   │
│ Posted by: Juan Dela Cruz          │
│ ────────────────────────────────── │
│ 📍 Library - 2nd Floor             │
│ 📅 Posted: Feb 20, 2024            │
│ 👁️ Views: 45 | 💬 Messages: 3     │
│ ⚠️ Reports: 0                      │
│ ────────────────────────────────── │
│ [View] [Edit] [Resolve] [Delete]  │
└─────────────────────────────────────┘
```

### Item Detail View
- Full item information
- All photos
- Location on map
- Match suggestions
- Message threads
- Edit capabilities
- Delete with confirmation

---

## 🚨 Reports & Moderation (`/admin/reports`)

### Report Types
1. **Inappropriate Content**
   - Offensive images
   - Inappropriate descriptions
   - Spam

2. **Suspicious Activity**
   - Fake items
   - Scam attempts
   - Duplicate posts

3. **User Behavior**
   - Harassment
   - Impersonation
   - Abuse of platform

### Report Queue
**Priority Levels:**
- 🔴 High (multiple reports, explicit content)
- 🟡 Medium (single report, suspicious)
- 🟢 Low (minor issues)

**Report Card:**
```
┌─────────────────────────────────────┐
│ 🚨 Report #1234            [HIGH]  │
│ Type: Inappropriate Content        │
│ ────────────────────────────────── │
│ Reported Item: Blue Backpack       │
│ Reported By: Maria Santos          │
│ Reason: Offensive image            │
│ Date: Feb 21, 2024 10:30 AM       │
│ ────────────────────────────────── │
│ [View Item] [View Reporter]        │
│ [Dismiss] [Remove Item] [Ban User] │
└─────────────────────────────────────┘
```

### Moderation Actions
- View reported content
- Review evidence
- Take action:
  - Dismiss report (false alarm)
  - Remove content
  - Warn user
  - Suspend user
  - Ban user
- Add moderation notes
- Track resolution

---

## 🤖 AI Photo Matching Management (`/admin/ai-matching`)

### Queue Management
- View all photo match requests
- Monitor processing status
- Retry failed matches
- View match accuracy
- Adjust similarity threshold

### Analytics
- Total matches processed
- Average processing time
- Success rate
- Most matched items
- False positive rate

### Configuration
- Similarity threshold (default: 70%)
- Max results per query
- Enable/disable auto-matching
- Queue priority settings

---

## 💬 Message Monitoring (`/admin/messages`)

### Overview
- Total conversations
- Messages sent today/week/month
- Average response time
- Flagged conversations

### Flagged Messages
**Auto-flagged for:**
- Spam keywords
- Suspicious links
- Harassment indicators
- Excessive messaging

**Actions:**
- Review conversation
- Warn users
- Restrict messaging
- Ban users

---

## 📈 Analytics & Reports (`/admin/analytics`)

### User Analytics
- Registration trends
- Active users over time
- User retention rate
- Demographics (if available)

### Item Analytics
- Items posted per day/week/month
- Lost vs Found ratio
- Most common categories
- Average resolution time
- Items by location (heatmap)

### Engagement Metrics
- Messages per user
- Photo matches per day
- Search queries
- Most viewed items

### System Performance
- Firebase usage
- Storage consumption
- API calls
- Error logs
- Response times

### Export Options
- CSV export
- PDF reports
- Date range selection
- Custom metrics

---

## ⚙️ System Settings (`/admin/settings`)

### General Settings
- Platform name
- Contact email
- Support links
- Maintenance mode

### Email Templates
- Welcome email
- Match notification
- Password reset
- Account suspension
- Item resolved

### Notification Settings
- Enable/disable notifications
- Notification frequency
- Email vs Push preferences

### Content Moderation
- Auto-moderation rules
- Banned words list
- Image scanning settings
- Report thresholds

### API Configuration
- Firebase settings
- AI service settings
- Map service settings
- Email service settings

### Security
- Session timeout
- Password requirements
- Two-factor authentication
- IP whitelist (optional)

---

## 📝 Activity Logs (`/admin/logs`)

### Admin Actions Log
- Who did what and when
- User modifications
- Content deletions
- System changes
- Export logs

### System Events Log
- Errors and warnings
- API failures
- Database issues
- Performance alerts

### User Activity Log
- Login attempts
- Failed authentications
- Suspicious activities
- Bulk actions

---

## 🔔 Notifications Center (`/admin/notifications`)

### Admin Notifications
- New reports (high priority)
- System alerts
- User appeals
- Threshold warnings (storage, API limits)

### Broadcast Messages
- Send announcement to all users
- Send to specific user groups
- Schedule messages
- Message templates

---

## 📱 Admin Mobile View

### Responsive Design
- Mobile-optimized dashboard
- Quick actions menu
- Priority notifications
- Essential metrics only

### Mobile-Specific Features
- Push notifications for urgent reports
- Quick approve/reject
- Voice notes for moderation
- Photo review swipe interface

---

## 🛡️ Security Features

### Access Control
- Role-based permissions
- Action logging
- Session management
- IP tracking

### Audit Trail
- All admin actions logged
- Immutable logs
- Regular backups
- Compliance reports

### Data Protection
- Encrypted sensitive data
- GDPR compliance tools
- Data export for users
- Right to be forgotten

---

## 🚀 Admin Dashboard Tech Stack

### Frontend
- React with TypeScript
- Recharts for analytics
- React Table for data tables
- React Query for data fetching

### Backend
- Firebase Firestore
- Cloud Functions for automation
- Firebase Admin SDK

### Free Tools/APIs
- **Charts:** Recharts (free)
- **Tables:** TanStack Table (free)
- **Export:** jsPDF, xlsx (free)
- **Notifications:** Firebase Cloud Messaging (free)

---

## 📋 Admin Workflows

### Daily Tasks
1. Review overnight reports
2. Check system health
3. Monitor user activity
4. Respond to support tickets

### Weekly Tasks
1. Generate analytics report
2. Review user growth
3. Check resolution rates
4. Update content policies

### Monthly Tasks
1. Comprehensive analytics review
2. User satisfaction survey
3. System optimization
4. Security audit

---

## 🎨 Admin UI Design

### Color Scheme
- Primary: #ff7400 (Orange)
- Success: #10b981 (Green)
- Warning: #f59e0b (Yellow)
- Danger: #ef4444 (Red)
- Background: #1a1a2e (Dark)

### Layout
- Sidebar navigation (collapsible)
- Top bar with search and notifications
- Main content area
- Quick actions floating button

### Components
- Data tables with sorting/filtering
- Modal dialogs for actions
- Toast notifications
- Confirmation dialogs
- Loading states

---

## 🔄 Future Enhancements

### Phase 2
- AI-powered content moderation
- Automated report classification
- Predictive analytics
- User behavior patterns

### Phase 3
- Mobile admin app
- Voice commands
- Advanced fraud detection
- Integration with campus security

---

## 📚 Admin Documentation

### Admin Guide
- Getting started
- Common tasks
- Best practices
- Troubleshooting

### Video Tutorials
- Dashboard overview
- User management
- Report handling
- Analytics interpretation

### FAQ
- Common questions
- Policy guidelines
- Escalation procedures

---

**Last Updated:** February 22, 2026  
**Version:** 1.0  
**Status:** Specification Complete
