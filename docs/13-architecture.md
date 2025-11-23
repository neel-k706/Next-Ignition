# Architecture Overview

## System Architecture

### Technology Stack
- **Frontend**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: React Context API
- **Styling**: StyleSheet with Theme System
- **Backend**: Supabase (planned)
- **Authentication**: Supabase Auth
- **Storage**: AsyncStorage (local), Supabase Storage (cloud)

### Project Structure
```
app/
  (auth)/          # Authentication screens
  (tabs)/          # Main app screens (tab navigation)
  (admin)/         # Admin dashboard screens
components/        # Reusable components
contexts/          # React contexts (Auth, etc.)
hooks/             # Custom React hooks
constants/         # Theme, roles, etc.
types/             # TypeScript types
utils/             # Utility functions
docs/              # Documentation
```

## Design Patterns

### Component Architecture
- **Functional Components**: All components use React hooks
- **Custom Hooks**: Shared logic extracted to hooks
- **Context API**: Global state management
- **Component Composition**: Reusable, composable components

### State Management
- **Local State**: useState for component state
- **Context**: AuthContext for user authentication
- **Custom Hooks**: useConversations, useNotifications, etc.
- **Mock Data**: useMockData for development

### Navigation
- **Expo Router**: File-based routing
- **Tab Navigation**: Bottom tabs (mobile)
- **Stack Navigation**: Screen stacks
- **Sidebar**: Desktop navigation

## Key Components

### Core Components
- **Button**: Reusable button component
- **Input**: Form input component
- **Header**: App header with navigation
- **ProfileMenu**: User profile menu
- **Sidebar**: Desktop navigation
- **ErrorBoundary**: Error handling

### Feature Components
- **Chat Components**: MessageBubble, ChatInput, etc.
- **Funding Components**: OpportunityCard, FilterModal
- **Admin Components**: AnalyticsWidget, UserCard

## Data Flow

### Authentication Flow
1. User logs in
2. AuthContext manages session
3. Profile data loaded
4. Role-based routing
5. Dashboard displayed

### Data Fetching
- **Mock Data**: Currently using mock data
- **API Integration**: Ready for Supabase
- **Real-time**: WebSocket support (future)

## Security

### Authentication
- Email/password authentication
- JWT tokens
- Session management
- Password encryption

### Data Protection
- Encrypted storage
- Secure transmission (HTTPS)
- Access control
- Privacy settings

## Performance

### Optimization
- Lazy loading
- Code splitting
- Image optimization
- Memoization

### Caching
- Local storage
- AsyncStorage
- Image caching
- Data caching

## Scalability

### Modular Design
- Feature-based organization
- Reusable components
- Shared utilities
- Clear separation of concerns

### Extensibility
- Plugin architecture (future)
- API integration ready
- Customizable themes
- Configurable features

