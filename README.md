# BillBuddy

**BillBuddy** is a modern, full-stack expense sharing application inspired by Splitwise. It simplifies splitting bills and tracking shared expenses among friends, roommates, and groups. Built with a focus on user experience and code quality, BillBuddy makes it easy to manage who owes what, settle debts, and keep track of group activities—all in one beautiful, responsive interface.

## 📖 About

Whether you're sharing rent with roommates, splitting dinner bills with friends, or managing group trip expenses, BillBuddy has you covered. The app automatically calculates balances, supports multiple splitting methods (equal, percentage-based, shares, and exact amounts), and provides real-time activity feeds to keep everyone in the loop. With features like friend management, social sharing, and secure authentication, BillBuddy makes expense tracking effortless and transparent.

## ✨ Features

- **🔐 Authentication**: Secure login and registration with JWT-based authentication
- **👥 Group Management**: Create groups, add members, and view detailed group information
- **💰 Expense Tracking**: Add expenses with flexible splitting options (equal, percentage, shares, exact amounts)
- **📊 Balance Calculation**: Automatically calculate who owes whom with smart debt simplification
- **💸 Settlements**: Record payments to settle debts and keep balances up-to-date
- **📈 Dashboard**: Get an overview of your groups, balances, and recent activities
- **🔗 Social Sharing**: Share the app with friends via shareable links
- **👤 Profile Management**: Update your name and profile details
- **📱 Activity Feed**: Track recent group activities, expenses, and settlements in real-time
- **🤝 Friend System**: Add and manage friends independent of groups for easier expense sharing

## 🛠 Tech Stack

### Frontend
- **React** (v18.2) - UI Library for building interactive interfaces
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vite** - Next-generation frontend build tool for fast development
- **TanStack React Query** (v5.90) - Powerful data synchronization and caching
- **React Router** (v7.9) - Declarative routing for React applications
- **Axios** - Promise-based HTTP client for API requests
- **Lucide React** - Beautiful, consistent icon library
- **React Hook Form** - Performant form validation library
- **date-fns** - Modern date utility library

### Backend
- **Node.js** - JavaScript runtime environment
- **Express** - Fast, minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **JWT** - Secure token-based authentication
- **TypeScript** - Type-safe backend development

## 🚀 TanStack React Query Integration

BillBuddy leverages **TanStack React Query** (formerly React Query) for efficient server state management, providing a seamless user experience with automatic caching, background refetching, and optimistic updates.

### Why React Query?

React Query eliminates the need for manual state management of server data by providing:
- **Automatic Caching**: Reduces unnecessary API calls and improves performance
- **Background Refetching**: Keeps data fresh without user intervention
- **Optimistic Updates**: Instant UI feedback while mutations are in progress
- **Query Invalidation**: Smart cache invalidation after data mutations
- **Loading & Error States**: Built-in handling of async states
- **Devtools**: Powerful debugging tools for query inspection

### Setup

React Query is initialized in `client/src/main.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
```

### Usage Patterns

#### 1. **Data Fetching with `useQuery`**

Used throughout the app to fetch and cache server data:

```typescript
// Example from GroupsPage.tsx
const { data: groups, isLoading } = useQuery({
  queryKey: ['groups'],
  queryFn: async () => {
    const { data } = await api.get<Group[]>('/groups');
    return data;
  },
});
```

**Key Features:**
- `queryKey`: Unique identifier for caching and invalidation
- `queryFn`: Async function that fetches data
- Automatic caching and background refetching
- Built-in loading states

#### 2. **Data Mutations with `useMutation`**

Used for creating, updating, and deleting data:

```typescript
// Example from GroupsPage.tsx
const queryClient = useQueryClient();

const createGroupMutation = useMutation({
  mutationFn: async (name: string) => {
    await api.post('/groups', { name });
  },
  onSuccess: () => {
    // Invalidate and refetch groups after successful creation
    queryClient.invalidateQueries({ queryKey: ['groups'] });
    setIsModalOpen(false);
  },
});

// Trigger mutation
createGroupMutation.mutate(newGroupName);
```

**Key Features:**
- `mutationFn`: Async function that performs the mutation
- `onSuccess`: Callback for cache invalidation and UI updates
- Built-in loading and error states via `isPending` and `isError`
- Automatic retry logic for failed mutations

#### 3. **Cache Invalidation**

After mutations, React Query intelligently invalidates and refetches affected queries:

```typescript
// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: ['groups'] });
queryClient.invalidateQueries({ queryKey: ['group', groupId] });

// Invalidate multiple related queries
queryClient.invalidateQueries({ queryKey: ['dashboard'] });
```

### Implementation Examples

**GroupsPage** (`client/src/pages/GroupsPage.tsx`):
- Fetches all groups with `useQuery`
- Creates new groups with `useMutation`
- Automatically refetches after creation

**GroupDetailsPage** (`client/src/pages/GroupDetailsPage.tsx`):
- Fetches group details, expenses, and balances
- Handles complex nested data structures
- Invalidates related queries after expense/settlement mutations

**DashboardPage** (`client/src/pages/DashboardPage.tsx`):
- Aggregates data from multiple queries
- Shows recent activities and balance summaries
- Keeps dashboard data fresh with background refetching

**Modal Components** (`AddExpenseModal`, `SettleUpModal`, `AddMemberModal`):
- Use mutations for creating expenses, settlements, and adding members
- Provide instant feedback with loading states
- Invalidate parent queries to refresh UI automatically

### Benefits in BillBuddy

1. **Performance**: Reduced API calls through intelligent caching
2. **UX**: Instant feedback with optimistic updates and loading states
3. **Maintainability**: Cleaner code without manual state management
4. **Reliability**: Automatic retry and error handling
5. **Developer Experience**: Built-in devtools for debugging queries

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or Atlas)

### Backend Setup
1. Navigate to `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Folder Structure

```
/
├── client/                 # Frontend React App
├── server/                 # Backend Node App
```

## Future Improvements

- Email notifications (currently disabled).
- Mobile App (React Native).

