# Accurate ERP

A production-ready, multi-tenant ERP SaaS application built with Next.js 15, TypeScript, Tailwind CSS 4, and Zod validation.

## Features

- **Modern Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Validation**: Zod schemas with React Hook Form integration
- **PWA Support**: Installable app with offline capabilities
- **Multi-tenant**: Organization-based architecture
- **Responsive Design**: Mobile-first, responsive UI
- **Form Management**: React Hook Form with Zod validation
- **Icon System**: Lucide React icons throughout

## Project Structure

```
accurate/
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Protected dashboard routes
│   │   └── dashboard/
│   │       ├── products/
│   │       ├── orders/
│   │       └── inventory/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── card.tsx
│   └── layout/              # Layout components
│       ├── sidebar.tsx
│       └── navbar.tsx
├── lib/
│   └── utils.ts             # Utility functions
├── types/
│   └── index.ts             # TypeScript types
└── public/
    ├── manifest.json        # PWA manifest
    └── icons/               # App icons
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Key Technologies

- **Next.js 15**: React framework with App Router
- **React 19**: Latest React version
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Modern utility-first styling
- **Zod**: Schema validation
- **React Hook Form**: Performant form validation
- **Lucide Icons**: Modern icon system
- **@ducanh2912/next-pwa**: PWA integration
- **@ducanh2912/next-pwa**: PWA integration

## PWA Features

- Installable on desktop and mobile
- Offline support with service worker
- App manifest for native-like experience
- Cached static assets for performance

## Design Decisions

### Server vs Client Components

- **Server Components** (default): Pages, layouts, static content
- **Client Components**: Forms, interactive UI, navigation state

### Routing Structure

- Route groups `(auth)` and `(dashboard)` for logical separation
- Nested layouts for shared UI (sidebar, navbar)
- Clean URLs without route group names

### Form Handling

- React Hook Form for performance and DX
- Inline validation with error messages
- Type-safe with TypeScript

### Styling

- Design tokens via CSS variables
- ERP-appropriate color scheme
- Responsive utilities
- Accessible components

## Future Integration

This application is designed to integrate with:

- Supabase Edge Functions (backend API)
- Supabase Auth (authentication)
- Supabase Database (PostgreSQL)

Authentication and data fetching placeholders are marked with `TODO` comments.

## License

MIT
