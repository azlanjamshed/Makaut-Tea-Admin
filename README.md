# MAKAUT Rant — Admin Control Center

A modern, desktop-first **Admin Dashboard & Moderation Console** for the MAKAUT university rant platform built with React, Tailwind CSS, Vite, and JavaScript.

---

## 🚀 Quick Start

### 1. Prerequisites
Ensure MongoDB and `rant-backend` are running on port `5001`.

```bash
# In rant-backend directory:
npm run dev

# If you haven't seeded the admin user yet:
npm run seed:admin
```

### 2. Run Admin Console
```bash
# In rant-admin directory:
npm install
npm run dev
```

Open your browser at: **[http://localhost:5174](http://localhost:5174)**

---

## 🔑 Default Admin Credentials
- **Email:** `admin@makaut.edu`
- **Password:** `Admin@123456`
- **Role:** `admin`

---

## 🎯 Architecture & Features Adhering to Roadmap

### 1. Strict Roadmap Status Colors
- **Active** → Green (`#10B981`)
- **Pending** → Yellow (`#F59E0B`)
- **Investigating** → Blue (`#0284C7`)
- **Resolved** → Green (`#10B981`)
- **Rejected** → Gray (`#64748B`)
- **Hidden** → Orange (`#F97316`)
- **Deleted** → Red (`#EF4444`)
- **Suspended** → Orange/Amber (`#F59E0B`)
- **Banned** → Red (`#DC2626`)

### 2. Layout & Navigation
- **Desktop Sidebar:** Fixed sidebar with MAKAUT logo, Dashboard (🏠), Rants (📝), Reports (🚨), Users (👥), Settings (⚙), Profile (👤), Logout.
- **Mobile Navigation:** Responsive drawer triggered via hamburger button.
- **Top Header:** Page breadcrumbs, Global Search trigger (`⌘K`), Theme switch (Dark / Light), and Admin Profile shortcut.

### 3. Dashboard Overview
- **7 KPI Cards:** Total Users, Total Rants, Total Comments, Total Reactions, Today's Rants, Today's Active Users, Pending Reports badge.
- **Interactive Velocity Chart:** Platform activity chart supporting Today, 7 Days, and 30 Days intervals.
- **Live Widgets:** Recent rants and pending reports with quick navigation.

### 4. Rant Moderation
- Table & mobile card views with search, department filtering, and status filtering (`All`, `Active`, `Hidden`, `Deleted`).
- State-dependent action menus:
  - *Active:* View, Hide, Delete
  - *Hidden:* View, Unhide, Delete
  - *Deleted:* View, Restore
- Dedicated moderation modals with optional reasons for hiding and soft-deleting.

### 5. Report Resolution
- Review target items (`Post`, `Comment`, `User`).
- Filter by status (`Pending`, `Investigating`, `Resolved`, `Rejected`).
- Resolution actions: *Hide Post*, *Delete Post*, *Suspend User*, *Ban User*, or *Dismiss* with audit notes.

### 6. User Management
- Filter by role (`Student`, `Admin`) and status (`Active`, `Suspended`, `Banned`).
- Detailed profile inspector with activity counts (rants, comments, reactions).
- Suspension modal with configurable duration (`1`, `3`, `7`, `14`, `30 days`) and reason.
- Permanent ban modal with destructive warning and justification.
- Instant access restoration.

### 7. Global Search (`⌘K` / `Ctrl+K`)
- Unified command search grouping results by **Rants**, **Users**, and **Reports**.
