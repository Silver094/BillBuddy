# BillBuddy

A full-stack expense sharing application built with React, Node.js, TypeScript, and MongoDB.

## Features

- **Authentication**: Secure login and registration with JWT.
- **Group Management**: Create groups, add members, and view group details.
- **Expense Tracking**: Add expenses, split equally among members.
- **Balance Calculation**: Automatically calculate who owes whom.
- **Settlements**: Record payments to settle debts.
- **Dashboard**: Overview of your groups and activities.
- **Social Sharing**: Share the app with friends via link.
- **Profile Management**: Update your name and profile details.
- **Advanced Splitting**: Support for unequal splits (percentages, shares, exact amounts).
- **Activity Feed**: Track recent group activities and expenses.
- **Friend System**: Add and manage friends independent of groups.

## Tech Stack

### Frontend
- **React**: UI Library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Vite**: Build tool
- **React Query**: Data fetching
- **React Router**: Navigation

### Backend
- **Node.js**: Runtime
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **JWT**: Authentication

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

