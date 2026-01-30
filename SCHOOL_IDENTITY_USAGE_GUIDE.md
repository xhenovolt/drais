# School Identity Components - Developer Usage Guide

## Quick Reference

### Import School Components
```jsx
// Main component (used in layout)
import SchoolIdentityDisplay from '@/components/school-identity';

// For badges
import SchoolBadge from '@/components/school-badge';

// For status pages
import SchoolCompletionStatus from '@/components/school-completion-status';

// Get school data from anywhere
import { useAuth } from '@/contexts/AuthContext';
```

---

## Component Examples

### 1. SchoolIdentityDisplay

**Location**: Dashboard header, sidebar, mobile subheader

**Usage**:
```jsx
import SchoolIdentityDisplay from '@/components/school-identity';

export default function MyComponent() {
  return (
    <div className="flex items-center gap-4">
      <SchoolIdentityDisplay />
    </div>
  );
}
```

**Output**:
```
┌─────────────────────────────────────┐
│ [GS]  School                        │
│       Greenfield High School        │
└─────────────────────────────────────┘
```

**Behavior**:
- Shows badge + school name on desktop
- Shows badge + truncated name on mobile
- Shows warning if setup incomplete
- Handles loading state automatically

---

### 2. SchoolBadge

**Location**: Dashboard, settings, welcome banners

**Sizes**:
```jsx
import SchoolBadge from '@/components/school-badge';

// Small badge (headers, navigation)
<SchoolBadge size="sm" />  // 8x8px, text-xs

// Medium badge (default)
<SchoolBadge size="md" />  // 10x10px, text-sm

// Large badge (welcome banners, cards)
<SchoolBadge size="lg" />  // 16x16px, text-2xl
```

**With Custom Classes**:
```jsx
<SchoolBadge 
  size="lg" 
  className="shadow-lg ring-2 ring-blue-200"
/>
```

**Output Examples**:
```
Small:  [GS]
Medium: [GS]
Large:  [GS]
```

---

### 3. SchoolCompletionStatus

**Location**: Settings page, onboarding summary, status pages

**Usage**:
```jsx
import SchoolCompletionStatus from '@/components/school-completion-status';

export default function StatusPage() {
  return (
    <div className="space-y-4">
      <SchoolCompletionStatus />
      {/* Other content */}
    </div>
  );
}
```

**Complete Setup Output**:
```
✓ School Setup Complete
  Greenfield High School is fully configured...
```

**Incomplete Setup Output**:
```
⚠ School Setup Incomplete
  Please complete your school information...
  [Complete Setup]
```

---

### 4. useAuth Hook (Get School Data)

**Get school data from any component**:
```jsx
import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, loading, refreshUser } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <h1>{user.school_name}</h1>
      <p>{user.school_address}</p>
      <p>Setup complete: {user.isOnboardingComplete ? 'Yes' : 'No'}</p>

      {/* Refresh data if needed */}
      <button onClick={() => refreshUser()}>
        Refresh School Data
      </button>
    </div>
  );
}
```

---

## Real-World Examples

### Example 1: Welcome Banner (Dashboard)

```jsx
import { useAuth } from '@/contexts/AuthContext';
import SchoolBadge from '@/components/school-badge';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome banner when setup complete */}
      {user?.isOnboardingComplete && user?.school_name ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white"
        >
          <div className="flex items-center gap-4">
            <SchoolBadge size="lg" className="bg-white" />
            <div>
              <h1 className="text-2xl font-bold">
                Welcome to {user.school_name}
              </h1>
              <p className="text-blue-100">
                All features are now unlocked
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Rest of dashboard */}
    </div>
  );
}
```

### Example 2: Settings School Card

```jsx
import { useAuth } from '@/contexts/AuthContext';
import SchoolBadge from '@/components/school-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* School identity card at top */}
      {user?.isOnboardingComplete && user?.school_name ? (
        <Card className="border-2 border-blue-200">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-4">
              <SchoolBadge size="lg" />
              <div>
                <CardTitle>{user.school_name}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">✓ Configured</Badge>
                  <Badge className="bg-green-100 text-green-700">
                    ✓ Active
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {user.school_address && (
              <p className="text-sm text-gray-600">{user.school_address}</p>
            )}
          </CardContent>
        </Card>
      ) : null}

      {/* Settings tabs */}
      {/* ... rest of settings */}
    </div>
  );
}
```

### Example 3: Page Header with School

```jsx
import { useAuth } from '@/contexts/AuthContext';
import SchoolIdentityDisplay from '@/components/school-identity';

export default function PageWithSchoolHeader() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header with school identity */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          {user?.school_name && (
            <p className="text-gray-600 mt-1">
              {user.school_name} • {user.school_address}
            </p>
          )}
        </div>
      </div>

      {/* Page content */}
    </div>
  );
}
```

### Example 4: Custom School Display

