# School Identity System - Visual Placement Map

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DRAIS School Management                            │
└─────────────────────────────────────────────────────────────────────────────┘

DESKTOP LAYOUT (≥1024px)
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────┬───────────────────────────────────────────────────────┐
│                     │  Top Header (Sticky)                                  │
│ SIDEBAR             │ ┌───────────────────────────────────────────────────┐ │
│                     │ │ [Menu] [Search] ... [🌙] [🔔] [👤] [▼]           │ │
│ ┌─────────────────┐ │ └───────────────────────────────────────────────────┘ │
│ │ DRAIS Logo      │ │  School Identity Header                              │
│ │ v0.0.0018       │ │ ┌─────────────────────────────────────────────────┐ │
│ ├─────────────────┤ │ │ [🔷] School                    Visible always   │ │
│ │ SCHOOL          │ │ │      Greenfield High School                     │ │
│ │ IDENTITY        │ │ └─────────────────────────────────────────────────┘ │
│ │ ┌───────────────┤ │                                                      │
│ │ │ [GS] School  │ │                                                      │
│ │ │ Greenfield...│ │                                                      │
│ │ └───────────────┘ │                                                      │
│ │                   │                                                      │
│ ├─────────────────┤ │  Page Content Area                                   │
│ │ Navigation:     │ │ ┌──────────────────────────────────────────────────┐│
│ │ • Dashboard     │ │ │                                                  ││
│ │ • Students      │ │ │  Welcome to Greenfield High School              ││
│ │ • Attendance    │ │ │  ┌──────────────────────────────────────────┐   ││
│ │ • Payments      │ │ │  │ [GS]  Greenfield High School            │   ││
│ │ • Reports       │ │ │  │       Your school is fully configured    │   ││
│ │ • Settings      │ │ │  │       All features unlocked ✓            │   ││
│ │                 │ │ │  └──────────────────────────────────────────┘   ││
│ │ ...more...      │ │ │                                                  ││
│ │                 │ │ │  [Dashboard Charts & Content...]                ││
│ │                 │ │ │                                                  ││
│ └─────────────────┘ │ └──────────────────────────────────────────────────┘│
│                     │                                                      │
└─────────────────────┴───────────────────────────────────────────────────────┘


MOBILE LAYOUT (<768px)
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────┐
│ [≡] School Identity [🌙] [🔔] [👤]         │ ← Top Header
├─────────────────────────────────────────────┤
│ [GS] Greenfield...                          │ ← School ID Subheader
├─────────────────────────────────────────────┤
│                                             │
│  Welcome to Greenfield High School          │
│  ┌───────────────────────────────────────┐ │
│  │ [GS]  Greenfield High School          │ │
│  │       All features unlocked ✓         │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  [Dashboard content...]                     │
│                                             │
└─────────────────────────────────────────────┘


SETTINGS PAGE (Desktop)
═══════════════════════════════════════════════════════════════════════════════

┌─ Header ──────────────────────────────────────────────────────────────────┐
│  Settings | Configure your school's settings and preferences              │
└───────────────────────────────────────────────────────────────────────────┘

┌─ School Identity Card (PROMINENT) ────────────────────────────────────────┐
│                                                                             │
│  [GS]   Current School                                 Location            │
│         Greenfield High School        ✓ Configured     123 Education St   │
│         ✓ Active                      ✓ Ready          Learning City      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ Settings Tabs ────────────────────────────────────────────────────────────┐
│  [School Info] [Notifications] [Security] [Appearance] [Integrations] ... │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  School Info Content                                                       │
│  ┌──────────────────────┐  ┌──────────────────────┐                      │
│  │ School Name          │  │ Address              │                      │
│  │ Greenfield High...   │  │ 123 Education...     │                      │
│  │                      │  │                      │                      │
│  │ [Save Changes] [...]│  │ [...settings...]    │                      │
│  └──────────────────────┘  └──────────────────────┘                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Placement Details

### 1. **Sidebar School Identity** (Desktop Only)
```
Location: Left sidebar, below DRAIS logo
Visible: Always (sticky sidebar)
Size: Medium (10x10 badge + text label)
Content: School badge + school name
Purpose: Constant visual anchor
```

