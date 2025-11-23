# Component Library Documentation

## Overview

Reusable components used throughout the NextIgnition platform.

## Core Components

### Button
**Location**: `components/Button.tsx`

**Props**:
- `title`: string - Button text
- `onPress`: () => void - Press handler
- `variant?`: 'primary' | 'outline' | 'ghost'
- `loading?`: boolean - Loading state
- `disabled?`: boolean - Disabled state
- `style?`: StyleProp - Custom styles

**Usage**:
```tsx
<Button
  title="Submit"
  onPress={handleSubmit}
  variant="primary"
  loading={isLoading}
/>
```

### Input
**Location**: `components/Input.tsx`

**Props**:
- `label`: string - Input label
- `value`: string - Input value
- `onChangeText`: (text: string) => void
- `placeholder?`: string
- `type?`: 'text' | 'email' | 'password'
- `multiline?`: boolean
- `icon?`: ReactNode

**Usage**:
```tsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  type="email"
  placeholder="Enter email"
/>
```

### ProfileMenu
**Location**: `components/ProfileMenu.tsx`

**Props**:
- `visible`: boolean - Menu visibility
- `onClose`: () => void - Close handler

**Usage**:
```tsx
<ProfileMenu
  visible={menuVisible}
  onClose={() => setMenuVisible(false)}
/>
```

### Sidebar
**Location**: `components/navigation/Sidebar.tsx`

**Props**: None (uses context)

**Usage**:
```tsx
<Sidebar />
```

## Chat Components

### MessageBubble
**Location**: `components/chat/MessageBubble.tsx`

**Props**:
- `message`: Message object
- `isOwn`: boolean - Is own message
- `showAvatar?`: boolean

### ChatInput
**Location**: `components/chat/ChatInput.tsx`

**Props**:
- `onSend`: (message: string) => void
- `placeholder?`: string

### ConversationItem
**Location**: `components/chat/ConversationItem.tsx`

**Props**:
- `conversation`: Conversation object
- `onPress`: () => void
- `isSelected?`: boolean

## Admin Components

### AnalyticsWidget
**Location**: `components/admin/AnalyticsWidget.tsx`

**Props**:
- `title`: string
- `value`: string | number
- `change?`: number
- `icon?`: ReactNode

### UserCard
**Location**: `components/admin/UserCard.tsx`

**Props**:
- `user`: User object
- `onPress?`: () => void

## Utility Components

### ErrorBoundary
**Location**: `components/ErrorBoundary.tsx`

**Props**:
- `children`: ReactNode
- `fallback?`: ReactNode

**Usage**:
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### LoadingScreen
**Location**: `components/LoadingScreen.tsx`

**Props**:
- `message?`: string

### EmptyState
**Location**: `components/EmptyState.tsx`

**Props**:
- `icon?`: ReactNode
- `title`: string
- `message`: string
- `action?`: { label: string; onPress: () => void }

## Component Patterns

### Styling
- Use theme constants from `constants/theme.ts`
- Consistent spacing and typography
- Responsive design with `useResponsive` hook

### Accessibility
- ARIA labels on interactive elements
- Proper semantic structure
- Keyboard navigation support

### Performance
- Memoization where needed
- Lazy loading for heavy components
- Optimized re-renders

## Custom Hooks

### useResponsive
**Location**: `hooks/useResponsive.ts`

Returns:
- `isMobile`: boolean
- `isTablet`: boolean
- `isDesktop`: boolean

### useNotifications
**Location**: `hooks/useNotifications.ts`

Returns:
- `notifications`: Notification[]
- `unreadCount`: number
- `markAsRead`: (id: string) => void
- `markAllAsRead`: () => void

### useConversations
**Location**: `hooks/useChat.ts`

Returns:
- `conversations`: Conversation[]
- `totalUnread`: number
- `loading`: boolean

## Theme System

### Colors
- Primary, accent, navy
- Background, surface, text
- Success, warning, error

### Typography
- Font families
- Font sizes
- Font weights

### Spacing
- Consistent spacing scale
- xs, sm, md, lg, xl, xxl

### Shadows
- xs, sm, md, lg
- Consistent elevation

