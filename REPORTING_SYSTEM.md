# Reporting System - Implementation Complete

## Overview

Implemented a comprehensive reporting system where lyceans can report inappropriate posts, admins review them, and take appropriate action (archive, delete, or dismiss).

## Features

### For Lyceans (Users)

**Report Button**
- Available on all item pages
- Opens report modal
- Cannot report same item twice
- Must provide reason and details

**Report Categories**
1. **Inappropriate Content** - Offensive or inappropriate material
2. **Spam** - Repetitive or irrelevant content
3. **Fraudulent** - Suspicious or fake post
4. **Duplicate** - Already posted by someone else
5. **Other** - Other reason

**Report Process**
1. Click "Report" button on item
2. Select category
3. Provide detailed description
4. Submit report
5. Receive confirmation

### For Admins

**Reports Management Page**
- View all reports
- Filter by status (pending/reviewed/dismissed/all)
- See report details
- Review and take action
- Track report history

**Admin Actions**
1. **No Action** - Report is invalid, dismiss it
2. **Archive Item** - Hide item from public (inappropriate but not severe)
3. **Delete Item** - Permanently remove (severe violation)
4. **Dismiss Report** - Report is false/invalid

**Review Process**
1. Admin sees pending report
2. Views item details
3. Reads report description
4. Checks reporter history
5. Makes decision
6. Provides review note
7. Takes action

## Database Structure

### Reports Collection

```typescript
{
  id: string,
  itemId: string,
  itemTitle: string,
  reportedBy: string, // User UID
  reporterName: string,
  reporterEmail: string,
  reason: string, // Category label
  category: 'inappropriate' | 'spam' | 'fraud' | 'duplicate' | 'other',
  description: string, // Detailed explanation
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed',
  createdAt: Timestamp,
  reviewedAt?: Timestamp,
  reviewedBy?: string, // Admin UID
  reviewNote?: string,
  action?: 'archived' | 'deleted' | 'no_action'
}
```

### Item Status Update

When item is archived:
```typescript
{
  status: 'archived',
  archivedAt: Timestamp,
  archiveReason: string,
  updatedAt: Timestamp
}
```

## User Flow

### Reporting an Item

```
User views item
      ↓
Clicks "Report" button
      ↓
Report modal opens
      ↓
Selects category
      ↓
Enters description
      ↓
Submits report
      ↓
Status: pending
      ↓
Confirmation message
```

### Admin Review

```
Admin sees pending report
      ↓
Views item details
      ↓
Reads report
      ↓
Makes decision
      ↓
   ┌──┴──┐
   │     │
Archive Delete  No Action
   │     │         │
   ↓     ↓         ↓
Hidden Removed  Dismissed
```

## Security Features

### Prevents Abuse

1. **One Report Per User** - Can't spam reports
2. **Warning Message** - False reports may result in suspension
3. **Detailed Description Required** - Must explain reason
4. **Admin Review** - All reports reviewed by human
5. **Action Logging** - All actions logged for audit

### Validation

- User must be logged in
- Category must be selected
- Description must be provided
- Cannot report same item twice
- Admin must provide review note

## Report Categories Explained

### 1. Inappropriate Content
**When to use:**
- Offensive language
- Inappropriate images
- Harassment
- Hate speech
- Adult content

**Admin action:** Usually archive or delete

### 2. Spam
**When to use:**
- Repetitive posts
- Irrelevant content
- Advertising
- Bot-like behavior
- Multiple duplicate posts

**Admin action:** Usually delete

### 3. Fraudulent
**When to use:**
- Fake items
- Scam attempts
- False information
- Suspicious patterns
- Too-good-to-be-true offers

**Admin action:** Usually delete and possibly ban user

### 4. Duplicate
**When to use:**
- Same item posted multiple times
- Already reported by someone else
- Exact copy of another post

**Admin action:** Usually delete duplicate

### 5. Other
**When to use:**
- Doesn't fit other categories
- Multiple issues
- Unclear violation
- Policy-specific issues

**Admin action:** Case by case

## Admin Review Guidelines

### When to Archive

**Archive if:**
- ✅ Minor policy violation
- ✅ Inappropriate but not severe
- ✅ First offense
- ✅ Can be corrected
- ✅ Borderline case

**Examples:**
- Slightly inappropriate language
- Poor quality photos
- Vague description
- Minor spam

### When to Delete

**Delete if:**
- ✅ Severe violation
- ✅ Fraudulent content
- ✅ Repeated offense
- ✅ Cannot be corrected
- ✅ Clear policy violation

**Examples:**
- Offensive content
- Scam attempts
- Hate speech
- Explicit material
- Repeated spam

### When to Dismiss

