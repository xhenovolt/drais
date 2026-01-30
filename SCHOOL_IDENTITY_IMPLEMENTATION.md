# School Identity System - Implementation Guide

## Overview

The school identity system makes the school name highly visible and trustworthy across the DRAIS platform. It provides users with immediate confirmation of which school they're managing.

## Components Created

### 1. **SchoolBadge** (`school-badge.jsx`)
Displays the school's initials in a colorful badge.

**Features:**
- Three size variants: `sm` (8x8), `md` (10x10), `lg` (16x16)
- Gradient background (blue → indigo)
- Shows first letter of each word in school name
- Tooltip with full school name on hover
- Dark mode support

**Usage:**
```jsx
import SchoolBadge from '@/components/school-badge';

<SchoolBadge size="md" />
```

### 2. **SchoolIdentityDisplay** (`school-identity.jsx`)
Shows school name + badge in a contained, styled box.

**Features:**
- Badge + school name together
- Desktop: Shows full school name with label
- Mobile: Compact display with tooltip
- Handles loading state with animation
- Shows warning if school setup incomplete
- Gradient background with border

**Usage:**
```jsx
import SchoolIdentityDisplay from '@/components/school-identity';

<SchoolIdentityDisplay />
```

### 3. **SchoolCompletionStatus** (`school-completion-status.jsx`)
Displays setup completion status with visual indicators.

**Features:**
- Green checkmark if complete
- Yellow warning if incomplete
- Contextual messaging
- Direct link to setup if needed
- Used in settings and status pages

**Usage:**
```jsx
import SchoolCompletionStatus from '@/components/school-completion-status';

<SchoolCompletionStatus />
```

## Integration Points

### 1. **Dashboard Layout** (dashboard-layout.jsx)

**Desktop Header:**
- School identity displayed in top navigation bar (left side)
- Always visible alongside search bar

**Desktop Sidebar:**
- Added below DRAIS logo
- Constant visual anchor for school affiliation

**Mobile Header:**
- Appears below main header for visibility
- School name visible in drawer header

### 2. **Dashboard Page** (dashboard/page.js)

**Welcome Banner (when setup complete):**
- Large badge + welcome message
- Gradient background (blue → indigo → purple)
- Shows message: "Welcome to [School Name]"
- Reinforces that all features are unlocked

**Setup Reminder (when incomplete):**
- Shows setup prompt if school info missing

### 3. **Settings Page** (settings/page.js)

**School Identity Card (top of page):**
- Large badge + school name + address
- Shows "Configured" and "Active" badges
- Location information displayed
- Visual confirmation of current school
- Responsive layout

### 4. **AuthContext** (contexts/AuthContext.js)

**Data Structure:**
- `isOnboardingComplete`: Boolean indicating setup status
- `school_name`: School name from database
- `school_address`: School address from database

**Added Method:**
- `refreshUser()`: Refetches school data from backend

## Data Flow

1. **Database → `/api/auth/me`**
   - Joins `users` → `schools` table
   - Returns `school_name`, `school_address`, `isOnboardingComplete`

2. **API → `AuthContext`**
   - Stored in React context state
   - Persisted to localStorage
   - Available to all dashboard pages

3. **React Components**
   - Components read from `useAuth()` hook
   - Automatically update when user state changes
   - Loading states handled gracefully

## Mobile Responsiveness

**Desktop (≥1024px):**
- Full school name visible in header
- School identity in sidebar
- Full welcome banner on dashboard

**Tablet (768px - 1023px):**
- Abbreviated school name in header
- Full details in settings cards
- Full welcome banner

**Mobile (<768px):**
- School name in separate header section
- Truncated display with tooltip
- Responsive welcome banner
- Full details in settings

## Light/Dark Mode

All school identity components support light/dark mode:
- Badge: Gradient works in both modes
- Background: Adaptive colors
- Text: High contrast in both modes
- Border: Themed appropriately

## Error Handling

**If School Setup Incomplete:**
- Shows yellow warning badge
- Message: "School setup incomplete"
- Prompts user to complete setup
- Prevents confusion about school identity

**If User Not Authenticated:**
- Components return `null`
- No error messages displayed
- Graceful degradation

**Loading State:**
- Skeleton loaders shown during auth check
- Prevents layout shift
- Smooth transition to real data

## Security & Trust

**Design Principles:**
1. **Always Visible**: School name never hidden or requires clicking
2. **Prominent Placement**: Top-left sidebar + header placement
3. **Consistent**: Same display across all pages
4. **Verified**: Data comes directly from database, not user input
5. **Current**: Refreshes automatically after setup

## Component Architecture

```
DashboardLayout (header & sidebar)
├── SchoolIdentityDisplay (header)
├── SchoolIdentityDisplay (sidebar)
└── Page Components
    ├── Dashboard
    │   └── Welcome Banner (SchoolBadge + text)
    ├── Settings
    │   └── School Identity Card
    └── Other Pages
        └── SchoolCompletionStatus (where relevant)
```

## Future Enhancement Ready

Current implementation supports future multi-school functionality:
- School switcher can be added to header dropdown
- `refreshUser()` method handles school changes
- Components designed for multiple school scenarios
- No breaking changes needed for expansion

## Testing Checklist

- [ ] School name visible on dashboard after setup
- [ ] School name visible on settings page
- [ ] Mobile: School name visible on mobile header
- [ ] Dark mode: All components render correctly
- [ ] Loading state: Skeleton shows before data loads
- [ ] Missing school: Warning shows if setup incomplete
- [ ] Page reload: School name persists
- [ ] School change: Name updates without page reload
- [ ] Mobile menu: School name visible in drawer
- [ ] Responsive: Layout adapts at all breakpoints
