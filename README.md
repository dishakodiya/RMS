# Resource Management System (RMS)

A complete frontend Resource Management System built with Next.js 16, Bootstrap 5, and TypeScript.

## Features

- **Role-based Authentication**: Admin, User, and Approver roles with dummy authentication
- **Dashboard**: Overview with statistics, charts, and recent bookings
- **User Management**: CRUD operations for users
- **Resource Management**: Manage resource types, buildings, and resources
- **Facilities**: Link facilities to resources
- **Bookings**: Create, view, approve, and reject bookings
- **Maintenance**: Schedule and track maintenance activities
- **Cupboards & Shelves**: Manage storage locations
- **Reports**: View resource-wise bookings, usage statistics, and maintenance history

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: Bootstrap 5
- **Icons**: Bootstrap Icons
- **Language**: TypeScript
- **Styling**: CSS with Bootstrap

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
rms-next/
├── app/                    # Next.js App Router pages
│   ├── login/              # Login page
│   ├── dashboard/          # Dashboard page
│   ├── users/              # Users management
│   ├── resource-types/     # Resource types management
│   ├── buildings/          # Buildings management
│   ├── resources/          # Resources management
│   ├── facilities/         # Facilities management
│   ├── bookings/           # Bookings management
│   ├── maintenance/        # Maintenance management
│   ├── cupboards/          # Cupboards management
│   ├── shelves/            # Shelves management
│   └── reports/            # Reports page
├── components/             # Reusable React components
│   ├── Navbar.tsx          # Navigation bar
│   ├── Sidebar.tsx         # Sidebar navigation
│   ├── Footer.tsx          # Footer component
│   ├── StatCard.tsx        # Statistics card
│   ├── Modal.tsx           # Modal component
│   ├── Toast.tsx           # Toast notification
│   └── StatusBadge.tsx     # Status badge component
├── data/                   # Static JSON data files
│   ├── users.json
│   ├── resourceTypes.json
│   ├── buildings.json
│   ├── resources.json
│   ├── facilities.json
│   ├── bookings.json
│   ├── maintenance.json
│   ├── cupboards.json
│   └── shelves.json
├── lib/                    # Utility functions and contexts
│   ├── auth.tsx            # Authentication context
│   └── data.ts             # Data helper functions
└── public/                 # Static assets
```

## Usage

### Login

1. Navigate to `/login`
2. Enter any email and password
3. Select a role (Admin, User, or Approver)
4. Click Login

**Note**: This is a frontend-only demo. Any email/password combination will work.

### Roles & Permissions

- **Admin**: Full access to all features
- **User**: Can view resources, create bookings, manage facilities, cupboards, and shelves
- **Approver**: Can view resources, approve/reject bookings, manage maintenance, and view reports

### Features by Page

#### Dashboard
- View total resources, bookings, pending approvals
- See upcoming bookings and maintenance alerts
- View monthly usage chart

#### Users Management
- View all users in a table
- Add, edit, or delete users
- Filter by role

#### Resource Types
- Manage resource types (Classroom, Lab, Auditorium)
- Add, edit, or delete resource types

#### Buildings
- Manage buildings with building numbers and floor counts
- Add, edit, or delete buildings

#### Resources
- Manage resources linked to buildings and resource types
- View facilities linked to each resource
- Add, edit, or delete resources

#### Facilities
- Link facilities to resources
- Add, edit, or delete facilities

#### Bookings
- Create new bookings (Users)
- Approve/reject bookings (Approvers/Admins)
- View booking status and details

#### Maintenance
- Schedule maintenance activities
- Track maintenance status
- Add notes and details

#### Cupboards & Shelves
- Manage storage cupboards
- Link shelves to cupboards
- Track capacity and descriptions

#### Reports
- View resource-wise booking statistics
- See resource type usage
- View monthly and yearly summaries
- Download reports (UI only)

## Data Storage

All data is stored in static JSON files in the `data/` directory. Changes are made in-memory during the session and are not persisted between page refreshes.

## Customization

### Adding New Features

1. Add data to the appropriate JSON file in `data/`
2. Update `lib/data.ts` with new types and helper functions
3. Create new pages in `app/` directory
4. Add navigation items to `components/Sidebar.tsx`

### Styling

- Global styles: `app/globals.css`
- Bootstrap customization: Override Bootstrap variables in `globals.css`
- Component-specific styles: Add CSS modules or inline styles

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- This is a **frontend-only** application with no backend or database
- Authentication is simulated using localStorage
- Data changes are not persisted between sessions
- All CRUD operations work in-memory only

## License

This project is created for demonstration purposes.