### 2. **Header School Identity** (Desktop)
```
Location: Top navigation bar, left of search
Visible: Always (sticky header)
Size: Medium (10x10 badge + abbreviated text)
Breakpoint: Hidden on tablet, shown on desktop
Purpose: Quick visual confirmation at all times
```

### 3. **Mobile School Identity** (Mobile & Tablet)
```
Location: Below main header, in separate section
Visible: Always when authenticated
Size: Medium badge (10x10)
Content: Name truncated with tooltip
Purpose: Ensures visibility on smaller screens
```

### 4. **Dashboard Welcome Banner** (All Sizes)
```
Location: Top of dashboard content (below setup alert if any)
Visible: Only when setup complete
Size: Full width with large badge (16x16)
Content: Large badge + "Welcome to [School]" message
Purpose: Immediate reassurance after setup
```

### 5. **Settings School Identity Card** (All Sizes)
```
Location: Top of settings page (above settings tabs)
Visible: Only when setup complete
Size: Large badge (16x16) + full layout
Content: School badge, name, address, status badges
Purpose: Comprehensive school overview for management
```

## Color & Style Consistency

```
School Badge Colors (all variants):
- Background: Linear gradient (blue-600 → indigo-600)
- Text: White, bold
- Shadow: Subtle shadow for depth

School Identity Box:
- Background: Light gradient (blue-50 → indigo-50)
- Dark Mode: Darker gradient with reduced opacity
- Border: Blue-200 (light), blue-800/50 (dark)

Welcome Banner:
- Background: Blue → Indigo → Purple gradient
- Text: White on gradient
- Border: Subtle, matching theme

Status Indicators:
- Complete: Green badge with checkmark
- Incomplete: Yellow/amber warning badge
```

## State Transitions

```
1. LOADING STATE (Initial Load)
   ├─ Skeleton loaders shown
   ├─ Gradual fade-in when data loads
   └─ No layout shift

2. NO SCHOOL (Incomplete Setup)
   ├─ Yellow warning badge
   ├─ "School setup incomplete" message
   ├─ No welcome banner
   └─ Setup link visible

3. SCHOOL CONFIGURED (Setup Complete)
   ├─ Full school identity displayed
   ├─ Welcome banner shows
   ├─ Settings card displays details
   └─ All features accessible

4. DATA REFRESH (After School Update)
   ├─ Context updates automatically
   ├─ UI re-renders with new data
   ├─ No page reload required
   └─ Smooth transition
```

## Responsive Behavior

```
DESKTOP (≥1024px):
├─ Sidebar: Full school identity with text
├─ Header: Full school identity
├─ Banner: Welcome banner visible
└─ Settings: Full school card

TABLET (768px - 1023px):
├─ Sidebar: Hidden (collapse available)
├─ Header: Abbreviated school name
├─ Banner: Welcome banner visible
└─ Settings: Full school card, adapted layout

MOBILE (<768px):
├─ Sidebar: Drawer (tap menu to show)
├─ Header: Subheader with school name
├─ Banner: Welcome banner full-width
└─ Settings: Full card, vertical layout
```

## Accessibility

```
✓ All components have proper ARIA labels
✓ School name shown as title attribute on mobile
✓ Color not the only indicator (uses icons + text)
✓ Sufficient contrast in light & dark modes
✓ Keyboard navigable
✓ Screen reader friendly
```

## Trust & Enterprise Feel

```
Design Goals Achieved:
✓ School name ALWAYS visible - never hidden
✓ Prominent placement - top-left priority
✓ Consistent - same display everywhere
✓ Trustworthy - data from database, not user input
✓ Professional - enterprise-grade styling
✓ Immediate - no clicks needed to see school name
✓ Responsive - works on all device sizes
✓ Accessible - full keyboard/screen reader support
```

## Future Multi-School Support

Current design is ready for:
```
1. School Switcher Dropdown
   ├─ Would replace school identity in header
   ├─ Show: Current school + dropdown arrow
   ├─ On click: List other schools user manages
   └─ Non-breaking change

2. School Administration
   ├─ Settings link to school details
   ├─ Change school name/address
   ├─ Update school profile
   └─ Already partially implemented

3. School Branding
   ├─ Upload school logo
   ├─ Replace badge initials with logo
   ├─ Customize colors (future)
   └─ Ready for extensibility
```