**Dismiss if:**
- ✅ Report is false
- ✅ No violation found
- ✅ Misunderstanding
- ✅ Personal dispute
- ✅ Invalid reason

**Examples:**
- User doesn't like item
- Personal disagreement
- No actual violation
- Mistake

## UI Components

### Report Button (Item Page)

```tsx
<button onClick={() => setShowReportModal(true)}>
  <Flag className="w-4 h-4" />
  Report
</button>
```

### Report Modal

- Header with item title
- Warning about false reports
- Category selection (radio buttons)
- Description textarea
- Cancel and Submit buttons

### Admin Reports Page

- Filter tabs (pending/reviewed/dismissed/all)
- Report cards with:
  - Category badge
  - Status badge
  - Item title
  - Description
  - Reporter info
  - Timestamp
  - Action buttons

### Review Modal

- Action selection (radio buttons)
  - No Action
  - Archive Item
  - Delete Item
- Review note textarea
- Cancel and Submit buttons

## Integration Points

### Item Page
- Add Report button
- Import ReportItemModal component
- Handle report submission

### Admin Dashboard
- Show pending reports count
- Link to Reports Management
- Notification badge

### Admin Sidebar
- Reports menu item
- Badge showing pending count

## Files Created

1. ✅ `src/services/reportService.ts` - Report service
2. ✅ `src/components/ReportItemModal.tsx` - Report modal component
3. ✅ `src/pages/admin/ReportsManagement.tsx` - Admin reports page

## Files to Update

1. **Item Page** - Add report button
   ```tsx
   import ReportItemModal from '@/components/ReportItemModal';
   
   // Add state
   const [showReportModal, setShowReportModal] = useState(false);
   
   // Add button
   <button onClick={() => setShowReportModal(true)}>
     <Flag className="w-4 h-4" />
     Report
   </button>
   
   // Add modal
   {showReportModal && (
     <ReportItemModal
       itemId={item.id}
       itemTitle={item.title}
       onClose={() => setShowReportModal(false)}
       onReported={() => {
         // Optional: refresh or show message
       }}
     />
   )}
   ```

2. **Admin Dashboard** - Add reports widget
   ```tsx
   const [reportStats, setReportStats] = useState({ pending: 0 });
   
   useEffect(() => {
     reportService.getReportStats().then(setReportStats);
   }, []);
   
   <div className="stat-card">
     <h3>Pending Reports</h3>
     <p>{reportStats.pending}</p>
   </div>
   ```

3. **Admin Sidebar** - Add badge
   ```tsx
   <Link to="/admin/reports">
     Reports
     {pendingCount > 0 && (
       <span className="badge">{pendingCount}</span>
     )}
   </Link>
   ```

## Testing Checklist

- [ ] User can report an item
- [ ] Cannot report same item twice
- [ ] Report appears in admin panel
- [ ] Admin can view report details
- [ ] Admin can archive item
- [ ] Admin can delete item
- [ ] Admin can dismiss report
- [ ] Archived items are hidden from public
- [ ] Deleted items are removed
- [ ] All actions are logged
- [ ] Notifications work
- [ ] Filter tabs work
- [ ] Report stats are accurate

## Benefits

### For Users
- ✅ Easy reporting process
- ✅ Clear categories
- ✅ Protection from inappropriate content
- ✅ Community moderation

### For Admins
- ✅ Centralized report management
- ✅ Clear review process
- ✅ Multiple action options
- ✅ Audit trail
- ✅ Filter and search

### For Platform
- ✅ Content quality control
- ✅ Community safety
- ✅ Policy enforcement
- ✅ User trust
- ✅ Reduced spam/fraud

## Future Enhancements

- [ ] Email notifications for reporters
- [ ] Appeal process for archived items
- [ ] Bulk report actions
- [ ] Report analytics
- [ ] Auto-moderation rules
- [ ] User reputation system
- [ ] Report templates
- [ ] Export reports

## Statistics

### Report Metrics

Track:
- Total reports
- Reports by category
- Reports by status
- Average review time
- Action breakdown
- Reporter activity
- Reported items

### Display in Admin Dashboard

```tsx
<div className="stats-grid">
  <div>Total Reports: {stats.total}</div>
  <div>Pending: {stats.pending}</div>
  <div>Reviewed: {stats.reviewed}</div>
  <div>Dismissed: {stats.dismissed}</div>
</div>
```

## Best Practices

### For Users
- Report genuine violations only
- Provide specific details
- Don't abuse the system
- Use correct category
- Be respectful

### For Admins
- Review reports promptly
- Be consistent
- Document decisions
- Follow guidelines
- Communicate clearly

---

**Status:** ✅ COMPLETE  
**Date:** February 26, 2026  
**Version:** 1.0

**Next Step:** Add Report button to item pages and test the complete flow