```jsx
import { useAuth } from '@/contexts/AuthContext';
import SchoolBadge from '@/components/school-badge';

export default function CustomSchoolDisplay() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="animate-pulse">Loading school...</div>;
  }

  if (!user?.school_name) {
    return (
      <div className="text-yellow-600">
        ⚠ School information not available
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
      <SchoolBadge size="md" />
      <div>
        <p className="font-bold">{user.school_name}</p>
        <p className="text-sm text-gray-600">{user.school_address}</p>
      </div>
    </div>
  );
}
```

---

## Conditional Rendering Patterns

### Show Only If School Setup Complete

```jsx
import { useAuth } from '@/contexts/AuthContext';

export default function Component() {
  const { user } = useAuth();

  if (user?.isOnboardingComplete) {
    return <div>School is set up: {user.school_name}</div>;
  }

  return <div>Please complete school setup</div>;
}
```

### Show Different Content Based on School

```jsx
import { useAuth } from '@/contexts/AuthContext';

export default function Component() {
  const { user } = useAuth();

  return (
    <div>
      {user?.school_name === 'Greenfield High School' && (
        <div>Custom content for Greenfield</div>
      )}
      {user?.school_name !== 'Greenfield High School' && (
        <div>Default content for other schools</div>
      )}
    </div>
  );
}
```

---

## Refreshing School Data

### After School Update

```jsx
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function EditSchoolForm() {
  const { refreshUser } = useAuth();

  const handleSaveSchool = async (formData) => {
    try {
      const response = await fetch('/api/school/setup', {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refresh user data to show updated school name
        await refreshUser();
        toast.success('School updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update school');
    }
  };

  return (
    // Form component
    <div>
      <form onSubmit={handleSaveSchool}>
        {/* Form fields */}
      </form>
    </div>
  );
}
```

---

## Styling & Theming

### Custom Styling

```jsx
import SchoolBadge from '@/components/school-badge';

// Custom shadow
<SchoolBadge 
  size="lg" 
  className="shadow-2xl"
/>

// Custom ring
<SchoolBadge 
  size="md" 
  className="ring-2 ring-offset-2 ring-blue-300"
/>

// With animation
<SchoolBadge 
  size="lg" 
  className="hover:scale-110 transition-transform"
/>
```

### Dark Mode Automatic

All components automatically adapt to dark mode:
```jsx
// Light mode
<SchoolBadge /> // Blue gradient on white background

// Dark mode (automatic)
<SchoolBadge /> // Blue gradient adjusted for dark background
```

---

## Accessibility Notes

### Alt Text / Aria Labels
Components include built-in accessibility:
- School name as title attribute on badges
- Proper heading hierarchy maintained
- Color not only indicator (icons + text)
- High contrast in all modes

### Keyboard Navigation
All components are keyboard accessible:
- Tab through interactive elements
- Enter to activate buttons
- Escape to close dropdowns

### Screen Readers
Components work with screen readers:
- Semantic HTML structure
- ARIA labels where needed
- Status updates announced

---

## Common Issues & Solutions

### Issue: School name shows as `undefined`

**Cause**: User data not loaded or setup incomplete

**Solution**:
```jsx
// Check for data before rendering
{user?.school_name && <div>{user.school_name}</div>}

// Or handle loading
if (!user?.school_name) {
  return <div>School not configured</div>;
}
```

### Issue: School data not updating after setup

**Cause**: AuthContext cache not refreshed

**Solution**:
```jsx
const { refreshUser } = useAuth();

// After setup complete
await refreshUser();
// Component will re-render with new data
```

### Issue: Wrong school showing on mobile

**Cause**: Likely browser cache

**Solution**:
```jsx
// Force refresh on mount
useEffect(() => {
  refreshUser();
}, []);
```

---

## Best Practices

1. ✅ Always use `useAuth()` instead of localStorage
2. ✅ Handle loading and missing states
3. ✅ Call `refreshUser()` after school changes
4. ✅ Use SchoolBadge for consistency
5. ✅ Don't hardcode school names
6. ✅ Respect user's theme preference
7. ✅ Keep components responsive
8. ✅ Test with incomplete setup state

---

## Component Props Reference

### SchoolBadge
```typescript
interface SchoolBadgeProps {
  size?: 'sm' | 'md' | 'lg';    // Default: 'md'
  className?: string;             // Additional Tailwind classes
}
```

### SchoolIdentityDisplay
```typescript
interface SchoolIdentityDisplayProps {
  // No props - uses useAuth() internally
}
```

### SchoolCompletionStatus
```typescript
interface SchoolCompletionStatusProps {
  // No props - uses useAuth() internally
}
```

---

## File Locations

```
src/components/
├── school-identity.jsx              # Main component
├── school-badge.jsx                 # Reusable badge
└── school-completion-status.jsx     # Status indicator

src/contexts/
└── AuthContext.js                   # User data provider

src/app/
├── dashboard/
│   └── page.js                      # Welcome banner
├── settings/
│   └── page.js                      # Settings card
└── components/
    └── dashboard-layout.jsx         # Header integration
```
