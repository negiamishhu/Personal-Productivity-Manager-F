# Productivity Manager - Frontend

A modern Personal Productivity Manager web application built with Next.js 16, featuring server-side rendering, TailwindCSS styling, and seamless integration with a Node.js backend API.

## Tech Stack

- **Framework:** Next.js 16 (with App Router)
- **Styling:** TailwindCSS
- **Icons:** Lucide React
- **Charts:** Recharts
- **Authentication:** JWT (localStorage)
- **HTTP Client:** Fetch API

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin panel
│   │   ├── dashboard/          # Dashboard (SSR)
│   │   ├── expenses/
│   │   │   ├── [id]/          # Expense details
│   │   │   ├── add/           # Add/Edit expense
│   │   │   └── page.jsx       # Expenses list
│   │   ├── tasks/
│   │   │   ├── [id]/         # Task details
│   │   │   ├── add/          # Add/Edit task
│   │   │   └── page.jsx      # Tasks list
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── layout.jsx        # Root layout
│   │   └── page.jsx           # Home/redirect page
│   └── components/
│       └── Layout.jsx        # Main layout with sidebar
├── public/                    # Static assets
├── tailwind.config.js        # Tailwind configuration
├── next.config.js            # Next.js configuration
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production, update with your deployed backend URL:
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Pages & Routes

### Public Pages

1. **`/login`** - User login page
   - Email/password authentication
   - Demo account buttons
   - Real-time validation

2. **`/register`** - User registration
   - Name, email, password
   - Password strength indicator
   - Email validation

3. **`/`** - Home page (redirects to dashboard or login)

### Protected Pages (Require Authentication)

4. **`/dashboard`** - Main dashboard
   - Stats cards (Income, Expenses, Net Balance, Tasks)
   - Charts (Expenses by Category, Tasks by Status)
   - Recent activity feed
   - Server-side rendered

5. **`/expenses`** - Expenses list
   - Tabs: "Your Expenses" / "User Expenses" (admin)
   - Filters (type, category, date range, amount)
   - Pagination and sorting
   - Search functionality
   - View/Edit/Delete actions

6. **`/expenses/add`** - Add/Edit expense
   - Full expense form
   - Available balance display (new expenses)
   - Budget validation

7. **`/expenses/[id]`** - Expense details
   - Complete expense information
   - Quick actions (Edit, Delete)

8. **`/tasks`** - Tasks list
   - Tabs: "Your Tasks" / "User Tasks" (admin)
   - Filters (status, priority, due date)
   - Pagination and sorting
   - Search functionality
   - View/Edit/Delete actions

9. **`/tasks/add`** - Add/Edit task
   - Full task form
   - Task count notification by date
   - Status and priority management

10. **`/tasks/[id]`** - Task details
    - Complete task information
    - Quick actions (Edit, Delete)

### Admin Pages

11. **`/admin`** - Admin control panel
    - Overview stats
    - All users table
    - All expenses (regular users only)
    - All tasks (regular users only)
    - Requires admin role

## Features

### Authentication
- ✅ JWT-based authentication
- ✅ Access tokens stored in localStorage
- ✅ Role-based UI rendering
- ✅ Protected routes
- ✅ Auto-logout on token expiry

### User Interface
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Modern UI with TailwindCSS
- ✅ Lucide React icons throughout
- ✅ Recharts for data visualization
- ✅ Loading states
- ✅ Error handling

### Expenses Module
- ✅ CRUD operations
- ✅ Advanced filtering
- ✅ Pagination
- ✅ Sorting by date/amount
- ✅ Budget validation
- ✅ Category and payment method tracking
- ✅ Income vs Expense tracking

### Tasks Module
- ✅ CRUD operations
- ✅ Status management (pending, in-progress, completed)
- ✅ Priority levels (low, medium, high)
- ✅ Due date tracking
- ✅ Task count notifications
- ✅ Overdue detection

### Dashboard
- ✅ Real-time statistics
- ✅ Visual charts (Pie, Bar)
- ✅ Recent activity feed
- ✅ Server-side rendering
- ✅ Responsive grid layout

### Admin Features
- ✅ User management
- ✅ View all expenses (regular users)
- ✅ View all tasks (regular users)
- ✅ Platform statistics
- ✅ Role-based access control

## Customization

### Colors

The app uses a custom color scheme defined in `tailwind.config.js`:

```js
colors: {
  'brown-m': '#5D4037',
  'work-bg': '#FAF9F5',
  'common-bg': '#FFFBEB',
}
```

### Styling

- Background: `bg-work-bg` (#FAF9F5)
- Headers: `bg-brown-m` (#5D4037)
- Sidebar: Dark brown gradient
- Cards: White with rounded corners and shadows

## API Integration

The frontend communicates with the backend API:

1. All API calls include JWT token in headers
2. Automatic retry on token expiry
3. Error handling with user-friendly messages
4. Loading states during API calls

## Deployment

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect GitHub repository to Vercel
3. Add environment variables
4. Deploy

```bash
npm run build
vercel
```
 

## Build Configuration

The project uses:
- Next.js 16 with App Router
- Server-side rendering for dashboard
- Client-side rendering for interactive pages
- TailwindCSS for styling
- ESLint for code quality

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Key Technologies

- **Next.js 16:** React framework with SSR
- **TailwindCSS:** Utility-first CSS
- **Lucide React:** Icon library
- **Recharts:** Chart library
- **React Hooks:** State management
 
